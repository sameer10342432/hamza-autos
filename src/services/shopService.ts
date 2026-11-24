/**
 * Hamza Autos - Shop Client API Service
 * Handles all public customer storefront queries and authenticated admin controls
 */

import { 
  ShopProduct, 
  ShopCategory, 
  MotorcycleModelSpec, 
  ShopOrder, 
  ShopInventoryMovement, 
  ShopShippingSettings, 
  ShopSettings, 
  ShopDashboardStats,
  CartItem
} from '../types/shop';

const API_BASE = '/api/shop';

function getAdminAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('hamza_admin_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const ShopService = {
  // ============================================================
  // PUBLIC STOREFRONT METHODS
  // ============================================================

  async getProducts(params?: {
    search?: string;
    category?: string;
    brand?: string;
    bikeBrand?: string;
    bikeModel?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    featuredOnly?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: ShopProduct[]; pagination: { page: number; limit: number; totalCount: number; totalPages: number } }> {
    const query = new URLSearchParams();
    if (params) {
      if (params.search) query.set('search', params.search);
      if (params.category) query.set('category', params.category);
      if (params.brand) query.set('brand', params.brand);
      if (params.bikeBrand) query.set('bikeBrand', params.bikeBrand);
      if (params.bikeModel) query.set('bikeModel', params.bikeModel);
      if (params.condition) query.set('condition', params.condition);
      if (params.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
      if (params.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
      if (params.inStockOnly) query.set('inStockOnly', 'true');
      if (params.featuredOnly) query.set('featuredOnly', 'true');
      if (params.sort) query.set('sort', params.sort);
      if (params.page) query.set('page', params.page.toString());
      if (params.limit) query.set('limit', params.limit.toString());
    }

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch shop products.');
    return res.json();
  },

  async getProduct(slugOrId: string): Promise<{ data: ShopProduct; related: ShopProduct[] }> {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(slugOrId)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch product details.');
    }
    return res.json();
  },

  async getCategories(): Promise<ShopCategory[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories.');
    const json = await res.json();
    return json.data || [];
  },

  async getBrandsAndModels(): Promise<MotorcycleModelSpec[]> {
    const res = await fetch(`${API_BASE}/brands-models`);
    if (!res.ok) throw new Error('Failed to fetch bike models.');
    const json = await res.json();
    return json.data || [];
  },

  async getFeaturedAndLatest(): Promise<{ featured: ShopProduct[]; latest: ShopProduct[]; bestSellers: ShopProduct[] }> {
    const res = await fetch(`${API_BASE}/featured-and-latest`);
    if (!res.ok) throw new Error('Failed to fetch featured shop sets.');
    const json = await res.json();
    return json.data;
  },

  async getShippingSettings(): Promise<ShopShippingSettings> {
    const res = await fetch(`${API_BASE}/shipping-settings`);
    if (!res.ok) throw new Error('Failed to fetch shipping configuration.');
    const json = await res.json();
    return json.data;
  },

  async getShopSettings(): Promise<ShopSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch shop settings.');
    const json = await res.json();
    return json.data;
  },

  async placeOrder(payload: {
    customer: {
      fullName: string;
      mobileNumber: string;
      whatsappNumber?: string;
      email?: string;
      deliveryAddress: string;
      city: string;
      province: string;
      postalCode?: string;
      orderNotes?: string;
    };
    items: CartItem[];
    paymentMethod: string;
    paymentReference?: string;
    orderNotes?: string;
  }): Promise<{ orderId: string; orderNumber: string; customerName: string; total: number; whatsappUrl: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Order placement failed.');
    }
    return json.data;
  },

  async trackOrder(query: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(query)}`);
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Tracking details not found.');
    }
    return json.data;
  },

  // ============================================================
  // ADMIN SHOP MANAGEMENT METHODS
  // ============================================================

  async getAdminDashboardStats(): Promise<ShopDashboardStats> {
    const res = await fetch(`${API_BASE}/admin/dashboard-stats`, {
      headers: getAdminAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load admin shop dashboard stats.');
    const json = await res.json();
    return json.data;
  },

  async getAdminProducts(): Promise<ShopProduct[]> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: getAdminAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load products list.');
    const json = await res.json();
    return json.data;
  },

  async createAdminProduct(productData: Partial<ShopProduct>): Promise<ShopProduct> {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(productData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to create product.');
    return json.data;
  },

  async updateAdminProduct(id: string, updates: Partial<ShopProduct> & { stockAdjustmentReason?: string }): Promise<ShopProduct> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update product.');
    return json.data;
  },

  async deleteAdminProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to delete product.');
  },

  async getAdminOrders(params?: {
    status?: string;
    paymentStatus?: string;
    search?: string;
    city?: string;
    province?: string;
  }): Promise<ShopOrder[]> {
    const query = new URLSearchParams();
    if (params) {
      if (params.status) query.set('status', params.status);
      if (params.paymentStatus) query.set('paymentStatus', params.paymentStatus);
      if (params.search) query.set('search', params.search);
      if (params.city) query.set('city', params.city);
      if (params.province) query.set('province', params.province);
    }
    const res = await fetch(`${API_BASE}/admin/orders?${query.toString()}`, {
      headers: getAdminAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load orders.');
    const json = await res.json();
    return json.data;
  },

  async updateAdminOrderStatus(id: string, status: string, note?: string): Promise<ShopOrder> {
    const res = await fetch(`${API_BASE}/admin/shop/orders/${id}/status`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify({ status, note })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update order status.');
    return json.data;
  },

  async updateAdminOrderShipping(id: string, shippingData: {
    courier: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDeliveryDays?: string;
  }): Promise<ShopOrder> {
    const res = await fetch(`${API_BASE}/admin/shop/orders/${id}/shipping`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(shippingData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update shipping info.');
    return json.data;
  },

  async updateAdminOrderPayment(id: string, paymentData: {
    paymentStatus: string;
    paymentReference?: string;
  }): Promise<ShopOrder> {
    const res = await fetch(`${API_BASE}/admin/shop/orders/${id}/payment`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(paymentData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update payment status.');
    return json.data;
  },

  async getAdminInventoryMovements(): Promise<ShopInventoryMovement[]> {
    const res = await fetch(`${API_BASE}/admin/inventory-movements`, {
      headers: getAdminAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load stock movements.');
    const json = await res.json();
    return json.data;
  },

  async createAdminCategory(category: Partial<ShopCategory>): Promise<ShopCategory> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(category)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to create category.');
    return json.data;
  },

  async updateAdminCategory(id: string, updates: Partial<ShopCategory>): Promise<ShopCategory> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update category.');
    return json.data;
  },

  async deleteAdminCategory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to delete category.');
  },

  async createAdminBrandModel(modelSpec: Partial<MotorcycleModelSpec>): Promise<MotorcycleModelSpec> {
    const res = await fetch(`${API_BASE}/admin/brands-models`, {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(modelSpec)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to add motorcycle model.');
    return json.data;
  },

  async deleteAdminBrandModel(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/brands-models/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to delete motorcycle model.');
  },

  async updateAdminSettings(settings: Partial<ShopSettings>): Promise<ShopSettings> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(settings)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update shop settings.');
    return json.data;
  },

  async updateAdminShipping(shipping: Partial<ShopShippingSettings>): Promise<ShopShippingSettings> {
    const res = await fetch(`${API_BASE}/admin/shipping`, {
      method: 'PUT',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(shipping)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update shipping settings.');
    return json.data;
  }
};
