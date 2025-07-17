import { QueryClient } from '@tanstack/react-query';

// Create query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry 404s or 401s
        if (error?.message?.includes('404') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// API request helper
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Use relative URLs that will be handled by the unified gateway on port 5000
  const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:5000';
  const url = `${baseUrl}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Get auth token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}
