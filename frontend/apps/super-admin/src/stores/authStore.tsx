import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  role?: string; // Added for compatibility
  company_id?: string;
  branch_id?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  loginInternal: (email: string, password: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  initAuth: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: true,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, loading: false, isLoading: false, error: null, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, loading: false, isLoading: false, error: null, isAuthenticated: false });
    // Redirect to Super Admin login page instead of customer page
    window.location.href = '/superadmin/login';
  },

  loginInternal: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/auth/internal/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Ensure user type is properly set based on email
      const userData = {
        ...data.user,
        user_type: email === 'global.admin@leafyhealth.com' ? 'global_admin' : 
                  email === 'ops.admin@leafyhealth.com' ? 'operational_admin' : 
                  data.user.user_type
      };
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, token: data.token, loading: false, isLoading: false, error: null, isAuthenticated: true });

      return true;
    } catch (error: any) {
      set({ error: error.message, loading: false, isLoading: false, isAuthenticated: false });
      return false;
    }
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        console.log('No token found, skipping verification');
        set({ loading: false });
        return;
      }

      // Verify token is still valid
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const user = JSON.parse(userStr);
        // Ensure user type is set correctly on auth check
        const userData = {
          ...user,
          user_type: user.email === 'global.admin@leafyhealth.com' ? 'global_admin' : 
                    user.email === 'ops.admin@leafyhealth.com' ? 'operational_admin' : 
                    user.user_type
        };
        set({ user: userData, token, loading: false, isLoading: false, error: null, isAuthenticated: true });
      } else {
        // Token invalid, clear storage and redirect to Super Admin login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, loading: false, isLoading: false, error: null, isAuthenticated: false });
        window.location.href = '/superadmin/login';
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      set({ loading: false, isLoading: false, error: 'Authentication check failed', isAuthenticated: false });
    }
  },

  // Initialize auth check with timeout
  initAuth: () => {
    const { checkAuth } = get();
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Auth initialization timeout, setting loading to false');
      set({ loading: false, isLoading: false });
    }, 3000);

    checkAuth().finally(() => {
      clearTimeout(timeout);
    });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ loading, isLoading: loading });
  }
}));