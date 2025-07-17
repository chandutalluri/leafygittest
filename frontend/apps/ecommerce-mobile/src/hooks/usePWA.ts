import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  updateAvailable: boolean;
  platform: 'android' | 'ios' | 'desktop' | 'unknown';
  installPromptEvent: BeforeInstallPromptEvent | null;
}

interface PWAHook extends PWAState {
  installApp: () => Promise<boolean>;
  updateApp: () => Promise<void>;
  shareContent: (data: ShareData) => Promise<boolean>;
  addToHomeScreen: () => void;
  dismissInstallPrompt: () => void;
}

export const usePWA = (): PWAHook => {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false,
    updateAvailable: false,
    platform: 'unknown',
    installPromptEvent: null,
  });

  const detectPlatform = useCallback((): PWAState['platform'] => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) return 'android';
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    if (userAgent.includes('windows') || userAgent.includes('mac') || userAgent.includes('linux'))
      return 'desktop';
    return 'unknown';
  }, []);

  const checkInstallation = useCallback(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;

    return isStandalone || isFullscreen || isIOSStandalone;
  }, []);

  useEffect(() => {
    const platform = detectPlatform();
    const isInstalled = checkInstallation();

    setState(prev => ({
      ...prev,
      platform,
      isInstalled,
      isOffline: !navigator.onLine,
    }));

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setState(prev => ({
        ...prev,
        isInstallable: true,
        installPromptEvent: e as BeforeInstallPromptEvent,
      }));
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPromptEvent: null,
      }));

      // Track installation
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_installed', {
          event_category: 'PWA',
          event_label: platform,
        });
      }
    };

    // Handle online/offline status
    const handleOnline = () => setState(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setState(prev => ({ ...prev, isOffline: true }));

    // Handle service worker updates
    const handleControllerChange = () => {
      setState(prev => ({ ...prev, updateAvailable: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service worker update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      // Check for updates
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, updateAvailable: true }));
              }
            });
          }
        });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
    };
  }, [detectPlatform, checkInstallation]);

  const installApp = useCallback(async (): Promise<boolean> => {
    if (!state.installPromptEvent) {
      return false;
    }

    try {
      await state.installPromptEvent.prompt();
      const { outcome } = await state.installPromptEvent.userChoice;

      setState(prev => ({
        ...prev,
        installPromptEvent: null,
        isInstallable: false,
      }));

      return outcome === 'accepted';
    } catch (error) {
      console.error('Installation failed:', error);
      return false;
    }
  }, [state.installPromptEvent]);

  const updateApp = useCallback(async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }, []);

  const shareContent = useCallback(async (data: ShareData): Promise<boolean> => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Share failed:', error);
        return false;
      }
    }

    // Fallback: Copy to clipboard
    if (data.url && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(data.url);
        return true;
      } catch (error) {
        console.error('Clipboard write failed:', error);
        return false;
      }
    }

    return false;
  }, []);

  const addToHomeScreen = useCallback(() => {
    // iOS-specific guidance
    if (state.platform === 'ios') {
      alert('To install this app: tap the Share button in Safari, then "Add to Home Screen"');
    } else {
      // Generic guidance
      alert('To install this app: use your browser\'s "Add to Home Screen" option');
    }
  }, [state.platform]);

  const dismissInstallPrompt = useCallback(() => {
    setState(prev => ({
      ...prev,
      installPromptEvent: null,
      isInstallable: false,
    }));

    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  }, []);

  return {
    ...state,
    installApp,
    updateApp,
    shareContent,
    addToHomeScreen,
    dismissInstallPrompt,
  };
};

export default usePWA;
