/**
 * Professional Authentication Button Component - Uses separate login pages
 */

import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { UserIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';

export const AuthButton: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // Redirect to home after logout
    router.push('/customer');
  };

  const handleSignIn = () => {
    // Get current URL for return redirect
    const returnUrl = router.asPath;
    router.push(`/customer/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleSignUp = () => {
    // Get current URL for return redirect
    const returnUrl = router.asPath;
    router.push(`/customer/auth/register?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleProfileClick = () => {
    router.push('/customer/account');
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3">
        {/* User Profile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProfileClick}
          className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-all duration-200"
        >
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-gray-900">
              {user.name || user.full_name || user.username || user.email}
            </div>
            <div className="text-xs text-gray-500">View Profile</div>
          </div>
        </motion.button>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Logout
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSignIn}
        className="text-green-600 hover:text-green-700 px-3 py-2 text-sm font-medium transition-colors"
      >
        Sign In
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSignUp}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
      >
        Sign Up
      </motion.button>
    </div>
  );
};
