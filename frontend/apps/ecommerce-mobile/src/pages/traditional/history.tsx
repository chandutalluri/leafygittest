import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
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

export default function TraditionalOrderHistoryPage() {
  const router = useRouter();
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
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <Home className="w-4 h-4 text-green-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-400" />;
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
        return '₹';
      case 'medium':
        return '₹₹';
      case 'best':
        return '₹₹₹';
      default:
        return '₹';
    }
  };

  const filters = ['all', 'pending', 'processing', 'shipped', 'delivered'];

  if (!user) {
    return (
      <MobileLayout>
        <div className="text-center p-8">
          <p className="text-gray-600">Please login to view order history</p>
          <Button onClick={() => router.push('/mobile/auth/login')} className="mt-4">
            Login
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <Head>
        <title>Order History - Traditional Supplies</title>
      </Head>

      <div className="px-4 py-2">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Order History</h1>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
          {filters.map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                filter === status ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-6 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-3">No orders found</p>
            <Button
              onClick={() => router.push('/mobile/traditional')}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Place First Order
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <Card
                key={order.id}
                className="p-4"
                onClick={() => router.push(`/mobile/traditional/order/${order.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">Order #{order.id}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${getStatusColor(order.order_status)}`}
                      >
                        {getStatusIcon(order.order_status)}
                        {order.order_status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(order.order_date).toLocaleDateString()}
                    </p>
                    {order.delivery_date && (
                      <p className="text-xs text-gray-500">
                        Delivery: {new Date(order.delivery_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-600 font-bold text-sm mb-1">
                      {getQualityDisplay(order.quality_tier)}
                    </div>
                    <p className="font-bold">₹{order.total_amount}</p>
                    {order.item_count && (
                      <p className="text-xs text-gray-500">{order.item_count} items</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={() => router.push('/mobile/traditional')}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Place New Order
          </Button>
          <Button onClick={() => router.push('/mobile')} variant="outline" className="w-full">
            Back to Home
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
