import type { AppProps } from 'next/app';
import { QueryProvider } from '../providers/QueryProvider';
import { ToastProvider } from '../providers/ToastProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { useEffect } from 'react';
import PWAInstallBanner from '../components/PWAInstallBanner';
import PWAUpdateNotification from '../components/PWAUpdateNotification';
import PWAOfflineIndicator from '../components/PWAOfflineIndicator';
import { suppressQueryErrors } from '@/lib/errorHandler';
import '../styles/globals.css';

// Initialize error handler
suppressQueryErrors();

// Gateway Enforcement and Desktop Detection
function GatewayEnforcer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPort = window.location.port;
      const isDirectAccess = currentPort === '3001'; // Direct Next.js access

      if (isDirectAccess) {
        // Redirect to Multi-App Gateway
        const gatewayUrl = window.location.origin.replace(':3001', ':5000') + '/mobile';
        window.location.href = gatewayUrl;
        return;
      }

      // Device detection - redirect desktop users to web app
      const userAgent = navigator.userAgent;
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
          userAgent
        );

      if (!isMobile && !window.location.pathname.includes('/customer')) {
        // Redirect to desktop app
        window.location.href = window.location.origin + '/customer';
        return;
      }

      // Register service worker for PWA
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(
          registration => console.log('Service Worker registered'),
          error => console.log('Service Worker registration failed:', error)
        );
      }

      // Add mobile-specific viewport meta tag
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        );
      }
    }
  }, []);

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GatewayEnforcer>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <PWAUpdateNotification />
            <PWAOfflineIndicator />
            <Component {...pageProps} />
            <PWAInstallBanner />
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </GatewayEnforcer>
  );
}
