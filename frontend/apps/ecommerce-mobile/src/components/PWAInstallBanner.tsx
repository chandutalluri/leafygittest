import React, { useState, useEffect, useCallback } from 'react';
import { X, Smartphone, Download, Star, Shield, Zap, ArrowDown } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWADetection {
  isInstallable: boolean;
  isInstalled: boolean;
  platform: 'android' | 'ios' | 'desktop' | 'unknown';
  canInstall: boolean;
}

export default function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showTopPrompt, setShowTopPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [pwaDetection, setPwaDetection] = useState<PWADetection>({
    isInstallable: false,
    isInstalled: false,
    platform: 'unknown',
    canInstall: false,
  });
  const [installStep, setInstallStep] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  const detectPlatformAndCapabilities = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    const isInstalled =
      isStandalone || isFullscreen || (window.navigator as any).standalone === true;

    let platform: PWADetection['platform'] = 'unknown';
    if (userAgent.includes('android')) platform = 'android';
    else if (userAgent.includes('iphone') || userAgent.includes('ipad')) platform = 'ios';
    else if (
      userAgent.includes('windows') ||
      userAgent.includes('mac') ||
      userAgent.includes('linux')
    )
      platform = 'desktop';

    return {
      isInstallable: !isInstalled && (platform === 'android' || platform === 'desktop'),
      isInstalled,
      platform,
      canInstall: !isInstalled && platform !== 'unknown',
    };
  }, []);

  useEffect(() => {
    const detection = detectPlatformAndCapabilities();
    setPwaDetection(detection);

    // Don't show anything if already installed
    if (detection.isInstalled) return;

    // Check storage for previous interactions
    const lastDeclined = localStorage.getItem('pwa-install-declined');
    const installPromptCount = parseInt(localStorage.getItem('pwa-prompt-count') || '0');
    const lastPrompted = localStorage.getItem('pwa-last-prompted');

    // Smart prompting: Don't be too aggressive
    const shouldShowPrompt =
      !lastDeclined &&
      installPromptCount < 3 &&
      (!lastPrompted || Date.now() - parseInt(lastPrompted) > 24 * 60 * 60 * 1000); // 24 hours

    if (!shouldShowPrompt) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      if (detection.platform === 'android') {
        // Show top browser prompt for Android
        setTimeout(() => {
          setShowTopPrompt(true);
          setTimeout(() => setShowBanner(true), 1500); // Show banner after top prompt
        }, 1000);
      } else {
        // Show banner directly for other platforms
        setTimeout(() => setShowBanner(true), 1500);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback: Show instructions for iOS or if no install prompt
    if (detection.platform === 'ios' || (!deferredPrompt && detection.canInstall)) {
      setTimeout(() => {
        setShowBanner(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [detectPlatformAndCapabilities, deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt && pwaDetection.platform === 'android') {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          trackInstallEvent('install_accepted');
          setShowBanner(false);
          setShowTopPrompt(false);
        } else {
          trackInstallEvent('install_dismissed');
          localStorage.setItem('pwa-install-declined', Date.now().toString());
        }

        setDeferredPrompt(null);
        setShowBanner(false);
        setShowTopPrompt(false);
      } catch (error) {
        console.error('Installation failed:', error);
        setShowInstructions(true);
      }
    } else {
      // Show instructions for iOS or manual installation
      setShowInstructions(true);
    }
  };

  const handleLaterClick = () => {
    const count = parseInt(localStorage.getItem('pwa-prompt-count') || '0') + 1;
    localStorage.setItem('pwa-prompt-count', count.toString());
    localStorage.setItem('pwa-last-prompted', Date.now().toString());
    setShowBanner(false);
    setShowTopPrompt(false);
    trackInstallEvent('install_later');
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-declined', Date.now().toString());
    setShowBanner(false);
    setShowTopPrompt(false);
    setShowInstructions(false);
    trackInstallEvent('install_never');
  };

  const trackInstallEvent = (action: string) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: 'PWA',
        event_label: pwaDetection.platform,
      });
    }

    // Console logging for development
    console.log(`PWA Install Event: ${action} on ${pwaDetection.platform}`);
  };

  const getInstallInstructions = () => {
    switch (pwaDetection.platform) {
      case 'ios':
        return {
          title: 'Install LeafyHealth App on iPhone',
          steps: [
            { icon: '🌐', text: 'Open this page in Safari browser' },
            { icon: '📤', text: 'Tap the Share button at the bottom' },
            { icon: '📱', text: 'Scroll down and tap "Add to Home Screen"' },
            { icon: '✅', text: 'Tap "Add" to install the app' },
          ],
        };
      case 'android':
        return {
          title: 'Install LeafyHealth App on Android',
          steps: [
            { icon: '🌐', text: 'Open this page in Chrome browser' },
            { icon: '📥', text: 'Tap "Install" when prompted' },
            { icon: '📱', text: 'Or tap menu (⋮) → "Add to Home Screen"' },
            { icon: '✅', text: 'Confirm installation' },
          ],
        };
      default:
        return {
          title: 'Install LeafyHealth App',
          steps: [
            { icon: '🌐', text: 'Use Chrome or Edge browser' },
            { icon: '📥', text: 'Click install icon in address bar' },
            { icon: '📱', text: 'Or use browser menu → "Install app"' },
            { icon: '✅', text: 'Confirm installation' },
          ],
        };
    }
  };

  if (pwaDetection.isInstalled) return null;

  return (
    <>
      {/* Top Browser Prompt for Android */}
      {showTopPrompt && pwaDetection.platform === 'android' && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-3 shadow-sm z-[100] animate-slide-down">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Add LeafyHealth to your home screen?
                </p>
                <p className="text-xs text-gray-500">For the best shopping experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleInstallClick}
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowTopPrompt(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
            <ArrowDown className="h-3 w-3 text-gray-400 animate-bounce" />
          </div>
        </div>
      )}

      {/* Enhanced Installation Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 text-white shadow-2xl z-50 animate-slide-up">
          <div className="p-4">
            <div className="max-w-md mx-auto">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Install LeafyHealth App</h3>
                    <p className="text-sm opacity-90">Experience like a native Android app</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-white/70 hover:text-white transition-colors p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/20 p-2 rounded-lg mb-1">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="text-xs opacity-90">Lightning Fast</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/20 p-2 rounded-lg mb-1">
                    <Shield className="h-4 w-4" />
                  </div>
                  <span className="text-xs opacity-90">Secure & Safe</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/20 p-2 rounded-lg mb-1">
                    <Star className="h-4 w-4" />
                  </div>
                  <span className="text-xs opacity-90">Premium Experience</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-white text-green-700 px-4 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-green-50 transition-all duration-200 shadow-lg"
                >
                  <Download className="h-5 w-5" />
                  <span>Install Now - Free</span>
                </button>
                <button
                  onClick={handleLaterClick}
                  className="px-4 py-3 text-white/90 hover:text-white transition-colors text-sm font-medium"
                >
                  Later
                </button>
              </div>

              {/* Platform-specific hint */}
              {pwaDetection.platform === 'ios' && (
                <div className="mt-3 text-xs opacity-75 text-center">
                  Tap the share button in Safari to install
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Installation Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {getInstallInstructions().title}
              </h3>
              <p className="text-gray-600 text-sm">Follow these simple steps to install the app</p>
            </div>

            <div className="space-y-4 mb-6">
              {getInstallInstructions().steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{step.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDismiss}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Not Now
              </button>
              <button
                onClick={() => setShowInstructions(false)}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
