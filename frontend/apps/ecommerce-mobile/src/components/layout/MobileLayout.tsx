import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Home, Menu, ShoppingCart, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/stores/useCartStore';

interface MobileLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export default function MobileLayout({ children, showBottomNav = true }: MobileLayoutProps) {
  const router = useRouter();
  const { getTotalItems } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const cartItemCount = isHydrated ? getTotalItems() : 0;

  const navItems = [
    { href: '/mobile', icon: Home, label: 'Home' },
    { href: '/mobile/traditional', icon: Menu, label: 'Traditional' },
    {
      href: '/mobile/cart',
      icon: ShoppingCart,
      label: 'Cart',
      badge: isHydrated && cartItemCount > 0 ? cartItemCount.toString() : undefined,
    },
    { href: '/mobile/order-history', icon: Heart, label: 'Orders' },
    { href: '/mobile/account', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 pb-16 overflow-x-hidden">{children}</main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex justify-around items-center">
            {navItems.map(item => {
              const isActive = router.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors relative ${
                    isActive ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="relative">
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute top-0 left-0 right-0 h-0.5 bg-green-600"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </div>
  );
}
