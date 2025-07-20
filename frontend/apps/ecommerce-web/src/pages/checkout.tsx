import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/lib/stores/useCartStore';
import { useBranchStore } from '@/lib/stores/useBranchStore';

export default function Checkout() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const { user } = useAuth();
  const { selectedBranch } = useBranchStore();
  const { items: cartItems, getTotalPrice, clearCart } = useCartStore();

  const total = getTotalPrice();

  const handlePlaceOrder = async () => {
    setProcessing(true);

    try {
      if (!user) {
        alert('Please log in to place an order');
        return;
      }

      // Create order in order management service
      const orderData = {
        customerId: (user as any).id,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        totalAmount: total,
        shippingAddress: {
          street: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          pincode: shippingDetails.pincode,
        },
        branchId: selectedBranch?.id,
      };

      const orderResponse = await fetch('/api/order-management/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }
      
      const order = await orderResponse.json();

      if (order.id) {
        // Create payment with Razorpay
        const paymentData = {
          orderId: order.id,
          amount: total * 100, // Convert to paise
          currency: 'INR',
          customerId: (user as any).id,
          customerEmail: (user as any).email,
          customerPhone: (user as any).phone || '9999999999',
        };

        const paymentResponse = await fetch('/api/payment-processing/razorpay/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData),
        });
        
        if (!paymentResponse.ok) {
          throw new Error('Failed to create payment');
        }
        
        const razorpayData = await paymentResponse.json();

        if (razorpayData.success) {
          // Open Razorpay checkout
          const options = {
            key: razorpayData.key,
            amount: razorpayData.amount,
            currency: razorpayData.currency,
            name: 'LeafyHealth',
            description: `Order #${order.id}`,
            order_id: razorpayData.razorpayOrderId,
            handler: async function (response: any) {
              try {
                // Verify payment
                const verificationData = {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: order.id,
                };

                const verifyResponse = await fetch('/api/payment-processing/razorpay/verify', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(verificationData),
                });
                
                if (!verifyResponse.ok) {
                  throw new Error('Payment verification failed');
                }
                
                const verification = await verifyResponse.json();

                if (verification.success) {
                  // Send order confirmation notification
                  await fetch('/api/notification-service/send', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userId: (user as any).id,
                      type: 'order_confirmation',
                      title: 'Order Confirmed',
                      message: `Your order #${order.id} has been confirmed and will be delivered soon.`,
                      channel: 'email',
                    }),
                  });

                  // Clear cart
                  clearCart();

                  // Redirect to success page
                  router.push(`/order-success?orderId=${order.id}`);
                } else {
                  alert('Payment verification failed. Please contact support.');
                }
              } catch (error) {
                console.error('Payment verification error:', error);
                alert('Payment processing error. Please contact support.');
              }
            },
            prefill: {
              name: (user as any).name,
              email: (user as any).email,
              contact: (user as any).phone || '9999999999',
            },
            theme: {
              color: '#22c55e',
            },
          };

          // @ts-ignore
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          alert('Payment initialization failed. Please try again.');
        }
      } else {
        alert('Order creation failed. Please try again.');
      }
    } catch (error) {
      console.error('Order processing error:', error);
      alert('Order failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <>
        <Head>
          <title>Order Confirmed - Sri Venkateswara Organic Foods</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
          <Header />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="pt-24 pb-16 px-4"
          >
            <div className="max-w-2xl mx-auto text-center">
              <GlassCard className="p-12">
                <div className="text-6xl mb-6">✅</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
                <p className="text-xl text-gray-600 mb-6">
                  Thank you for your order. We'll deliver your fresh groceries within 30 minutes.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-semibold">Order #SVF-2025-001</p>
                  <p className="text-green-600">Estimated delivery: 6:30 PM - 7:00 PM</p>
                </div>
                <button
                  onClick={() => (window.location.href = '/order-history')}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Track Your Order
                </button>
              </GlassCard>
            </div>
          </motion.div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - Sri Venkateswara Organic Foods</title>
        <meta name="description" content="Complete your order and schedule delivery" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="pt-24 pb-16 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl font-bold text-gray-900 mb-8"
            >
              Checkout
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-6"
                >
                  {/* Delivery Information */}
                  <GlassCard className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="రాజు"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="కుమార్"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Address
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          rows={3}
                          placeholder="House No, Street Name, Locality, Vijayawada, Andhra Pradesh"
                        />
                      </div>
                    </div>
                  </GlassCard>

                  {/* Delivery Time */}
                  <GlassCard className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Time</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-green-600 bg-green-50 rounded-lg p-4 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-green-800">Express Delivery</p>
                            <p className="text-sm text-green-600">Within 30 minutes</p>
                          </div>
                          <div className="text-green-600">🚚</div>
                        </div>
                      </div>
                      <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-700">Schedule Delivery</p>
                            <p className="text-sm text-gray-500">Choose your time</p>
                          </div>
                          <div className="text-gray-400">📅</div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Payment Method */}
                  <GlassCard className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                    <div className="space-y-3">
                      <div className="border-2 border-green-600 bg-green-50 rounded-lg p-4 cursor-pointer">
                        <div className="flex items-center">
                          <input type="radio" name="payment" className="mr-3" defaultChecked />
                          <div>
                            <p className="font-semibold text-green-800">Cash on Delivery</p>
                            <p className="text-sm text-green-600">Pay when your order arrives</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-300">
                        <div className="flex items-center">
                          <input type="radio" name="payment" className="mr-3" />
                          <div>
                            <p className="font-semibold text-gray-700">Razorpay (UPI/Card)</p>
                            <p className="text-sm text-gray-500">Pay securely online</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <GlassCard className="p-6 sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            {item.name_telugu && (
                              <p className="text-sm text-gray-500">{item.name_telugu}</p>
                            )}
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-6"
                    >
                      Place Order
                    </button>
                  </GlassCard>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <Footer />
      </div>
    </>
  );
}
