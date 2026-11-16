/**
 * Hamza Autos - Admin API Client Service
 * Communicates with the File-Based Node/Express API
 * Abu Bakar Road, Badami Bagh, Lahore
 */

const API_BASE = '/api';

export interface AdminUser {
  username: string;
  displayName: string;
}

export interface DashboardStats {
  inquiries: {
    total: number;
    new: number;
    inProgress: number;
    converted: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
  };
  blogs: {
    total: number;
    published: number;
    draft: number;
  };
  customers: {
    total: number;
  };
  unreadNotifications: number;
  recentInquiries: any[];
  recentSubmissions: any[];
}

export class AdminApiService {
  private static TOKEN_KEY = 'hamza_autos_admin_token';
  private static USER_KEY = 'hamza_autos_admin_user';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setSession(token: string, user: AdminUser): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static getStoredUser(): AdminUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/me') {
      this.clearSession();
      // Optionally trigger reload or auth modal
      throw new Error('Admin session expired. Please log in again.');
    }

    const data = await response.json();
    if (!response.ok && !data.success) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data as T;
  }

  // ==========================================
  // AUTH
  // ==========================================
  static async login(username: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; token: string; user: AdminUser }> {
    const data = await this.request<{ success: boolean; token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, rememberMe })
    });
    if (data.success && data.token) {
      this.setSession(data.token, data.user);
    }
    return data;
  }

  static async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearSession();
    }
  }

  static async checkAuth(): Promise<{ authenticated: boolean; user?: AdminUser }> {
    try {
      const data = await this.request<{ authenticated: boolean; user?: AdminUser }>('/auth/me');
      return data;
    } catch {
      return { authenticated: false };
    }
  }

  static async updateProfile(payload: { username?: string; displayName?: string; currentPassword?: string; newPassword?: string }) {
    return this.request<{ success: boolean; message: string; user?: AdminUser }>('/auth/profile', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // ==========================================
  // DASHBOARD
  // ==========================================
  static async getDashboardStats(): Promise<{ success: boolean; stats: DashboardStats }> {
    return this.request('/dashboard/stats');
  }

  static async getDashboardCharts(): Promise<{ success: boolean; [key: string]: any }> {
    return this.request('/dashboard/charts');
  }

  // ==========================================
  // CENTRAL INQUIRIES INBOX
  // ==========================================
  static async getInquiries(params: {
    status?: string;
    type?: string;
    search?: string;
    priority?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ success: boolean; inquiries: any[]; total: number; page: number; totalPages: number }> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.type) searchParams.set('type', params.type);
    if (params.search) searchParams.set('search', params.search);
    if (params.priority) searchParams.set('priority', params.priority);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/inquiries${qs}`);
  }

  static async getInquiryById(id: string): Promise<{ success: boolean; inquiry: any }> {
    return this.request(`/inquiries/${id}`);
  }

  static async updateInquiryStatus(id: string, status: string, notes?: string): Promise<{ success: boolean; inquiry: any }> {
    return this.request(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  }

  static async addInquiryNote(id: string, text: string): Promise<{ success: boolean; inquiry: any }> {
    return this.request(`/inquiries/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  static async assignInquiry(id: string, assignedTo: string): Promise<{ success: boolean; inquiry: any }> {
    return this.request(`/inquiries/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTo })
    });
  }

  static async bulkUpdateInquiries(ids: string[], action: 'status' | 'delete' | 'export', status?: string): Promise<{ success: boolean; message: string; count: number }> {
    return this.request('/inquiries/bulk', {
      method: 'POST',
      body: JSON.stringify({ ids, action, status })
    });
  }

  static async deleteInquiry(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/inquiries/${id}`, {
      method: 'DELETE'
    });
  }

  // ==========================================
  // SPECIFIC SUBMISSION STORES
  // ==========================================
  static async getContactSubmissions(): Promise<{ success: boolean; submissions: any[] }> {
    return this.request('/contact');
  }

  static async getBookingRequests(): Promise<{ success: boolean; bookings: any[] }> {
    return this.request('/bookings');
  }

  static async updateBookingStatus(id: string, status: string, notes?: string): Promise<{ success: boolean; booking: any }> {
    return this.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  }

  static async getQuotationRequests(): Promise<{ success: boolean; quotations: any[] }> {
    return this.request('/quotations');
  }

  static async getFeedbackSubmissions(): Promise<{ success: boolean; feedback: any[] }> {
    return this.request('/feedback');
  }

  static async updateFeedbackStatus(id: string, status: string): Promise<{ success: boolean; feedback: any }> {
    return this.request(`/feedback/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // ==========================================
  // BLOG MANAGEMENT
  // ==========================================
  static async getBlogs(params: { category?: string; tag?: string; status?: string; search?: string } = {}): Promise<{ success: boolean; blogs: any[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set('category', params.category);
    if (params.tag) searchParams.set('tag', params.tag);
    if (params.status) searchParams.set('status', params.status);
    if (params.search) searchParams.set('search', params.search);
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/blogs${qs}`);
  }

  static async getBlogByIdOrSlug(idOrSlug: string): Promise<{ success: boolean; blog: any }> {
    return this.request(`/blogs/${idOrSlug}`);
  }

  static async createBlog(blogData: any): Promise<{ success: boolean; blog: any }> {
    return this.request('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData)
    });
  }

  static async updateBlog(id: string, blogData: any): Promise<{ success: boolean; blog: any }> {
    return this.request(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData)
    });
  }

  static async deleteBlog(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/blogs/${id}`, {
      method: 'DELETE'
    });
  }

  static async getBlogCategories(): Promise<{ success: boolean; categories: any[] }> {
    return this.request('/blogs/categories/all');
  }

  static async saveBlogCategories(categories: any[]): Promise<{ success: boolean; categories: any[] }> {
    return this.request('/blogs/categories/all', {
      method: 'POST',
      body: JSON.stringify({ categories })
    });
  }

  static async getBlogTags(): Promise<{ success: boolean; tags: any[] }> {
    return this.request('/blogs/tags/all');
  }

  static async saveBlogTags(tags: any[]): Promise<{ success: boolean; tags: any[] }> {
    return this.request('/blogs/tags/all', {
      method: 'POST',
      body: JSON.stringify({ tags })
    });
  }

  // ==========================================
  // CUSTOMER DIRECTORY
  // ==========================================
  static async getCustomers(search?: string): Promise<{ success: boolean; customers: any[] }> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/customers${qs}`);
  }

  static async getCustomerById(id: string): Promise<{ success: boolean; customer: any }> {
    return this.request(`/customers/${id}`);
  }

  static async updateCustomer(id: string, payload: any): Promise<{ success: boolean; customer: any }> {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  // ==========================================
  // FORM MANAGEMENT REGISTRY
  // ==========================================
  static async getFormsRegistry(): Promise<{ success: boolean; forms: any[] }> {
    return this.request('/forms/registry');
  }

  static async toggleFormActive(id: string, active: boolean): Promise<{ success: boolean; form: any }> {
    return this.request(`/forms/registry/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ active })
    });
  }

  static async updateFormConfig(id: string, config: any): Promise<{ success: boolean; form: any }> {
    return this.request(`/forms/registry/${id}`, {
      method: 'PUT',
      body: JSON.stringify(config)
    });
  }

  // ==========================================
  // WEBSITE CONTENT CMS
  // ==========================================
  static async getContent(section: string): Promise<{ success: boolean; data: any }> {
    return this.request(`/content/${section}`);
  }

  static async saveContent(section: string, data: any): Promise<{ success: boolean; data: any }> {
    return this.request(`/content/${section}`, {
      method: 'POST',
      body: JSON.stringify({ data })
    });
  }

  // ==========================================
  // MEDIA LIBRARY
  // ==========================================
  static async getMediaFiles(folder: string = ''): Promise<{ success: boolean; files: any[]; folders: string[] }> {
    const qs = folder ? `?folder=${encodeURIComponent(folder)}` : '';
    return this.request(`/media${qs}`);
  }

  static async uploadMediaFile(filePayload: { fileName: string; fileData: string; folder?: string }): Promise<{ success: boolean; file: any }> {
    return this.request('/media/upload', {
      method: 'POST',
      body: JSON.stringify(filePayload)
    });
  }

  static async deleteMediaFile(filePath: string): Promise<{ success: boolean; message: string }> {
    return this.request('/media', {
      method: 'DELETE',
      body: JSON.stringify({ filePath })
    });
  }

  // ==========================================
  // SEO MANAGEMENT
  // ==========================================
  static async getSeoSettings(): Promise<{ success: boolean; pages: any[]; general: any }> {
    return this.request('/seo');
  }

  static async saveSeoSettings(payload: { pages: any[]; general: any }): Promise<{ success: boolean; message: string }> {
    return this.request('/seo', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  static async getNotifications(): Promise<{ success: boolean; notifications: any[]; unreadCount: number }> {
    return this.request('/notifications');
  }

  static async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH'
    });
  }

  static async markAllNotificationsRead(): Promise<{ success: boolean }> {
    return this.request('/notifications/read-all', {
      method: 'PATCH'
    });
  }

  // ==========================================
  // REPORTS & AUDIT LOGS
  // ==========================================
  static async getAuditLogs(page: number = 1, limit: number = 50): Promise<{ success: boolean; logs: any[]; total: number }> {
    return this.request(`/audit-logs?page=${page}&limit=${limit}`);
  }

  // ==========================================
  // BACKUP & RESTORE
  // ==========================================
  static async getBackupsList(): Promise<{ success: boolean; backups: any[] }> {
    return this.request('/backup/list');
  }

  static async createBackup(): Promise<{ success: boolean; backup: any }> {
    return this.request('/backup/create', { method: 'POST' });
  }

  static async restoreBackup(backupId: string): Promise<{ success: boolean; message: string }> {
    return this.request('/backup/restore', {
      method: 'POST',
      body: JSON.stringify({ backupId })
    });
  }

  static async exportAllJson(): Promise<any> {
    return this.request('/backup/export-all');
  }

  static async importAllJson(payload: any): Promise<{ success: boolean; results: any }> {
    return this.request('/backup/import-all', {
      method: 'POST',
      body: JSON.stringify({ data: payload })
    });
  }

  // ==========================================
  // ADMIN SETTINGS
  // ==========================================
  static async getSettings(): Promise<{ success: boolean; settings: any }> {
    return this.request('/settings');
  }

  static async saveSettings(settings: any): Promise<{ success: boolean; settings: any }> {
    return this.request('/settings', {
      method: 'POST',
      body: JSON.stringify({ settings })
    });
  }
}
