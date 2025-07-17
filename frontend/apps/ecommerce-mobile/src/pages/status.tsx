import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import MobileLayout from '@/components/layout/MobileLayout';
import GlassCard from '@/components/ui/GlassCard';

export default function StatusPage() {
  const router = useRouter();
  const { type, message, orderId } = router.query;
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId as string);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/direct-data/orders/${id}`);
      if (response.ok) {
        const orderData = await response.json();
        setOrderDetails(orderData.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-16 w-16 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-16 w-16 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-16 w-16 text-yellow-500" />;
      case 'shipped':
        return <TruckIcon className="h-16 w-16 text-blue-500" />;
      default:
        return <ShoppingBagIcon className="h-16 w-16 text-gray-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (type) {
      case 'success':
        return 'Success!';
      case 'error':
        return 'Error Occurred';
      case 'pending':
        return 'Processing...';
      case 'shipped':
        return 'Order Shipped';
      default:
        return 'Status Update';
    }
  };

  const getStatusColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      case 'shipped':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
      <Head>
        <title>Status - LeafyHealth</title>
        <meta name="description" content="Order and operation status updates" />
      </Head>

      <MobileLayout>
        <div className="px-4 py-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading status...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="p-8 text-center">
                  <div className="mb-6 flex justify-center">{getStatusIcon()}</div>

                  <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
                    {getStatusTitle()}
                  </h1>

                  {message && (
                    <p className="text-gray-600 mb-6">{decodeURIComponent(message as string)}</p>
                  )}

                  {orderId && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-600 mb-1">Order ID</p>
                      <p className="font-semibold text-gray-800">#{orderId}</p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>

              {/* Order Details */}
              {orderDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Number:</span>
                        <span className="font-semibold">{orderDetails.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-semibold capitalize ${getStatusColor()}`}>
                          {orderDetails.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold">
                          ₹{orderDetails.total?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items:</span>
                        <span className="font-semibold">
                          {orderDetails.items?.length || 0} items
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-3"
              >
                {type === 'success' && orderId && (
                  <>
                    <button
                      onClick={() => router.push(`/track-order?id=${orderId}`)}
                      className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-600 transition-colors"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => router.push('/order-history')}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      View Order History
                    </button>
                  </>
                )}

                {type === 'error' && (
                  <button
                    onClick={() => router.back()}
                    className="w-full bg-red-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                )}

                {type === 'pending' && (
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-yellow-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-yellow-600 transition-colors"
                  >
                    Refresh Status
                  </button>
                )}

                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </button>
              </motion.div>

              {/* Contact Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    If you have any questions or concerns about your order, our support team is here
                    to help.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push('/contact')}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Contact Support
                    </button>
                    <button
                      onClick={() => window.open('tel:+919876543210')}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      Call Now
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          )}
        </div>
      </MobileLayout>
    </>
  );
}
