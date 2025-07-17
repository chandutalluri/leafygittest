import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import Link from 'next/link';
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import MobileLayout from '@/components/layout/MobileLayout';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate } from '@/lib/utils';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
}

export default function OrderHistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      try {
        const response = await fetch('/api/direct-data/orders');
        if (response.ok) {
          return await response.json();
        }
        return { data: [] };
      } catch (error) {
        return { data: [] };
      }
    },
    enabled: !!user?.id,
  });

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ShoppingBagIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'confirmed':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <>
        <Head>
          <title>Order History - LeafyHealth</title>
        </Head>
        <MobileLayout>
          <div className="px-4 py-6">
            <GlassCard className="text-center py-12">
              <h1 className="text-xl font-bold text-gray-800 mb-4">Please Sign In</h1>
              <p className="text-gray-600 mb-6">
                You need to be signed in to view your order history.
              </p>
              <Link
                href="/auth/login"
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                Sign In
              </Link>
            </GlassCard>
          </div>
        </MobileLayout>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Order History - LeafyHealth</title>
        </Head>
        <MobileLayout>
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </MobileLayout>
      </>
    );
  }

  const orders = ordersData?.data || [];

  return (
    <>
      <Head>
        <title>Order History - LeafyHealth</title>
        <meta name="description" content="View your order history and track your purchases" />
      </Head>

      <MobileLayout>
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>

          {/* Status Filter */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedStatus === status
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {orders.length === 0 ? (
            <GlassCard className="text-center py-12">
              <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Link
                href="/products"
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                Start Shopping
              </Link>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {orders
                .filter(
                  (order: Order) =>
                    selectedStatus === 'all' || order.status?.toLowerCase() === selectedStatus
                )
                .map((order: Order, index: number) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <GlassCard className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">
                            Order #{order.id?.slice(-8) || 'N/A'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt) || 'Date not available'}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status || 'Unknown'}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                          <p className="font-bold text-green-600">
                            {formatPrice(order.total) || '₹0.00'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/track-order?id=${order.id}`}
                            className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium hover:bg-green-200 transition-colors"
                          >
                            Track
                          </Link>
                          <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                            Details
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </MobileLayout>
    </>
  );
}
