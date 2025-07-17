import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, MapPin } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { useRouter } from 'next/router';

interface TrackingStep {
  status: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export default function TrackOrder() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Track order through real API
  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/direct-data/orders/${orderId}/tracking`);
      if (!response.ok) {
        throw new Error('Order not found');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = await fetchOrderDetails(trackingNumber);
      setOrderDetails(orderData);
    } catch (err) {
      setError('Unable to find order. Please check your tracking number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (step: TrackingStep) => {
    switch (step.status) {
      case 'Order Placed':
        return <Package className="w-5 h-5" />;
      case 'Order Confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'Preparing':
        return <Package className="w-5 h-5" />;
      case 'Out for Delivery':
        return <Truck className="w-5 h-5" />;
      case 'Delivered':
        return <MapPin className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  return (
    <>
      <Head>
        <title>Track Your Order - Sri Venkateswara Organic Foods</title>
        <meta
          name="description"
          content="Track your organic grocery order and get real-time delivery updates"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-900 mb-8 text-center"
            >
              Track Your Order
            </motion.h1>

            {/* Tracking Form */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <GlassCard className="p-6 mb-8">
                <form onSubmit={handleTrackOrder} className="flex gap-4">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    placeholder="Enter your tracking number"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    {loading ? 'Tracking...' : 'Track Order'}
                  </button>
                </form>
                {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
              </GlassCard>
            </motion.div>

            {/* Tracking Results */}
            {orderDetails && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tracking Number</p>
                      <p className="font-medium">{orderDetails.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium">{orderDetails.orderDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expected Delivery</p>
                      <p className="font-medium">{orderDetails.expectedDelivery}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium">{orderDetails.totalAmount}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium">{orderDetails.deliveryAddress}</p>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">Tracking Status</h2>
                  <div className="relative">
                    {orderDetails.trackingSteps.map((step: TrackingStep, index: number) => (
                      <div key={index} className="flex items-start mb-8 last:mb-0">
                        {/* Timeline Line */}
                        {index < orderDetails.trackingSteps.length - 1 && (
                          <div
                            className={`absolute left-6 top-12 w-0.5 h-full ${
                              step.completed ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                            step.completed ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {getStepIcon(step)}
                        </div>

                        {/* Content */}
                        <div className="ml-4 flex-1">
                          <h3
                            className={`font-semibold ${
                              step.completed ? 'text-gray-900' : 'text-gray-500'
                            }`}
                          >
                            {step.status}
                          </h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          {step.timestamp && (
                            <p className="text-sm text-gray-500 mt-1">{step.timestamp}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                  <div className="space-y-3">
                    {orderDetails.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-600">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
