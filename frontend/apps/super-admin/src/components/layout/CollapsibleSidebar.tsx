'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '../../stores/authStore';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
// import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Home,
  ShoppingBag,
  Truck,
  Users,
  DollarSign,
  Building,
  BarChart,
  Settings,
  Database,
  Image,
  Package,
  Warehouse,
  CreditCard,
  Bell,
  Headphones,
  TrendingUp,
  FileCheck,
  Calculator,
  UserCheck,
  Store,
  Tag,
  FileText,
  Languages,
  FileBarChart,
  LogOut,
  UserCircle,
  Shield,
  Globe,
  Zap,
  Network,
  BarChart3,
  Building2,
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  description: string;
  category: string;
  port?: number;
}

interface NavigationCategory {
  id: string;
  name: string;
  icon: any;
  items: NavigationItem[];
}

const navigationCategories: NavigationCategory[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home,
    items: [
      {
        name: 'Overview',
        href: '/',
        icon: Home,
        description: 'System overview and status',
        category: 'dashboard',
      },
      {
        name: 'Operational Dashboard',
        href: '/operational-dashboard',
        icon: BarChart,
        description: 'Business operations overview',
        category: 'dashboard',
      },
    ],
  },
  {
    id: 'products',
    name: 'Product Ecosystem',
    icon: ShoppingBag,
    items: [
      {
        name: 'Overview',
        href: '/catalog-management',
        icon: Package,
        description: 'Product catalog overview',
        category: 'products',
      },
      {
        name: 'Add Product',
        href: '/create-product',
        icon: Package,
        description: 'Add new products',
        category: 'products',
      },
      {
        name: 'Product Catalog',
        href: '/product-catalog',
        icon: Package,
        description: 'View all 22 created products',
        category: 'products',
      },
      {
        name: 'Inventory Management',
        href: '/inventory-management',
        icon: Warehouse,
        description: 'Stock and inventory control',
        category: 'products',
      },
      {
        name: 'Image Management',
        href: '/image-management',
        icon: Image,
        description: 'Product image management',
        category: 'products',
      },
      {
        name: 'Categories',
        href: '/categories',
        icon: Tag,
        description: 'Product categories',
        category: 'products',
      },
      {
        name: 'Label Design',
        href: '/label-design',
        icon: FileText,
        description: 'Professional label design',
        category: 'products',
      },
    ],
  },
  {
    id: 'orders',
    name: 'Order Operations',
    icon: Truck,
    items: [
      {
        name: 'Order Management',
        href: '/order-management',
        icon: Truck,
        description: 'Order processing and fulfillment',
        category: 'orders',
      },
      {
        name: 'Payment Processing',
        href: '/payment-processing',
        icon: CreditCard,
        description: 'Payment gateway management',
        category: 'orders',
      },
      {
        name: 'Shipping & Delivery',
        href: '/shipping-delivery',
        icon: Truck,
        description: 'Shipping and delivery management',
        category: 'orders',
      },
      {
        name: 'Customer Service',
        href: '/customer-service',
        icon: Headphones,
        description: 'Customer support management',
        category: 'orders',
      },
    ],
  },
  {
    id: 'customers',
    name: 'Customer Relations',
    icon: Users,
    items: [
      {
        name: 'Customer Service',
        href: '/customer-service',
        icon: Headphones,
        description: 'Customer support management',
        category: 'customers',
      },
      {
        name: 'User Management',
        href: '/user-management',
        icon: Users,
        description: 'User account management',
        category: 'customers',
      },
      {
        name: 'Notifications',
        href: '/notification-service',
        icon: Bell,
        description: 'Notification management',
        category: 'customers',
      },
    ],
  },
  {
    id: 'financial',
    name: 'Financial Control',
    icon: DollarSign,
    items: [
      {
        name: 'Accounting',
        href: '/accounting-management',
        icon: Calculator,
        description: 'Financial accounting',
        category: 'financial',
      },
      {
        name: 'Expense Monitoring',
        href: '/expense-monitoring',
        icon: DollarSign,
        description: 'Expense tracking',
        category: 'financial',
      },
      {
        name: 'Reporting',
        href: '/reporting-management',
        icon: FileBarChart,
        description: 'Financial reporting',
        category: 'financial',
      },
    ],
  },
  {
    id: 'organization',
    name: 'Organization Hub',
    icon: Building,
    items: [
      {
        name: 'Company Management',
        href: '/company-management',
        icon: Building2,
        description: 'Company structure management',
        category: 'organization',
      },
      {
        name: 'Employee Management',
        href: '/employee-management',
        icon: Users,
        description: 'Employee management',
        category: 'organization',
      },
      {
        name: 'User Roles',
        href: '/user-management',
        icon: UserCheck,
        description: 'Role and permission management',
        category: 'organization',
      },
    ],
  },
  {
    id: 'intelligence',
    name: 'Business Intelligence',
    icon: BarChart,
    items: [
      {
        name: 'Analytics',
        href: '/analytics-reporting',
        icon: BarChart,
        description: 'Business analytics',
        category: 'intelligence',
      },
      {
        name: 'Performance Monitor',
        href: '/performance-monitor',
        icon: TrendingUp,
        description: 'System performance',
        category: 'intelligence',
      },
      {
        name: 'System Monitoring',
        href: '/monitoring',
        icon: BarChart,
        description: 'Real-time monitoring',
        category: 'intelligence',
      },
    ],
  },
  {
    id: 'system',
    name: 'System Management',
    icon: Settings,
    items: [
      {
        name: 'Database Backup',
        href: '/database-backup-restore',
        icon: Database,
        description: 'Database backup and restore',
        category: 'system',
      },
      {
        name: 'Security Centre',
        href: '/security',
        icon: Shield,
        description: 'Security management',
        category: 'system',
      },
      {
        name: 'Multi-Language',
        href: '/multi-language-management',
        icon: Languages,
        description: 'Language management',
        category: 'system',
      },
      {
        name: 'Integration Hub',
        href: '/integration-hub',
        icon: Network,
        description: 'System integrations',
        category: 'system',
      },
    ],
  },
];

interface CollapsibleSidebarProps {
  activeDomain: string;
  onDomainChange: (domain: string) => void;
}

export function CollapsibleSidebar({ activeDomain, onDomainChange }: CollapsibleSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([activeDomain]);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout from Super Admin?')) {
      logout();
    }
  };

  const handleNavigation = (href: string, categoryId: string) => {
    console.log('Navigation clicked:', href, categoryId);
    if (href.startsWith('/')) {
      router.push(href);
    }
    // Only trigger domain change for overview pages, not specific features
    if (
      href.includes('/catalog-management') ||
      href.includes('/operational-dashboard') ||
      href.includes('/order-management') ||
      href.includes('/customer-service') ||
      href.includes('/accounting-management') ||
      href.includes('/company-management') ||
      href.includes('/analytics-reporting') ||
      href.includes('/database-backup-restore')
    ) {
      onDomainChange(categoryId);
    }
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <React.Fragment>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <GlassButton variant="secondary" size="sm" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </GlassButton>
      </div>

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed left-0 top-0 h-full w-80 z-40 lg:relative lg:translate-x-0">
          <GlassCard className="h-full overflow-hidden flex flex-col" variant="elevated">
            {/* Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">LH</span>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-lg font-bold text-gray-900">LeafyHealth</h1>
                    <p className="text-sm text-gray-600">Super Admin Dashboard</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-2 px-4">
                {navigationCategories.map(category => (
                  <div key={category.id} className="space-y-1">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        activeDomain === category.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-white/20 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <category.icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {expandedCategories.includes(category.id) && (
                      <div className="overflow-hidden">
                        <div className="ml-8 space-y-1 py-2">
                          {category.items.map(item => (
                            <button
                              key={item.name}
                              onClick={() => handleNavigation(item.href, category.id)}
                              className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                                router.pathname === item.href
                                  ? 'bg-purple-50 text-purple-700'
                                  : 'hover:bg-white/10 text-gray-600'
                              }`}
                            >
                              <item.icon className="h-4 w-4 mr-3" />
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center px-3 py-2 text-sm mb-3">
                <UserCircle className="h-8 w-8 text-gray-400 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <GlassButton variant="danger" size="sm" onClick={handleLogout} className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Secure Logout
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toggle Button for Desktop */}
      {!isOpen && (
        <div className="fixed left-4 top-4 z-40">
          <GlassButton variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
            <Menu className="h-5 w-5" />
          </GlassButton>
        </div>
      )}
    </React.Fragment>
  );
}
