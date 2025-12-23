/**
 * API Service Layer for Shopina Frontend
 * Centralized API calls to Django REST backend
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

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
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || error.message || 'Request failed');
  }
  return response.json();
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
    });
    return handleResponse<{ access: string }>(response);
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await fetch(`${API_BASE}/api/users/profile/`, {
      headers: getAuthHeaders(),
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
      `${API_BASE}/api/shop/products/?${queryParams.toString()}`
    );
    return handleResponse<any[]>(response);
  },

  /**
   * Get single product by ID
   */
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE}/api/shop/products/${id}/`);
    return handleResponse<any>(response);
  },

  /**
   * Get top-rated products
   */
  getTopRated: async () => {
    const response = await fetch(`${API_BASE}/api/shop/products/top/`);
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
    const response = await fetch(`${API_BASE}/api/shop/categories/`);
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
    });
    return handleResponse<{ message: string }>(response);
  },

  /**
   * Validate cart for checkout
   */
  validate: async () => {
    const response = await fetch(`${API_BASE}/api/carts/validate/`, {
      headers: getAuthHeaders(),
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
    });
    return handleResponse<any[]>(response);
  },

  /**
   * Get single order by ID
   */
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE}/api/orders/${id}/`, {
      headers: getAuthHeaders(),
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
    const response = await fetch(`${API_BASE}/api/reviews/?product=${productId}`);
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
};

// Export all APIs
export default {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  cart: cartAPI,
  orders: ordersAPI,
  reviews: reviewsAPI,
  notifications: notificationsAPI,
  payments: paymentsAPI,
};
