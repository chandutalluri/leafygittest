import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  type: string;
  branchId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  initAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

// Verify token function with proper API URL
const verifyToken = async (token: string): Promise<User | null> => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const response = await fetch(`${API_BASE}/api/auth/internal/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            set({
              error: data.message || 'Login failed',
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: 'Network error occurred',
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuthStatus: async () => {
        const { token } = get();
        if (!token) {
          console.log('No token found, skipping verification');
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        try {
          set({ isLoading: true });
          const user = await verifyToken(token);
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ 
              user: null, 
              token: null, 
              isAuthenticated: false,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      initAuth: async () => {
        const { token } = get();
        if (token) {
          await get().checkAuthStatus();
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);