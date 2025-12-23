/**
 * API Service Layer for Shopina Frontend
 * Centralized API calls to Django REST backend
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
export const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE).origin;
  } catch {
    return 'http://localhost:8000';
  }
})();

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get authentication headers with JWT token
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Handle API response safely, including empty or non-JSON bodies
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const hasBody = response.status !== 204 && response.status !== 205;

  if (!response.ok) {
    if (hasBody && contentType.includes('application/json')) {
      const error = await response.json().catch(() => ({}));
      throw new Error((error as any).detail || (error as any).message || 'Request failed');
    } else {
      const text = hasBody ? await response.text().catch(() => '') : '';
      throw new Error(text || 'Request failed');
    }
  }

  if (!hasBody) {
    return {} as T;
  }

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

// ============================================================================
// Authentication API
// ============================================================================

export const authAPI = {
  /**
   * Register new user
   */
  register: async (data: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }) => {
    const response = await fetch(`${API_BASE}/api/users/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse<{
      user: any;
      access: string;
      refresh: string;
    }>(response);
  },

  /**
   * Login user
   */
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE}/api/users/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    return handleResponse<{
      access: string;
      refresh: string;
    }>(response);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await fetch(`${API_BASE}/api/users/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
      credentials: 'include',
    });
    return handleResponse<{ access: string }>(response);
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await fetch(`${API_BASE}/api/users/profile/`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: any) => {
    const response = await fetch(`${API_BASE}/api/users/profile/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string) => {
    const response = await fetch(`${API_BASE}/api/users/password-reset/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });
    return handleResponse<{ message: string }>(response);
  },

  /**
   * Change password
   */
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await fetch(`${API_BASE}/api/users/change-password/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPassword,
      }),
      credentials: 'include',
    });
    return handleResponse<{ message: string }>(response);
  },
};

// ============================================================================
// Products API
// ============================================================================

export const productsAPI = {
  /**
   * Get all products with optional filters
   */
  getAll: async (params?: { search?: string; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category__name', params.category);

    const response = await fetch(
      `${API_BASE}/api/shop/products/?${queryParams.toString()}`,
      { credentials: 'include' }
    );
    return handleResponse<any[]>(response);
  },

  /**
   * Get single product by ID
   */
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE}/api/shop/products/${id}/`, { credentials: 'include' });
    return handleResponse<any>(response);
  },

  /**
   * Get top-rated products
   */
  getTopRated: async () => {
    const response = await fetch(`${API_BASE}/api/shop/products/top/`, { credentials: 'include' });
    return handleResponse<any[]>(response);
  },
};

// ============================================================================
// Categories API
// ============================================================================

export const categoriesAPI = {
  /**
   * Get all categories
   */
  getAll: async () => {
    const response = await fetch(`${API_BASE}/api/shop/categories/`, { credentials: 'include' });
    return handleResponse<any[]>(response);
  },
};

// ============================================================================
// Cart API
// ============================================================================

export const cartAPI = {
  /**
   * Get user cart
   */
  get: async () => {
    const response = await fetch(`${API_BASE}/api/carts/`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },

  /**
   * Add item to cart
   */
  addItem: async (productId: number, quantity: number = 1) => {
    const response = await fetch(`${API_BASE}/api/carts/items/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id: productId, quantity }),
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },

  /**
   * Update cart item quantity
   */
  updateItem: async (itemId: number, quantity: number) => {
    const response = await fetch(`${API_BASE}/api/carts/items/${itemId}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },

  /**
   * Remove item from cart
   */
  removeItem: async (itemId: number) => {
    const response = await fetch(`${API_BASE}/api/carts/items/${itemId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },

  /**
   * Clear cart
   */
  clear: async () => {
    const response = await fetch(`${API_BASE}/api/carts/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse<{ message: string }>(response);
  },

  /**
   * Validate cart for checkout
   */
  validate: async () => {
    const response = await fetch(`${API_BASE}/api/carts/validate/`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse<{ valid: boolean; message: string }>(response);
  },
};

// ============================================================================
// Orders API
// ============================================================================

export const ordersAPI = {
  /**
   * Get user orders
   */
  getAll: async () => {
    const response = await fetch(`${API_BASE}/api/orders/`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse<any[]>(response);
  },

  /**
   * Get single order by ID
   */
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE}/api/orders/${id}/`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },

  /**
   * Create order from cart
   */
  create: async () => {
    const response = await fetch(`${API_BASE}/api/orders/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },
};

// ============================================================================
// Dashboard / Analytics API
// ============================================================================

export const dashboardAPI = {
  /**
   * Get dashboard stats (orders, revenue, products, customers)
   */
  getStats: async () => {
    const response = await fetch(`${API_BASE}/api/orders/dashboard/stats/`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },
};

// ============================================================================
// Reviews API
// ============================================================================

export const reviewsAPI = {
  /**
   * Get reviews for a product
   */
  getByProduct: async (productId: number) => {
    const response = await fetch(`${API_BASE}/api/reviews/?product=${productId}`, { credentials: 'include' });
    return handleResponse<any[]>(response);
  },

  /**
   * Create a review
   */
  create: async (data: { product: number; rating: number; comment: string }) => {
    const response = await fetch(`${API_BASE}/api/reviews/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse<any>(response);
  },

  /**
   * Update a review
   */
  update: async (id: number, data: { rating?: number; comment?: string }) => {
    const response = await fetch(`${API_BASE}/api/reviews/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(response);
  },

  /**
   * Delete a review
   */
  delete: async (id: number) => {
    const response = await fetch(`${API_BASE}/api/reviews/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },
};

// ============================================================================
// Notifications API
// ============================================================================

export const notificationsAPI = {
  /**
   * Get user notifications
   */
  getAll: async () => {
    const response = await fetch(`${API_BASE}/api/notifications/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any[]>(response);
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id: number) => {
    const response = await fetch(`${API_BASE}/api/notifications/${id}/read/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await fetch(`${API_BASE}/api/notifications/mark-all-read/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },
};

// ============================================================================
// Payments API
// ============================================================================

export const paymentsAPI = {
  /**
   * Create payment intent
   */
  createIntent: async (orderId: number) => {
    const response = await fetch(`${API_BASE}/api/payments/create-intent/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ order_id: orderId }),
    });
    return handleResponse<{ client_secret: string }>(response);
  },

  /**
   * Subscribe to a paid or free plan (no card data stored).
   */
  subscribe: async (data: {
    plan: 'free' | 'starter' | 'pro' | 'enterprise';
    billing_cycle: 'monthly' | 'yearly';
    price: number;
    last4?: string;
  }) => {
    const response = await fetch(`${API_BASE}/api/payments/subscribe/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse<{ status: string; plan: string; billing_cycle: string; price: number }>(response);
  },
};

// Export all APIs
export default {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  cart: cartAPI,
  orders: ordersAPI,
  dashboard: dashboardAPI,
  reviews: reviewsAPI,
  notifications: notificationsAPI,
  payments: paymentsAPI,
};
