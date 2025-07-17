import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  ChevronLeft, 
  User, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut,
  ChevronRight,
  Package
} from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { useAuth } from '../../hooks/useAuth';
import { useBranchStore } from '@/lib/stores/useBranchStore';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  userId: string;
  items: any[];
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

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedBranch } = useBranchStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('leafyhealth-orders');
    if (savedOrders) {
      const allOrders = JSON.parse(savedOrders);
      // Filter orders for current user
      const userOrders = allOrders.filter((order: Order) => order.userId === user?.id);
      setOrders(userOrders.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('leafyhealth-user');
    localStorage.removeItem('leafyhealth-cart');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MobileLayout>
      <Head>
        <title>My Profile - LeafyHealth</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center p-4">
            <button onClick={() => router.back()}>
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold ml-4">My Profile</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* User Info Card */}
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{user?.name}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </Card>

          {/* Selected Branch */}
          {selectedBranch && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Selected Branch</p>
                    <p className="text-sm text-gray-600">{selectedBranch.name}</p>
                    <p className="text-xs text-gray-500">{selectedBranch.city}</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push('/branches')}
                  className="text-green-600"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </Card>
          )}

          {/* My Orders Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              My Orders ({orders.length})
            </h3>
            
            {orders.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders yet</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/')}
                  className="mt-4"
                >
                  Start Shopping
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">Order #{order.id}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • ₹{order.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Delivery to: {order.deliveryAddress.address}, {order.deliveryAddress.city}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="text-green-600 text-sm font-medium mt-2"
                    >
                      View Details →
                    </button>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="space-y-2 pt-4">
            <Card className="p-4">
              <button 
                onClick={() => router.push('/addresses')}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>Delivery Addresses</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </Card>

            <Card className="p-4">
              <button 
                onClick={() => router.push('/contact')}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span>Contact Support</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </Card>

            <Card className="p-4">
              <button 
                onClick={() => router.push('/about')}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>About Us</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </Card>
          </div>

          {/* Logout Button */}
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}