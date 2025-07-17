interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Product methods
  async getProducts(params?: URLSearchParams): Promise<ApiResponse> {
    const query = params ? `?${params.toString()}` : '';
    return this.request(`/api/direct-data/products${query}`);
  }

  async getProduct(id: string): Promise<ApiResponse> {
    return this.request(`/api/direct-data/products/${id}`);
  }

  async getCategories(): Promise<ApiResponse> {
    return this.request('/api/direct-data/categories');
  }

  // Auth methods
  async login(credentials: { email: string; password: string }): Promise<ApiResponse> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }): Promise<ApiResponse> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Order methods
  async getOrders(): Promise<ApiResponse> {
    return this.request('/api/direct-data/orders');
  }

  async getOrder(id: string): Promise<ApiResponse> {
    return this.request(`/api/direct-data/orders/${id}`);
  }

  // Cart methods
  async getCart(): Promise<ApiResponse> {
    return this.request('/api/direct-data/cart');
  }

  async addToCart(item: any): Promise<ApiResponse> {
    return this.request('/api/direct-data/cart/add', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateCartItem(id: string, quantity: number): Promise<ApiResponse> {
    return this.request(`/api/direct-data/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(id: string): Promise<ApiResponse> {
    return this.request(`/api/direct-data/cart/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
