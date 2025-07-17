import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ChevronLeft, MapPin, Phone, Mail, CreditCard, CheckCircle } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/lib/stores/useCartStore';
import { useBranchStore } from '@/lib/stores/useBranchStore';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { selectedBranch } = useBranchStore();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: selectedBranch?.city || '',
    pincode: '',
    paymentMethod: 'cod' // Cash on Delivery by default
  });

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/cart');
    }
  }, [items, orderComplete, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast.error('Please fill all required fields');
      return false;
    }
    
    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    
    if (formData.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order ID
      const newOrderId = 'ORD' + Date.now();
      setOrderId(newOrderId);
      
      // Save order to localStorage
      const order = {
        id: newOrderId,
        userId: user?.id,
        items: items,
        total: getTotalPrice(),
        deliveryAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode
        },
        branchId: selectedBranch?.id,
        paymentMethod: formData.paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      // Get existing orders
      const existingOrders = JSON.parse(localStorage.getItem('leafyhealth-orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('leafyhealth-orders', JSON.stringify(existingOrders));
      
      // Clear cart
      clearCart();
      
      // Show success
      setOrderComplete(true);
      toast.success('Order placed successfully!');
      
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <MobileLayout>
        <Head>
          <title>Order Confirmed - LeafyHealth</title>
        </Head>
        
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-md mx-auto">
            <Card className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-4">
                Your order #{orderId} has been placed successfully.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                We'll deliver your organic groceries within 24-48 hours.
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/profile')}
                  className="w-full"
                >
                  View My Orders
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <Head>
        <title>Checkout - LeafyHealth</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center p-4">
            <button onClick={() => router.back()}>
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold ml-4">Checkout</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Order Summary */}
          <Card className="p-4">
            <h2 className="font-semibold mb-3">Order Summary</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Delivery Information */}
          <Card className="p-4">
            <h2 className="font-semibold mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Delivery Information
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Full Name *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Phone Number *</label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Delivery Address *</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House no, Street, Area"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">City *</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600">Pincode *</label>
                  <Input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-4">
            <h2 className="font-semibold mb-3 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Method
            </h2>
            
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <span>Cash on Delivery</span>
              </label>
              
              <label className="flex items-center p-3 border rounded-lg cursor-pointer opacity-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  disabled
                  className="mr-3"
                />
                <span>Online Payment (Coming Soon)</span>
              </label>
            </div>
          </Card>

          {/* Place Order Button */}
          <Button 
            type="submit" 
            className="w-full h-12"
            disabled={isProcessing || items.length === 0}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </Button>
        </form>
      </div>
    </MobileLayout>
  );
}