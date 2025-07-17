import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/hooks/useAuth';
import { Package, Truck, Home, Clock, ChevronRight } from 'lucide-react';

interface TraditionalOrder {
  id: number;
  quality_tier: string;
  total_amount: number;
  order_status: string;
  order_date: string;
  delivery_date?: string;
  item_count?: number;
}

export default function TraditionalOrderHistory() {
  const [orders, setOrders] = useState<TraditionalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user, filter]);

  const fetchOrders = async () => {
    try {
      let url = `/api/traditional/customer/${user?.id}/orders`;
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <Home className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityDisplay = (tier: string) => {
    switch (tier) {
      case 'ordinary':
        return { name: 'Ordinary', symbol: '₹', color: 'text-gray-600' };
      case 'medium':
        return { name: 'Medium', symbol: '₹₹', color: 'text-blue-600' };
      case 'best':
        return { name: 'Best', symbol: '₹₹₹', color: 'text-emerald-600' };
      default:
        return { name: tier, symbol: '₹', color: 'text-gray-600' };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Please login to view your order history</p>
          <Link href="/auth/login" className="text-emerald-600 hover:underline mt-4 inline-block">
            Login
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Traditional Order History - LeafyHealth</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Traditional Order History</h1>
            <p className="text-gray-600">Track all your traditional home supplies orders</p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filter === status
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            </div>
          ) : orders.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No orders found</p>
              <Link href="/traditional" className="text-emerald-600 hover:underline">
                Place your first traditional order
              </Link>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const quality = getQualityDisplay(order.quality_tier);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Link href={`/traditional/order/${order.id}`}>
                      <GlassCard className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                              <span
                                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(order.order_status)}`}
                              >
                                {getStatusIcon(order.order_status)}
                                {order.order_status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Placed on {new Date(order.order_date).toLocaleDateString()}</p>
                              {order.delivery_date && (
                                <p>
                                  Expected delivery:{' '}
                                  {new Date(order.delivery_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`${quality.color} font-bold mb-1`}>
                              {quality.symbol} {quality.name}
                            </div>
                            <p className="text-xl font-bold text-gray-800">₹{order.total_amount}</p>
                            {order.item_count && (
                              <p className="text-sm text-gray-500">{order.item_count} items</p>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/traditional"
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-center"
            >
              Place New Order
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
