/**
 * Global Error Handler for React Query and Promise Rejections
 * Prevents unhandled rejection errors in browser console
 */

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Suppress unhandled rejection errors from React Query and API calls
    if (event.reason?.message?.includes('Failed to fetch') || 
        event.reason?.message?.includes('NetworkError') ||
        event.reason?.message?.includes('Load failed') ||
        event.reason?.name === 'APIError' ||
        event.reason?.status === 401 ||
        event.reason?.status === 404) {
      event.preventDefault();
      console.log('Network request handled gracefully:', event.reason?.message || 'Unknown error');
    }
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    // Handle specific errors that should be suppressed
    if (event.message?.includes('ResizeObserver loop limit exceeded')) {
      event.preventDefault();
      return;
    }
  });
}

export function suppressQueryErrors() {
  // This function exists to ensure the error handler is loaded
  return true;
}