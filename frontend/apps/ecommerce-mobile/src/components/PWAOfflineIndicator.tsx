import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function PWAOfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);

      if (!online) {
        setShowNotification(true);
      } else if (showNotification) {
        // Show "back online" briefly
        setTimeout(() => setShowNotification(false), 3000);
      }
    };

    // Initial check
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [showNotification]);

  if (!showNotification) return null;

  return (
    <div
      className={`fixed top-16 left-4 right-4 p-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
        isOnline
          ? 'bg-green-600 text-white animate-slide-down'
          : 'bg-yellow-600 text-white animate-slide-down'
      }`}
    >
      <div className="flex items-center space-x-2">
        {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
        <span className="text-sm font-medium">
          {isOnline
            ? 'Back online! All features available.'
            : "You're offline. Some features may be limited."}
        </span>
      </div>
    </div>
  );
}
