import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
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

export default function OrderDetailsPage() {
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
        return <Package className="w-5 h-5" />;
      case 'processing':
        return <Package className="w-5 h-5 animate-pulse" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <Home className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getQualityDisplay = (tier: string) => {
    switch (tier) {
      case 'ordinary':
        return { name: 'Ordinary', symbol: '₹' };
      case 'medium':
        return { name: 'Medium', symbol: '₹₹' };
      case 'best':
        return { name: 'Best', symbol: '₹₹₹' };
      default:
        return { name: tier, symbol: '₹' };
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!order) {
    return (
      <MobileLayout>
        <div className="text-center p-8">
          <p className="text-gray-600">Order not found</p>
          <Button onClick={() => router.push('/mobile/traditional')} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </MobileLayout>
    );
  }

  const quality = getQualityDisplay(order.quality_tier);

  return (
    <MobileLayout>
      <Head>
        <title>Order #{order.id} - Traditional Supplies</title>
      </Head>

      <div className="px-4 py-2">
        {/* Success Icon */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-2">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Order Confirmed!</h1>
          <p className="text-sm text-gray-600">Your order has been placed</p>
        </div>

        {/* Order Summary */}
        <Card className="p-4 mb-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="font-semibold">Order #{order.id}</h2>
              <p className="text-xs text-gray-500">
                {new Date(order.order_date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-emerald-600 font-bold">
                {quality.symbol} {quality.name}
              </div>
              <div className="flex items-center gap-1 text-sm mt-1">
                {getStatusIcon(order.order_status)}
                <span className="capitalize">{order.order_status}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="border-t pt-3">
            <p className="text-sm font-medium mb-1">Delivery Address</p>
            <p className="text-sm text-gray-600">{order.delivery_address}</p>
            {order.delivery_date && (
              <p className="text-xs text-gray-500 mt-1">
                Expected: {new Date(order.delivery_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-3">Order Items</h3>
          <div className="space-y-2">
            {order.items.map(item => (
              <div
                key={item.id}
                className="flex justify-between text-sm py-2 border-b last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.name_english}</p>
                  <p className="text-xs text-gray-500">{item.name_telugu}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.quantity} {item.unit} × ₹{item.unit_price}
                  </p>
                </div>
                <p className="font-medium">₹{item.total_price}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 mt-3 border-t">
            <p className="font-semibold">Total Amount</p>
            <p className="font-bold text-lg text-emerald-600">₹{order.total_amount}</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push('/mobile/traditional')}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Place Another Order
          </Button>
          <Button
            onClick={() => router.push('/mobile/traditional/history')}
            variant="outline"
            className="w-full"
          >
            View Order History
          </Button>
          <Button onClick={() => router.push('/mobile')} variant="outline" className="w-full">
            Back to Home
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
