import { useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  email: string;
  username?: string;
  role: string;
  permissions?: string[];
  branchId?: number;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Unified Authentication Hook for All Frontend Applications
 * Connects to centralized Authentication Service (port 8085) through unified gateway
 * Used across: ecommerce-web, ecommerce-mobile, admin-portal, super-admin, ops-delivery
 */
export function useUnifiedAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Use unified gateway for all API calls - it routes to auth service
  const authServiceURL = typeof window !== 'undefined' ? window.location.origin : '';

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = getStoredToken();
    if (token) {
      const isValid = await verifyToken(token);
      if (isValid) {
        const user = await getCurrentUser(token);
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          scheduleTokenRefresh(token);
          return;
        }
      }
      clearStoredToken();
    }
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${authServiceURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { token, user } = data;
        storeToken(token);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        scheduleTokenRefresh(token);
        return { success: true, user };
      } else {
        const error = data.message || 'Login failed';
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error,
        }));
        return { success: false, error };
      }
    } catch (error) {
      const errorMessage = 'Network error during login';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [authServiceURL]);

  const logout = useCallback(async () => {
    const token = getStoredToken();
    
    try {
      if (token) {
        await fetch(`${authServiceURL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearStoredToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, [authServiceURL]);

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${authServiceURL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return response.ok && data.valid;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  };

  const getCurrentUser = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(`${authServiceURL}/api/auth/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
    } catch (error) {
      console.error('Get user error:', error);
    }
    return null;
  };

  const hasPermission = useCallback((permission: string): boolean => {
    if (!authState.user) return false;
    return authState.user.permissions?.includes(permission) || authState.user.role === 'super_admin';
  }, [authState.user]);

  const hasRole = useCallback((role: string): boolean => {
    return authState.user?.role === role;
  }, [authState.user]);

  const canAccess = useCallback((roles: string[]): boolean => {
    return authState.user ? roles.includes(authState.user.role) : false;
  }, [authState.user]);

  const apiRequest = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const token = getStoredToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    // Handle 401 responses by clearing session
    if (response.status === 401) {
      clearStoredToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication required',
      });
      throw new Error('Authentication required');
    }

    return response;
  }, []);

  // Token management helpers
  const storeToken = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leafyhealth_auth_token', token);
    }
  };

  const getStoredToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('leafyhealth_auth_token');
    }
    return null;
  };

  const clearStoredToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('leafyhealth_auth_token');
    }
  };

  const scheduleTokenRefresh = (token: string) => {
    // Refresh token every 23 hours (before 24h expiry)
    setTimeout(async () => {
      const isValid = await verifyToken(token);
      if (!isValid) {
        logout();
      } else {
        scheduleTokenRefresh(token);
      }
    }, 23 * 60 * 60 * 1000);
  };

  return {
    ...authState,
    login,
    logout,
    hasPermission,
    hasRole,
    canAccess,
    apiRequest,
    refresh: initializeAuth,
  };
}