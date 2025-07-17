import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

interface OrderItem {
  id: number;
  item_id: number;
  name_english: string;
  name_telugu: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  quality_tier: string;
  total_amount: number;
  delivery_address: string;
  order_status: string;
  order_date: string;
  delivery_date?: string;
  notes?: string;
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/traditional/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="w-6 h-6" />;
      case 'processing':
        return <Package className="w-6 h-6 animate-pulse" />;
      case 'shipped':
        return <Truck className="w-6 h-6" />;
      case 'delivered':
        return <Home className="w-6 h-6" />;
      default:
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getQualityDisplay = (tier: string) => {
    switch (tier) {
      case 'ordinary':
        return { name: 'Ordinary Quality', symbol: '₹', color: 'text-gray-600' };
      case 'medium':
        return { name: 'Medium Quality', symbol: '₹₹', color: 'text-blue-600' };
      case 'best':
        return { name: 'Best Quality', symbol: '₹₹₹', color: 'text-emerald-600' };
      default:
        return { name: tier, symbol: '₹', color: 'text-gray-600' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Order not found</p>
          <Link href="/traditional" className="text-emerald-600 hover:underline mt-4 inline-block">
            Back to Traditional Orders
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const quality = getQualityDisplay(order.quality_tier);

  return (
    <>
      <Head>
        <title>Order #{order.id} - Traditional Supplies</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Success Message */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4"
              >
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">
                Your traditional supplies order has been placed successfully
              </p>
            </div>

            {/* Order Details */}
            <GlassCard className="mb-6 p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
                  <p className="text-gray-600">
                    Placed on {new Date(order.order_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`${quality.color} font-bold text-lg`}>
                    {quality.symbol} {quality.name}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusIcon(order.order_status)}
                    <span className="capitalize">{order.order_status}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                  <p className="text-gray-600">{order.customer_name}</p>
                  <p className="text-gray-600">{order.customer_email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                  <p className="text-gray-600">{order.delivery_address}</p>
                  {order.delivery_date && (
                    <p className="text-sm text-gray-500 mt-1">
                      Expected: {new Date(order.delivery_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-4">Order Items</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-600 text-sm">
                        <th className="pb-2">Item</th>
                        <th className="pb-2 text-center">Quantity</th>
                        <th className="pb-2 text-right">Price</th>
                        <th className="pb-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items.map(item => (
                        <tr key={item.id}>
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{item.name_english}</p>
                              <p className="text-sm text-gray-500">{item.name_telugu}</p>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-3 text-right">₹{item.unit_price}</td>
                          <td className="py-3 text-right font-medium">₹{item.total_price}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-gray-300">
                      <tr>
                        <td colSpan={3} className="pt-4 text-right font-semibold">
                          Total Amount:
                        </td>
                        <td className="pt-4 text-right font-bold text-lg text-emerald-600">
                          ₹{order.total_amount}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {order.notes && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
                  <p className="text-gray-600">{order.notes}</p>
                </div>
              )}
            </GlassCard>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/traditional"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-center"
              >
                Place Another Order
              </Link>
              <Link
                href="/traditional/history"
                className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-center"
              >
                View Order History
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
}
