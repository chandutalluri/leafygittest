import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/layout/MobileLayout';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  User,
  Package,
  MapPin,
  Heart,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Leaf,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface MenuItem {
  icon: any;
  label: string;
  href?: string;
  action?: () => void;
  badge?: string;
  color?: string;
}

export default function CustomerAccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Please login to access your account');
      router.push('/mobile/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      localStorage.removeItem('authToken');
      toast.success('Logged out successfully');
      router.push('/mobile');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    } finally {
      setLoggingOut(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: User,
      label: 'My Profile',
      href: '/mobile/account/profile',
      color: 'text-blue-600',
    },
    {
      icon: Package,
      label: 'My Orders',
      href: '/mobile/order-history',
      color: 'text-green-600',
    },
    {
      icon: MapPin,
      label: 'Delivery Addresses',
      href: '/mobile/account/addresses',
      color: 'text-purple-600',
    },

    {
      icon: CreditCard,
      label: 'Payment Methods',
      href: '/mobile/account/payments',
      color: 'text-indigo-600',
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/mobile/account/notifications',
      badge: '5',
      color: 'text-yellow-600',
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      href: '/mobile/account/security',
      color: 'text-gray-600',
    },
    {
      icon: LogOut,
      label: 'Logout',
      action: handleLogout,
      color: 'text-red-600',
    },
  ];

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <Head>
        <title>My Account - LeafyHealth</title>
        <meta name="description" content="Manage your LeafyHealth account" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Header with User Info */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 pt-8 pb-12">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Leaf className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">{user?.fullName || 'Customer'}</h1>
            <p className="text-green-100">{user?.email || 'customer@leafyhealth.com'}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 -mt-6">
          <GlassCard className="p-4">
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isLogout = item.label === 'Logout';

                return (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else if (item.href) {
                        router.push(item.href);
                      }
                    }}
                    disabled={isLogout && loggingOut}
                    className={`w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors ${
                      isLogout ? 'mt-4 border-t pt-4' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-50 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`font-medium ${isLogout ? 'text-red-600' : 'text-gray-900'}`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {!isLogout && <ChevronRight className="w-5 h-5 text-gray-400" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 mb-6">
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Orders</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Addresses</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">5</div>
              <div className="text-sm text-gray-600">Wishlist</div>
            </GlassCard>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
