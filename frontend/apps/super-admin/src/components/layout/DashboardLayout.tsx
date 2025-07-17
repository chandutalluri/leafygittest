'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../../stores/authStore';
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { GlassCard } from '../ui/GlassCard';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  activeDomain?: string;
}

export function DashboardLayout({ 
  children, 
  title, 
  description, 
  activeDomain = 'dashboard' 
}: DashboardLayoutProps) {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [currentDomain, setCurrentDomain] = useState<string>(activeDomain);

  useEffect(() => {
    // Authentication check
    if (!user && !localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [user, router, isAuthenticated]);

  // Loading state
  if (!user && !localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleDomainChange = (domain: string) => {
    setCurrentDomain(domain);
    // Navigate to the corresponding page based on domain
    switch (domain) {
      case 'dashboard':
        router.push('/operational-dashboard');
        break;
      case 'products':
        router.push('/catalog-management');
        break;
      case 'orders':
        router.push('/order-management');
        break;
      case 'customers':
        router.push('/customer-service');
        break;
      case 'financial':
        router.push('/accounting-management');
        break;
      case 'organization':
        router.push('/company-management');
        break;
      case 'intelligence':
        router.push('/analytics-reporting');
        break;
      case 'system':
        router.push('/database-backup-restore');
        break;
      default:
        router.push('/operational-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex">
      {/* Sidebar */}
      <CollapsibleSidebar 
        activeDomain={currentDomain} 
        onDomainChange={handleDomainChange}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {description && (
                  <p className="text-sm text-gray-600">{description}</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  System Status: <span className="text-green-600 font-medium">Operational</span>
                </div>
                <div className="text-sm text-gray-500">
                  {user?.firstName} {user?.lastName}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <GlassCard className="min-h-[calc(100vh-140px)]" variant="elevated">
            <div className="p-6">
              {children}
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}