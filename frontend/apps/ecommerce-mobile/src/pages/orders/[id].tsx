import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ChevronLeft, Package, MapPin, Phone, CreditCard, CheckCircle } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Card } from '@/components/ui/card';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  branchId: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Load order from localStorage
      const savedOrders = localStorage.getItem('leafyhealth-orders');
      if (savedOrders) {
        const allOrders = JSON.parse(savedOrders);
        const foundOrder = allOrders.find((o: Order) => o.id === id);
        setOrder(foundOrder || null);
      }
      setLoading(false);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </MobileLayout>
    );
  }

  if (!order) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-gray-50 p-4">
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Order not found</p>
          </Card>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <Head>
        <title>Order #{order.id} - LeafyHealth</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center p-4">
            <button onClick={() => router.back()}>
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold ml-4">Order Details</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Order Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Order #{order.id}</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
            
            {order.status === 'confirmed' && (
              <div className="mt-4 flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">Your order has been confirmed</p>
              </div>
            )}
          </Card>

          {/* Order Items */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">
                      {item.quantity} {item.unit || 'item'}{item.quantity > 1 ? 's' : ''} × ₹{item.price}
                    </p>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Delivery Address */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Delivery Address
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.deliveryAddress.name}</p>
              <p className="text-gray-600">{order.deliveryAddress.address}</p>
              <p className="text-gray-600">
                {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
              </p>
              <div className="flex items-center text-gray-600 mt-2">
                <Phone className="h-4 w-4 mr-2" />
                <span>{order.deliveryAddress.phone}</span>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Method
            </h3>
            <p className="text-sm">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </p>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}