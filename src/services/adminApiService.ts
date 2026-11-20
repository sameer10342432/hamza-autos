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

  static async checkDuplicateMedia(payload: { base64Data?: string; url?: string; filename?: string }): Promise<any> {
    return this.request('/media/check-duplicate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  static async uploadMediaFile(filePayload: { fileName: string; fileData: string; folder?: string; forceDuplicate?: boolean }): Promise<{ success: boolean; file?: any; duplicateDetected?: boolean; message?: string; matchedRecord?: any }> {
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

  // ==========================================
  // ADVANCED CRM & LEADS
  // ==========================================
  static async getCrmLeads(params?: { status?: string; priority?: string; search?: string }): Promise<{ success: boolean; leads: any[]; total: number }> {
    const qs = new URLSearchParams(params as any).toString();
    return this.request(`/crm/leads${qs ? `?${qs}` : ''}`);
  }

  static async createCrmLead(leadData: any): Promise<{ success: boolean; lead: any }> {
    return this.request('/crm/leads', {
      method: 'POST',
      body: JSON.stringify(leadData)
    });
  }

  static async updateCrmLead(id: string, leadData: any): Promise<{ success: boolean; lead: any }> {
    return this.request(`/crm/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData)
    });
  }

  static async deleteCrmLead(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/crm/leads/${id}`, { method: 'DELETE' });
  }

  static async convertCrmLead(id: string, options: { createBooking?: boolean; appointmentDate?: string; appointmentTime?: string }): Promise<{ success: boolean; customer: any; bookingId?: string; lead: any }> {
    return this.request(`/crm/leads/${id}/convert`, {
      method: 'POST',
      body: JSON.stringify(options)
    });
  }

  static async getCrmFollowups(): Promise<{ success: boolean; followups: any[] }> {
    return this.request('/crm/followups');
  }

  static async createCrmFollowup(data: any): Promise<{ success: boolean; followup: any }> {
    return this.request('/crm/followups', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async updateCrmFollowup(id: string, data: any): Promise<{ success: boolean; followup: any }> {
    return this.request(`/crm/followups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async deleteCrmFollowup(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/crm/followups/${id}`, { method: 'DELETE' });
  }

  static async getCrmInteractions(params?: { leadId?: string; customerId?: string }): Promise<{ success: boolean; interactions: any[] }> {
    const qs = new URLSearchParams(params as any).toString();
    return this.request(`/crm/interactions${qs ? `?${qs}` : ''}`);
  }

  static async createCrmInteraction(data: any): Promise<{ success: boolean; interaction: any }> {
    return this.request('/crm/interactions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // ==========================================
  // MECHANIC MANAGEMENT
  // ==========================================
  static async getMechanics(): Promise<{ success: boolean; mechanics: any[] }> {
    return this.request('/mechanics');
  }

  static async createMechanic(data: any): Promise<{ success: boolean; mechanic: any }> {
    return this.request('/mechanics', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async updateMechanic(id: string, data: any): Promise<{ success: boolean; mechanic: any }> {
    return this.request(`/mechanics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async deleteMechanic(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/mechanics/${id}`, { method: 'DELETE' });
  }

  static async getMechanicAttendance(params?: { date?: string; mechanicId?: string }): Promise<{ success: boolean; attendance: any[] }> {
    const qs = new URLSearchParams(params as any).toString();
    return this.request(`/mechanics/attendance${qs ? `?${qs}` : ''}`);
  }

  static async recordMechanicAttendance(data: any): Promise<{ success: boolean; attendanceRecord: any }> {
    return this.request('/mechanics/attendance', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // ==========================================
  // EXPENSES & FINANCIAL TRANSACTIONS
  // ==========================================
  static async getExpenses(params?: { category?: string; search?: string }): Promise<{ success: boolean; expenses: any[]; totalAmount: number }> {
    const qs = new URLSearchParams(params as any).toString();
    return this.request(`/expenses${qs ? `?${qs}` : ''}`);
  }

  static async createExpense(data: any): Promise<{ success: boolean; expense: any }> {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async updateExpense(id: string, data: any): Promise<{ success: boolean; expense: any }> {
    return this.request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async deleteExpense(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/expenses/${id}`, { method: 'DELETE' });
  }

  static async getExpenseCategories(): Promise<{ success: boolean; categories: any[] }> {
    return this.request('/expenses/categories');
  }

  static async createExpenseCategory(data: any): Promise<{ success: boolean; category: any }> {
    return this.request('/expenses/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async getFinancialTransactions(params?: { type?: string; search?: string }): Promise<{ success: boolean; transactions: any[] }> {
    const qs = new URLSearchParams(params as any).toString();
    return this.request(`/financial/transactions${qs ? `?${qs}` : ''}`);
  }

  static async getProfitSummary(): Promise<{ success: boolean; profitSummary: any }> {
    return this.request('/financial/profit-summary');
  }

  // ==========================================
  // SUPPLIERS & PURCHASE ORDERS
  // ==========================================
  static async getSuppliers(): Promise<{ success: boolean; suppliers: any[] }> {
    return this.request('/suppliers');
  }

  static async createSupplier(data: any): Promise<{ success: boolean; supplier: any }> {
    return this.request('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async updateSupplier(id: string, data: any): Promise<{ success: boolean; supplier: any }> {
    return this.request(`/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async deleteSupplier(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/suppliers/${id}`, { method: 'DELETE' });
  }

  static async getPurchaseOrders(): Promise<{ success: boolean; purchaseOrders: any[] }> {
    return this.request('/purchase-orders');
  }

  static async createPurchaseOrder(data: any): Promise<{ success: boolean; purchaseOrder: any }> {
    return this.request('/purchase-orders', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async receivePurchaseOrder(id: string, data: { receivedItems: Array<{ id: string; quantityReceivedNow: number }>; receivingNotes?: string }): Promise<{ success: boolean; purchaseOrder: any; message: string }> {
    return this.request(`/purchase-orders/${id}/receive`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async payPurchaseOrder(id: string, data: { amount: number; paymentMethod: string; referenceNumber?: string; notes?: string }): Promise<{ success: boolean; purchaseOrder: any; paymentRecord: any }> {
    return this.request(`/purchase-orders/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async getSupplierPayments(): Promise<{ success: boolean; payments: any[] }> {
    return this.request('/supplier-payments');
  }

  // ==========================================
  // GLOBAL SEARCH API
  // ==========================================
  static async globalSearch(query: string): Promise<{ success: boolean; query: string; total: number; results: any[] }> {
    return this.request(`/search/global?q=${encodeURIComponent(query)}`);
  }

  // ==========================================
  // SECURITY & STORAGE HEALTH API
  // ==========================================
  static async getSecurityEvents(): Promise<{ success: boolean; events: any[] }> {
    return this.request('/security/events');
  }

  static async getStorageHealth(): Promise<{ success: boolean; storageHealth: any }> {
    return this.request('/security/storage-health');
  }

  static async getDataIntegrityReport(): Promise<{ success: boolean; integrityReport: any }> {
    return this.request('/security/integrity-check');
  }

  static async getRecoveryHistory(): Promise<{ success: boolean; history: any[] }> {
    return this.request('/security/recovery-history');
  }
}

export const adminApiService = AdminApiService;
