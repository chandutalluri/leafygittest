/**
 * Super Admin Dashboard - System Overview
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthStore } from '../stores/authStore';
import {
  Shield,
  Database,
  Users,
  Globe,
  Building2,
  Image,
  BarChart3,
  Package,
  CreditCard,
  Bell,
  TrendingUp,
  Zap,
  Network,
  Settings,
  ShoppingBag,
  Truck,
  HeadphonesIcon,
  Calculator,
  Store,
  DollarSign,
} from 'lucide-react';

const systemSections = [
  {
    title: 'Core System Management',
    items: [
      {
        name: 'Database Backup & Restore',
        href: '/database-backup-restore',
        icon: Database,
        color: 'bg-blue-500',
      },
      {
        name: 'Company Management',
        href: '/company-management',
        icon: Building2,
        color: 'bg-green-500',
      },
      { name: 'Image Management', href: '/image-management', icon: Image, color: 'bg-yellow-500' },
    ],
  },
  {
    title: 'Security & Access Control',
    items: [
      { name: 'Security Centre', href: '/security', icon: Shield, color: 'bg-red-500' },
      { name: 'User Management', href: '/user-management', icon: Users, color: 'bg-indigo-500' },
      { name: 'System Settings', href: '/system-dashboard', icon: Settings, color: 'bg-gray-500' },
    ],
  },
  {
    title: 'Business Operations',
    items: [
      {
        name: 'Catalog Management',
        href: '/catalog-management',
        icon: Package,
        color: 'bg-teal-500',
      },
      {
        name: 'Order Management',
        href: '/order-management',
        icon: ShoppingBag,
        color: 'bg-orange-500',
      },
      {
        name: 'Customer Service',
        href: '/customer-service',
        icon: HeadphonesIcon,
        color: 'bg-pink-500',
      },
      {
        name: 'Marketplace Management',
        href: '/marketplace-management',
        icon: Store,
        color: 'bg-purple-500',
      },
    ],
  },
  {
    title: 'Financial & Analytics',
    items: [
      {
        name: 'Payment Processing',
        href: '/payment-processing',
        icon: CreditCard,
        color: 'bg-green-500',
      },
      {
        name: 'Analytics Reporting',
        href: '/analytics-reporting',
        icon: TrendingUp,
        color: 'bg-blue-500',
      },
      {
        name: 'Accounting Management',
        href: '/accounting-management',
        icon: Calculator,
        color: 'bg-yellow-500',
      },
      {
        name: 'Expense Monitoring',
        href: '/expense-monitoring',
        icon: DollarSign,
        color: 'bg-red-500',
      },
    ],
  },
  {
    title: 'System Administration',
    items: [
      {
        name: 'Performance Monitor',
        href: '/performance-monitor',
        icon: Zap,
        color: 'bg-orange-500',
      },
      { name: 'Integration Hub', href: '/integration-hub', icon: Network, color: 'bg-teal-500' },
      {
        name: 'Notification Service',
        href: '/notification-service',
        icon: Bell,
        color: 'bg-purple-500',
      },
      {
        name: 'Shipping Delivery',
        href: '/shipping-delivery',
        icon: Truck,
        color: 'bg-indigo-500',
      },
    ],
  },
];

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [systemStatus, setSystemStatus] = useState({
    microservices: 27,
    frontendApps: 5,
    activeBranches: 5,
    totalUsers: 0,
  });

  useEffect(() => {
    // Check if current user should access this dashboard
    if (isAuthenticated && user) {
      const isGlobalAdmin =
        user.email === 'global.admin@leafyhealth.com' ||
        user.user_type === 'global_admin' ||
        user.role === 'global_admin';

      // Redirect operational admins to their dashboard
      if (!isGlobalAdmin) {
        router.replace('/operational-dashboard');
        return;
      }
    }

    if (!user && !localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [user, router, isAuthenticated]);

  if (!user && !localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Complete system control and management</p>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Microservices</p>
                <p className="text-2xl font-bold text-gray-900">{systemStatus.microservices}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Network className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Frontend Apps</p>
                <p className="text-2xl font-bold text-gray-900">{systemStatus.frontendApps}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Branches</p>
                <p className="text-2xl font-bold text-gray-900">{systemStatus.activeBranches}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{systemStatus.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* System Sections */}
        {systemSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
