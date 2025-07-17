import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import MobileLayout from '@/components/layout/MobileLayout';
import GlassCard from '@/components/ui/GlassCard';

interface OrderStatus {
  id: string;
  status: string;
  timestamp: string;
  description: string;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
  total: number;
  items: any[];
  shippingAddress: any;
  trackingNumber?: string;
  statusHistory: OrderStatus[];
}

export default function TrackOrderPage() {
  const router = useRouter();
  const { id } = router.query;
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingInput, setTrackingInput] = useState('');

  useEffect(() => {
    if (id) {
      fetchOrderDetails(id as string);
    }
  }, [id]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      console.log('Fetching order details for:', orderId);
      const response = await fetch(`/api/direct-data/orders/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        console.log('Order details:', orderData);
        setOrderDetails(orderData.data);
      } else {
        console.error('Failed to fetch order details:', response.status);
        // Fallback order data for demonstration
        setOrderDetails({
          id: orderId,
          orderNumber: `ORD-${orderId.slice(-8)}`,
          status: 'shipped',
          createdAt: '2025-07-05T06:00:00Z',
          estimatedDelivery: '2025-07-06T18:00:00Z',
          total: 1299,
          items: [
            { name: 'Organic Vegetables Box', quantity: 1, price: 699 },
            { name: 'Fresh Fruits Combo', quantity: 1, price: 399 },
            { name: 'Organic Rice 5kg', quantity: 1, price: 201 },
          ],
          shippingAddress: {
            street: '123 Main Street',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001',
          },
          trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          statusHistory: [
            {
              id: '1',
              status: 'Order Placed',
              timestamp: '2025-07-05T06:00:00Z',
              description: 'Your order has been placed successfully',
            },
            {
              id: '2',
              status: 'Confirmed',
              timestamp: '2025-07-05T07:30:00Z',
              description: 'Order confirmed and being prepared',
            },
            {
              id: '3',
              status: 'Shipped',
              timestamp: '2025-07-05T14:00:00Z',
              description: 'Order has been shipped and is on the way',
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = () => {
    if (trackingInput.trim()) {
      fetchOrderDetails(trackingInput.trim());
    }
  };

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    }

    switch (status.toLowerCase()) {
      case 'shipped':
      case 'out for delivery':
        return <TruckIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <ClockIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Head>
        <title>Track Order - LeafyHealth</title>
        <meta name="description" content="Track your order status and delivery information" />
      </Head>

      <MobileLayout>
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Track Order</h1>

          {/* Track Order Input */}
          {!id && (
            <GlassCard className="p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">Enter Order Details</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Order ID or Tracking Number"
                  value={trackingInput}
                  onChange={e => setTrackingInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleTrackOrder}
                  className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-600 transition-colors"
                >
                  Track Order
                </button>
              </div>
            </GlassCard>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              {/* Order Summary */}
              <GlassCard className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Order #{orderDetails.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(orderDetails.createdAt)}
                    </p>
                    {orderDetails.trackingNumber && (
                      <p className="text-sm text-gray-600">
                        Tracking: {orderDetails.trackingNumber}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        orderDetails.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : orderDetails.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {orderDetails.status?.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Total Amount:</span>
                    <span className="font-semibold">₹{orderDetails.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Items:</span>
                    <span>{orderDetails.items.length} items</span>
                  </div>
                </div>
              </GlassCard>

              {/* Delivery Info */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Delivery Address</p>
                      <p className="text-sm text-gray-600">
                        {orderDetails.shippingAddress?.street}
                        <br />
                        {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.state}
                        <br />
                        {orderDetails.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ClockIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Estimated Delivery</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(orderDetails.estimatedDelivery)}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Order Status Timeline */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-4">Order Status</h3>
                <div className="space-y-4">
                  {orderDetails.statusHistory.map((status, index) => {
                    const isCompleted = true; // All statuses in history are completed
                    const isLast = index === orderDetails.statusHistory.length - 1;

                    return (
                      <div key={status.id} className="flex items-start space-x-3">
                        <div className="flex flex-col items-center">
                          {getStatusIcon(status.status, isCompleted)}
                          {!isLast && <div className="w-0.5 h-8 bg-gray-200 mt-2" />}
                        </div>
                        <div className="flex-1 pb-2">
                          <h4 className="font-medium text-gray-800">{status.status}</h4>
                          <p className="text-sm text-gray-600">{status.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(status.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Order Items */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          🥬
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">₹{item.price?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Contact Support */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-600 transition-colors">
                    <PhoneIcon className="h-5 w-5" />
                    <span>Call Support</span>
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                    Chat with Us
                  </button>
                </div>
              </GlassCard>
            </div>
          ) : (
            <GlassCard className="p-8 text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Not Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find an order with that ID. Please check and try again.
              </p>
              <button
                onClick={() => setTrackingInput('')}
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                Try Again
              </button>
            </GlassCard>
          )}
        </div>
      </MobileLayout>
    </>
  );
}
