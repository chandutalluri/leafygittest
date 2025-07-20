import type { AppProps } from 'next/app';
import { MainNavigation } from '../components/layout/MainNavigation';
import { QueryProvider } from '../providers/QueryProvider';
import { ToastProvider } from '../providers/ToastProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { SecurityWrapper } from '../components/SecurityWrapper';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { suppressQueryErrors } from '../lib/errorHandler';

// Initialize global error handling
suppressQueryErrors();

// Simple wrapper component without gateway enforcement
function AppWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import '../styles/globals.css';
import '../styles/accessibility.css';

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  // Authentication bypass for testing label designer features
  const bypassAuth = router.pathname === '/label-design';

  useEffect(() => {
    if (!bypassAuth && !isLoading) {
      // Redirect to Super Admin login if not authenticated and not on login page
      if (!isAuthenticated && router.pathname !== '/login') {
        router.replace('/login');
        return;
      }

      // Prevent dashboard flashing - secure routing for authenticated users
      if (isAuthenticated && user) {
        // Check user role/type for proper routing
        const isGlobalAdmin =
          user.email === 'global.admin@leafyhealth.com' ||
          user.user_type === 'global_admin' ||
          user.role === 'global_admin';

        const isOperationalAdmin =
          user.email === 'ops.admin@leafyhealth.com' ||
          user.user_type === 'operational_admin' ||
          user.role === 'operational_admin';

        // Route users to appropriate dashboard
        if (router.pathname === '/') {
          if (isGlobalAdmin) {
            router.replace('/index');
            return;
          } else if (isOperationalAdmin) {
            router.replace('/operational-dashboard');
            return;
          }
        }
      }
    }
  }, [isAuthenticated, isLoading, router, user, bypassAuth]);

  // Show loading screen while checking authentication - prevent dashboard flashing
  if (!bypassAuth && (isLoading || (!isAuthenticated && router.pathname !== '/login'))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // SECURITY: Login pages are completely separate - no dashboard content visible
  if (router.pathname === '/login' || router.pathname === '/superadmin/login') {
    return <>{children}</>;
  }

  // Block access to all protected routes if not authenticated
  if (!bypassAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Role-based layout: Operations Admin gets no sidebar, System Admin gets full layout
  const isOperationalAdmin = user?.email === 'ops.admin@leafyhealth.com';

  if (isOperationalAdmin) {
    // Operations Admin: NO SIDEBAR - only main content
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  // System Admin: Full dashboard layout with sidebar
  return (
    <div className="flex h-screen bg-gray-50">
      <MainNavigation />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

function App({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <SecurityWrapper>
              <AuthenticatedLayout>
                <Component {...pageProps} />
              </AuthenticatedLayout>
            </SecurityWrapper>
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </AppWrapper>
  );
}

export default App;
