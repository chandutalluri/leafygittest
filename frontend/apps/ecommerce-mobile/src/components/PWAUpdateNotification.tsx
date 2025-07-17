import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

export default function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
                setShowUpdate(true);
              }
            });
          }
        });

        // Check for existing updates
        if (registration.waiting) {
          setUpdateAvailable(true);
          setShowUpdate(true);
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    // Show again after 24 hours
    setTimeout(() => setShowUpdate(true), 24 * 60 * 60 * 1000);
  };

  if (!showUpdate || !updateAvailable) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 shadow-lg z-[100] animate-slide-down">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <RefreshCw className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Update Available</p>
            <p className="text-xs opacity-90">New features and improvements ready</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleUpdate}
            className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors"
          >
            Update
          </button>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
