/**
 * Unified Authentication Service for All Frontend Applications
 * Connects to centralized Authentication Service (port 8085)
 * Used by: ecommerce-web, ecommerce-mobile, admin-portal, super-admin, ops-delivery
 */

class UnifiedAuthService {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://api.leafyhealth.com' 
      : 'http://localhost:8085';
    this.token = null;
    this.user = null;
    this.refreshTimeout = null;
  }

  // Initialize auth service and check existing session
  async initialize() {
    const token = this.getStoredToken();
    if (token) {
      const isValid = await this.verifyToken(token);
      if (isValid) {
        this.token = token;
        this.user = await this.getCurrentUser();
        this.scheduleTokenRefresh();
        return { authenticated: true, user: this.user };
      } else {
        this.clearSession();
      }
    }
    return { authenticated: false, user: null };
  }

  // Authenticate user with email/password
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.token = data.token;
        this.user = data.user;
        this.storeToken(data.token);
        this.scheduleTokenRefresh();
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Verify token with authentication service
  async verifyToken(token) {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/verify`, {
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
  }

  // Get current user information
  async getCurrentUser() {
    if (!this.token) return null;

    try {
      const response = await fetch(`${this.baseURL}/api/auth/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.user = data.user;
        return data.user;
      }
    } catch (error) {
      console.error('Get user error:', error);
    }
    return null;
  }

  // Logout user and clear session
  async logout() {
    try {
      if (this.token) {
        await fetch(`${this.baseURL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  // Check if user has specific permission
  hasPermission(permission) {
    if (!this.user) return false;
    return this.user.permissions?.includes(permission) || this.user.role === 'super_admin';
  }

  // Check if user has specific role
  hasRole(role) {
    return this.user?.role === role;
  }

  // Get authenticated API headers
  getAuthHeaders() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }

  // Make authenticated API request
  async apiRequest(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    // Handle 401 responses by clearing session
    if (response.status === 401) {
      this.clearSession();
      throw new Error('Authentication required');
    }

    return response;
  }

  // Token storage methods
  storeToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getStoredToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  clearSession() {
    this.token = null;
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }

  // Schedule automatic token refresh
  scheduleTokenRefresh() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    
    // Refresh token every 23 hours (before 24h expiry)
    this.refreshTimeout = setTimeout(async () => {
      const isValid = await this.verifyToken(this.token);
      if (!isValid) {
        this.clearSession();
      } else {
        this.scheduleTokenRefresh();
      }
    }, 23 * 60 * 60 * 1000);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Get current user
  getUser() {
    return this.user;
  }

  // Get current token
  getToken() {
    return this.token;
  }
}

// Create singleton instance
const unifiedAuthService = new UnifiedAuthService();

export default unifiedAuthService;

// React hook for using auth service
export function useUnifiedAuth() {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Initialize auth service on mount
    unifiedAuthService.initialize().then((result) => {
      setAuthState({
        user: result.user,
        isAuthenticated: result.authenticated,
        isLoading: false,
        error: null,
      });
    });
  }, []);

  const login = async (email, password) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await unifiedAuthService.login(email, password);
    
    if (result.success) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: result.error,
      }));
    }
    
    return result;
  };

  const logout = async () => {
    await unifiedAuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...authState,
    login,
    logout,
    hasPermission: unifiedAuthService.hasPermission.bind(unifiedAuthService),
    hasRole: unifiedAuthService.hasRole.bind(unifiedAuthService),
    apiRequest: unifiedAuthService.apiRequest.bind(unifiedAuthService),
  };
}