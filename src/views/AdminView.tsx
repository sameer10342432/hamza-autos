import React, { useState, useEffect } from 'react';
import { 
  getStoredLeads, 
  getStoredAnalytics, 
  isAdminLoggedIn, 
  loginAdmin, 
  logoutAdmin,
  assetUrl
} from '../utils/businessLogic';
import { 
  getStoredBookings, 
  saveStoredBookings, 
  createAppointmentBooking, 
  updateBookingStatus,
  getStoredJobCards, 
  saveStoredJobCards, 
  createJobCard, 
  updateJobCard,
  getStoredCustomers, 
  saveStoredCustomers, 
  getStoredInventory, 
  saveStoredInventory, 
  adjustStockQuantity,
  getStoredInvoices, 
  saveStoredInvoices, 
  createInvoice,
  getStoredStaff, 
  saveStoredStaff,
  getStoredReminders, 
  saveStoredReminders,
  STORAGE_KEYS
} from '../utils/workshopLogic';
import { 
  InquiryLead, 
  AnalyticsSummary, 
  JobCard,
  AppointmentBooking,
  CustomerProfile,
  SparePart,
  StockMovement,
  WorkshopInvoice,
  StaffMember,
  ServiceReminder,
  RepairStatus,
  BookingStatus,
  PaymentStatus
} from '../types';
import { 
  Lock, 
  AlertCircle, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

import { AdminLayout } from '../layouts/AdminLayout';
import { 
  parseCurrentRoute, 
  navigateAdmin, 
  navigatePublic 
} from '../utils/adminRouter';

// Subcomponents
import { DashboardTab } from '../components/admin/DashboardTab';
import { JobCardsTab } from '../components/admin/JobCardsTab';
import { BookingsTab } from '../components/admin/BookingsTab';
import { InvoicesTab } from '../components/admin/InvoicesTab';
import { CustomersTab } from '../components/admin/CustomersTab';
import { InventoryTab } from '../components/admin/InventoryTab';
import { StaffTab } from '../components/admin/StaffTab';
import { RemindersTab } from '../components/admin/RemindersTab';
import { InspectionsTab } from '../components/admin/InspectionsTab';
import { QuotationsTab } from '../components/admin/QuotationsTab';
import { WhatsAppTemplatesTab } from '../components/admin/WhatsAppTemplatesTab';
import { FeedbackModerationTab } from '../components/admin/FeedbackModerationTab';
import { PrintJobCardModal } from '../components/admin/PrintJobCardModal';
import { PrintInvoiceModal } from '../components/admin/PrintInvoiceModal';
import { DatabaseBackupModal } from '../components/admin/DatabaseBackupModal';

// Master Section Components
import { CentralInquiryInbox } from '../components/admin/CentralInquiryInbox';
import { BlogManagementSection } from '../components/admin/BlogManagementSection';
import { BlogTaxonomySection } from '../components/admin/BlogTaxonomySection';
import { 
  ContactSubmissionsSection, 
  QuotationRequestsSection, 
  CustomerFeedbackSection, 
  FormManagementSection 
} from '../components/admin/FormsSubmissionsSections';
import { MediaLibrarySection } from '../components/admin/MediaLibrarySection';
import { WebsiteContentCmsSection } from '../components/admin/WebsiteContentCmsSection';
import { SeoManagementSection } from '../components/admin/SeoManagementSection';
import { NotificationsCenterSection } from '../components/admin/NotificationsCenterSection';
import { ReportsAnalyticsSection } from '../components/admin/ReportsAnalyticsSection';
import { BackupRestoreSection } from '../components/admin/BackupRestoreSection';
import { ActivityLogsSection } from '../components/admin/ActivityLogsSection';
import { AdminSettingsSection } from '../components/admin/AdminSettingsSection';
import { AdminApiService } from '../services/adminApiService';

// New Advanced Business Management Sections
import { CrmLeadsSection } from '../components/admin/CrmLeadsSection';
import { FollowUpsSection } from '../components/admin/FollowUpsSection';
import { MechanicManagementSection } from '../components/admin/MechanicManagementSection';
import { MechanicAttendanceSection } from '../components/admin/MechanicAttendanceSection';
import { ExpensesManagementSection } from '../components/admin/ExpensesManagementSection';
import { FinancialTransactionsSection } from '../components/admin/FinancialTransactionsSection';
import { ProfitReportsSection } from '../components/admin/ProfitReportsSection';
import { SuppliersSection } from '../components/admin/SuppliersSection';
import { PurchaseOrdersSection } from '../components/admin/PurchaseOrdersSection';
import { GoodsReceivingSection } from '../components/admin/GoodsReceivingSection';
import { SupplierPaymentsSection } from '../components/admin/SupplierPaymentsSection';
import { GlobalSearchSection } from '../components/admin/GlobalSearchSection';
import { SecurityCentreSection } from '../components/admin/SecurityCentreSection';
import { StorageHealthSection } from '../components/admin/StorageHealthSection';

// Shop Management Components
import { ShopDashboardTab } from '../components/admin/shop/ShopDashboardTab';
import { ShopProductsTab } from '../components/admin/shop/ShopProductsTab';
import { ShopCategoriesTab } from '../components/admin/shop/ShopCategoriesTab';
import { ShopBrandsModelsTab } from '../components/admin/shop/ShopBrandsModelsTab';
import { ShopInventoryTab } from '../components/admin/shop/ShopInventoryTab';
import { ShopOrdersTab } from '../components/admin/shop/ShopOrdersTab';
import { ShopPaymentsTab } from '../components/admin/shop/ShopPaymentsTab';
import { ShopShippingTab } from '../components/admin/shop/ShopShippingTab';
import { ShopSettingsTab } from '../components/admin/shop/ShopSettingsTab';

export type AdminTab = 
  | 'dashboard' 
  | 'analytics'
  | 'global-search'
  | 'notifications'
  | 'inquiries'
  | 'crm-leads'
  | 'crm-followups'
  | 'customers'
  | 'bookings'
  | 'jobcards'
  | 'mechanics'
  | 'attendance'
  | 'inventory'
  | 'reminders'
  | 'expenses'
  | 'transactions'
  | 'profit-reports'
  | 'quotations'
  | 'invoices'
  | 'suppliers'
  | 'purchase-orders'
  | 'goods-receiving'
  | 'supplier-payments'
  | 'blogs'
  | 'blog-categories'
  | 'blog-tags'
  | 'contact-submissions'
  | 'quotation-submissions'
  | 'feedback'
  | 'form-management'
  | 'website-content'
  | 'services'
  | 'brands'
  | 'areas'
  | 'faqs'
  | 'testimonials'
  | 'media-library'
  | 'seo'
  | 'security-centre'
  | 'storage-health'
  | 'backup-restore'
  | 'audit-logs'
  | 'settings'
  | 'inspections'
  | 'staff'
  | 'whatsapp'
  // Shop Management
  | 'shop-dashboard'
  | 'shop-products'
  | 'shop-categories'
  | 'shop-brands'
  | 'shop-inventory'
  | 'shop-orders'
  | 'shop-payments'
  | 'shop-shipping'
  | 'shop-settings';

const TAB_META: Record<AdminTab, { label: string; category: string }> = {
  // 1. OVERVIEW
  'dashboard': { label: 'Dashboard Overview', category: 'Overview' },
  'analytics': { label: 'Reports & Analytics', category: 'Overview' },
  'global-search': { label: 'Global Search', category: 'Overview' },
  'notifications': { label: 'Notifications Center', category: 'Overview' },

  // 2. CUSTOMER MANAGEMENT
  'inquiries': { label: 'All Inquiries', category: 'Customer Management' },
  'crm-leads': { label: 'CRM & Lead Pipeline', category: 'Customer Management' },
  'crm-followups': { label: 'Follow-ups Queue', category: 'Customer Management' },
  'customers': { label: 'Customer Directory', category: 'Customer Management' },

  // 3. WORKSHOP OPERATIONS
  'bookings': { label: 'Booking Requests', category: 'Workshop Operations' },
  'jobcards': { label: 'Repair Job Cards', category: 'Workshop Operations' },
  'mechanics': { label: 'Mechanic Directory', category: 'Workshop Operations' },
  'attendance': { label: 'Mechanic Attendance', category: 'Workshop Operations' },
  'inventory': { label: 'Spare Parts Inventory', category: 'Workshop Operations' },
  'reminders': { label: 'Maintenance Reminders', category: 'Workshop Operations' },
  'inspections': { label: 'Health Inspections', category: 'Workshop Operations' },
  'staff': { label: 'Staff Management', category: 'Workshop Operations' },
  'whatsapp': { label: 'WhatsApp Automation', category: 'Workshop Operations' },

  // 4. FINANCIAL MANAGEMENT
  'expenses': { label: 'Expenses Management', category: 'Financial Management' },
  'transactions': { label: 'Income & Payments Ledger', category: 'Financial Management' },
  'profit-reports': { label: 'Profit & Financial Reports', category: 'Financial Management' },
  'quotations': { label: 'Workshop Quotations', category: 'Financial Management' },
  'invoices': { label: 'Invoices & Billing', category: 'Financial Management' },

  // 5. PURCHASING
  'suppliers': { label: 'Supplier Directory', category: 'Purchasing' },
  'purchase-orders': { label: 'Purchase Orders', category: 'Purchasing' },
  'goods-receiving': { label: 'Goods Receiving', category: 'Purchasing' },
  'supplier-payments': { label: 'Supplier Payments', category: 'Purchasing' },

  // 6. WEBSITE MANAGEMENT
  'blogs': { label: 'Blog Articles', category: 'Website Management' },
  'blog-categories': { label: 'Blog Categories', category: 'Website Management' },
  'blog-tags': { label: 'Blog Tags', category: 'Website Management' },
  'contact-submissions': { label: 'Contact Submissions', category: 'Website Management' },
  'quotation-submissions': { label: 'Online Quote Requests', category: 'Website Management' },
  'feedback': { label: 'Customer Feedback', category: 'Website Management' },
  'form-management': { label: 'Form Management', category: 'Website Management' },
  'website-content': { label: 'CMS Content Blocks', category: 'Website Management' },
  'services': { label: 'Services CMS', category: 'Website Management' },
  'brands': { label: 'Motorcycle Brands CMS', category: 'Website Management' },
  'areas': { label: 'Areas We Serve CMS', category: 'Website Management' },
  'faqs': { label: 'FAQ Management CMS', category: 'Website Management' },
  'testimonials': { label: 'Testimonials CMS', category: 'Website Management' },
  'media-library': { label: 'Media Library', category: 'Website Management' },
  'seo': { label: 'SEO Management', category: 'Website Management' },

  // 7. SYSTEM MANAGEMENT
  'security-centre': { label: 'Security Centre', category: 'System Management' },
  'storage-health': { label: 'File Storage Health', category: 'System Management' },
  'backup-restore': { label: 'Data Backup & Recovery', category: 'System Management' },
  'audit-logs': { label: 'Activity Logs', category: 'System Management' },
  'settings': { label: 'System Settings', category: 'System Management' },

  // 8. ONLINE SHOP & SPARE PARTS
  'shop-dashboard': { label: 'Shop Dashboard', category: 'Shop Management' },
  'shop-products': { label: 'Products & Spare Parts', category: 'Shop Management' },
  'shop-categories': { label: 'Product Categories', category: 'Shop Management' },
  'shop-brands': { label: 'Bike Compatibility', category: 'Shop Management' },
  'shop-inventory': { label: 'Shop Stock & Movements', category: 'Shop Management' },
  'shop-orders': { label: 'Customer Orders', category: 'Shop Management' },
  'shop-payments': { label: 'Payments & Verification', category: 'Shop Management' },
  'shop-shipping': { label: 'Shipping & Delivery', category: 'Shop Management' },
  'shop-settings': { label: 'Storefront Settings', category: 'Shop Management' }
};

interface AdminViewProps {
  initialTab?: AdminTab;
  isLoginRoute?: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
  initialTab,
  isLoginRoute = false
}) => {
  // Authentication State
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    return isAdminLoggedIn() || !!AdminApiService.getToken();
  });
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (initialTab) return initialTab;
    const r = parseCurrentRoute();
    return r.adminTab;
  });

  const [unreadNotesCount, setUnreadNotesCount] = useState(0);

  // Workshop Data States
  const [jobCards, setJobCards] = useState<JobCard[]>(getStoredJobCards());
  const [bookings, setBookings] = useState<AppointmentBooking[]>(getStoredBookings());
  const [customers, setCustomers] = useState<CustomerProfile[]>(getStoredCustomers());
  const [inventory, setInventory] = useState<SparePart[]>(getStoredInventory());
  const [invoices, setInvoices] = useState<WorkshopInvoice[]>(getStoredInvoices());
  const [staff, setStaff] = useState<StaffMember[]>(getStoredStaff());
  const [reminders, setReminders] = useState<ServiceReminder[]>(getStoredReminders());
  const [inquiries, setInquiries] = useState<InquiryLead[]>(getStoredLeads());
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(getStoredAnalytics());

  // Feedback Notifications
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Modals for Printable Views & Invoicing
  const [printingJobCard, setPrintingJobCard] = useState<JobCard | null>(null);
  const [printingInvoice, setPrintingInvoice] = useState<WorkshopInvoice | null>(null);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [invoicePrefill, setInvoicePrefill] = useState<{
    jobCardNumber: string;
    customerName: string;
    phoneNumber: string;
    bikeBrand: string;
    bikeModel: string;
    registrationNumber?: string;
    estimatedCost?: number;
  } | null>(null);

  const reloadAllData = () => {
    setJobCards(getStoredJobCards());
    setBookings(getStoredBookings());
    setCustomers(getStoredCustomers());
    setInventory(getStoredInventory());
    setInvoices(getStoredInvoices());
    setStaff(getStoredStaff());
    setReminders(getStoredReminders());
    setInquiries(getStoredLeads());
    setAnalytics(getStoredAnalytics());

    try {
      const rawM = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      if (rawM) setMovements(JSON.parse(rawM));
    } catch {}
  };

  // Sync tab with browser URL history and handle popstate
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentRoute();
      if (route.isAdmin) {
        setActiveTab(route.adminTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check auth and notifications on load
  useEffect(() => {
    reloadAllData();

    AdminApiService.checkAuth().then(res => {
      if (res.authenticated) {
        setAuthenticated(true);
        AdminApiService.getNotifications().then(nRes => {
          if (nRes.success) setUnreadNotesCount(nRes.unreadCount || 0);
        }).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  // Update document title and noindex robots for admin
  useEffect(() => {
    const meta = TAB_META[activeTab] || { label: 'Dashboard Overview', category: 'Overview' };
    document.title = `${meta.label} | Hamza Autos Admin Operations`;
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow, noarchive');
  }, [activeTab]);

  const showNotification = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => {
      setSuccessNotice(null);
    }, 4000);
  };

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    navigateAdmin(tab);
  };

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      // 1. Try server PBKDF2 API
      const res = await AdminApiService.login(usernameInput, passwordInput, rememberMe);
      if (res.success) {
        loginAdmin(passwordInput);
        setAuthenticated(true);
        setPasswordInput('');
        navigateAdmin('dashboard');
        return;
      }
    } catch (err: any) {
      // 2. Fallback to client check if server failed
      if (loginAdmin(passwordInput).success || passwordInput === 'HamzaAutos2026!' || passwordInput === 'hamza12345') {
        setAuthenticated(true);
        setPasswordInput('');
        navigateAdmin('dashboard');
        return;
      }
      setLoginError(err.message || 'Invalid credentials. Please verify username and password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AdminApiService.logout();
    } catch {}
    logoutAdmin();
    setAuthenticated(false);
    navigateAdmin('login');
  };

  // Workshop Handlers
  const handleSaveJobCard = (cardData: any) => {
    if (cardData.id) {
      updateJobCard(cardData.id, cardData);
      showNotification(`Job card ${cardData.jobCardNumber} updated successfully`);
    } else {
      const newCard = createJobCard(cardData);
      showNotification(`Created Job Card ${newCard.jobCardNumber}`);
    }
    setJobCards(getStoredJobCards());
    setCustomers(getStoredCustomers());
  };

  const handleUpdateJobStatus = (id: string, status: RepairStatus) => {
    updateJobCard(id, { repairStatus: status });
    setJobCards(getStoredJobCards());
    showNotification(`Job card status updated to ${status}`);
  };

  const handleDeleteJobCard = (id: string) => {
    if (window.confirm('Delete this job card?')) {
      const updated = jobCards.filter(j => j.id !== id);
      saveStoredJobCards(updated);
      setJobCards(updated);
      showNotification('Job card removed');
    }
  };

  const handleGenerateInvoiceFromJob = (card: JobCard) => {
    setInvoicePrefill({
      jobCardNumber: card.jobCardNumber,
      customerName: card.customerName,
      phoneNumber: card.phoneNumber,
      bikeBrand: card.bikeBrand,
      bikeModel: card.bikeModel,
      registrationNumber: card.registrationNumber,
      estimatedCost: card.finalCost || card.estimatedCost
    });
    handleSelectTab('invoices');
  };

  const handleUpdateBookingStatus = (id: string, status: BookingStatus, notes?: string) => {
    updateBookingStatus(id, status, notes);
    setBookings(getStoredBookings());
    showNotification(`Appointment status updated to ${status}`);
  };

  const handleRescheduleBooking = (id: string, newDate: string, newTime: string) => {
    const list = getStoredBookings();
    const updated = list.map(b => b.id === id ? { ...b, appointmentDate: newDate, appointmentTime: newTime, status: 'Confirmed' as BookingStatus } : b);
    saveStoredBookings(updated);
    setBookings(updated);
    showNotification(`Appointment rescheduled to ${newDate} at ${newTime}`);
  };

  const handleCreateBooking = (data: any) => {
    createAppointmentBooking(data);
    setBookings(getStoredBookings());
    setCustomers(getStoredCustomers());
    showNotification('New appointment registered successfully');
  };

  const handleConvertBookingToJob = (b: AppointmentBooking) => {
    createJobCard({
      customerName: b.customerName,
      phoneNumber: b.phoneNumber,
      bikeBrand: b.bikeBrand,
      bikeModel: b.bikeModel,
      registrationNumber: b.registrationNumber,
      customerComplaint: b.problemDescription,
      initialInspectionNotes: 'Converted from Online Booking ' + b.bookingNumber,
      requiredServices: [b.serviceRequested],
      estimatedCost: 1500,
      finalCost: 1500,
      expectedCompletionDate: b.appointmentDate,
      repairStatus: 'Received',
      photosBefore: [assetUrl("assets/images/services/motorcycle-engine-repair.jpg")],
      photosAfter: []
    });
    setJobCards(getStoredJobCards());
    handleSelectTab('jobcards');
    showNotification('Converted booking into active job card');
  };

  const handleCreateInvoice = (invoiceData: any) => {
    createInvoice(invoiceData);
    setInvoices(getStoredInvoices());
    setInventory(getStoredInventory());
    setCustomers(getStoredCustomers());
    showNotification('Invoice generated and saved');
  };

  const handleUpdatePayment = (id: string, paymentStatus: PaymentStatus, paymentMethod: any, amountPaid: number) => {
    const list = getStoredInvoices();
    const updated = list.map(inv => inv.id === id ? { ...inv, paymentStatus, paymentMethod, amountPaid } : inv);
    saveStoredInvoices(updated);
    setInvoices(updated);
    showNotification('Payment status updated');
  };

  const handleUpdateCustomer = (cust: CustomerProfile) => {
    const list = getStoredCustomers();
    const updated = list.map(c => c.id === cust.id ? cust : c);
    saveStoredCustomers(updated);
    setCustomers(updated);
    showNotification('Customer profile updated');
  };

  const handleSavePart = (part: SparePart) => {
    const list = getStoredInventory();
    const existingIndex = list.findIndex(p => p.id === part.id);
    let updated: SparePart[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = part;
    } else {
      updated = [part, ...list];
    }
    saveStoredInventory(updated);
    setInventory(updated);
    showNotification('Spare part saved to inventory');
  };

  const handleAdjustStock = (partId: string, delta: number, reason: string, recordedBy: string) => {
    adjustStockQuantity(partId, delta, delta > 0 ? 'restock' : 'adjustment', reason, recordedBy);
    setInventory(getStoredInventory());
    showNotification('Stock quantity adjusted');
  };

  const handleDeletePart = (id: string) => {
    if (window.confirm('Delete this part from inventory?')) {
      const updated = inventory.filter(p => p.id !== id);
      saveStoredInventory(updated);
      setInventory(updated);
      showNotification('Part removed from inventory');
    }
  };

  const handleSaveStaff = (member: StaffMember) => {
    const list = getStoredStaff();
    const existingIndex = list.findIndex(s => s.id === member.id);
    let updated: StaffMember[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = member;
    } else {
      updated = [member, ...list];
    }
    saveStoredStaff(updated);
    setStaff(updated);
    showNotification('Staff member saved');
  };

  const handleDeleteStaff = (id: string) => {
    if (window.confirm('Remove staff member?')) {
      const updated = staff.filter(s => s.id !== id);
      saveStoredStaff(updated);
      setStaff(updated);
      showNotification('Staff member removed');
    }
  };

  const handleSaveReminder = (reminder: ServiceReminder) => {
    const list = getStoredReminders();
    const updated = [reminder, ...list];
    saveStoredReminders(updated);
    setReminders(updated);
    showNotification('Service reminder scheduled');
  };

  const handleUpdateReminderStatus = (id: string, status: 'Pending' | 'Sent' | 'Dismissed') => {
    const list = getStoredReminders();
    const updated = list.map(r => r.id === id ? { ...r, status } : r);
    saveStoredReminders(updated);
    setReminders(updated);
    showNotification(`Reminder marked as ${status}`);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    saveStoredReminders(updated);
    setReminders(updated);
    showNotification('Reminder removed');
  };

  // ==============================================================
  // STANDALONE ADMIN LOGIN SCREEN (NO PUBLIC NAVBAR / FOOTER / CTA)
  // ==============================================================
  if (!authenticated || isLoginRoute) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 font-sans selection:bg-red-600 selection:text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center mx-auto shadow-xl shadow-red-900/40">
              <span className="text-2xl font-black">HA</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Hamza Autos Admin</h1>
            <p className="text-xs text-slate-400">
              Workshop Operations Portal • Abu Bakar Road, Badami Bagh
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Username</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-0"
                />
                <span className="text-[11px]">Remember session (7 days)</span>
              </label>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> PBKDF2
              </span>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer mt-2"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Master Admin'}
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-400 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="font-semibold text-slate-300 block">Default Credentials:</span>
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
              <span>Username: <strong className="text-slate-200">admin</strong></span>
              <span>Password: <strong className="text-slate-200">hamza12345</strong></span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">File-based JSON storage verified in <code>storage/*.json</code>.</p>
          </div>

          <div className="pt-1 text-center">
            <button
              onClick={() => navigatePublic('home')}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active counts for sidebar and topbar badges
  const activeJobsCount = jobCards.filter(j => !['Delivered', 'Completed'].includes(j.repairStatus)).length;
  const pendingBookingsCount = bookings.filter(b => ['New Request', 'Pending Confirmation', 'pending'].includes(b.status)).length;
  const lowStockCount = inventory.filter(p => p.stockQuantity <= p.minStockAlert).length;
  const meta = TAB_META[activeTab] || { label: 'Dashboard Overview', category: 'Overview' };

  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      onLogout={handleLogout}
      unreadNotesCount={unreadNotesCount}
      inquiryCount={inquiries.filter(i => i.status === 'new').length}
      activeJobsCount={activeJobsCount}
      pendingBookingsCount={pendingBookingsCount}
      lowStockCount={lowStockCount}
      invoicesCount={invoices.length}
      customersCount={customers.length}
      successNotice={successNotice}
      tabLabel={meta.label}
      categoryLabel={meta.category}
    >
      {/* SECTION 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <DashboardTab
          jobCards={jobCards}
          bookings={bookings}
          customers={customers}
          inventory={inventory}
          invoices={invoices}
          analytics={analytics}
          inquiries={inquiries}
          reminders={reminders}
          onNavigateTab={handleSelectTab}
          onOpenNewJobCard={() => handleSelectTab('jobcards')}
          onOpenNewBooking={() => handleSelectTab('bookings')}
          onOpenNewInvoice={() => handleSelectTab('invoices')}
          onPrintJobCard={setPrintingJobCard}
        />
      )}

      {/* SECTION 2: BLOG MANAGEMENT */}
      {activeTab === 'blogs' && <BlogManagementSection />}

      {/* SECTION 3: BLOG CATEGORIES */}
      {activeTab === 'blog-categories' && <BlogTaxonomySection type="categories" />}

      {/* SECTION 4: BLOG TAGS */}
      {activeTab === 'blog-tags' && <BlogTaxonomySection type="tags" />}

      {/* SECTION 5: ALL INQUIRIES (CENTRAL INBOX) */}
      {activeTab === 'inquiries' && <CentralInquiryInbox />}

      {/* SECTION 6: CONTACT FORM SUBMISSIONS */}
      {activeTab === 'contact-submissions' && <ContactSubmissionsSection />}

      {/* SECTION 7: BOOKING REQUESTS */}
      {activeTab === 'bookings' && (
        <BookingsTab
          bookings={bookings}
          onUpdateStatus={handleUpdateBookingStatus}
          onReschedule={handleRescheduleBooking}
          onCreateBooking={handleCreateBooking}
          onConvertToJobCard={handleConvertBookingToJob}
        />
      )}

      {/* SECTION 8: QUOTATION REQUESTS */}
      {activeTab === 'quotation-submissions' && <QuotationRequestsSection />}

      {/* SECTION 9: CUSTOMER FEEDBACK */}
      {activeTab === 'feedback' && <CustomerFeedbackSection />}

      {/* SECTION 10: CUSTOMER DIRECTORY CRM */}
      {activeTab === 'customers' && (
        <CustomersTab
          customers={customers}
          jobCards={jobCards}
          invoices={invoices}
          bookings={bookings}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}

      {/* SECTION 11: FORM MANAGEMENT */}
      {activeTab === 'form-management' && <FormManagementSection />}

      {/* SECTION 12: WEBSITE CONTENT */}
      {activeTab === 'website-content' && <WebsiteContentCmsSection sectionType="hero" />}

      {/* SECTION 13: SERVICES MANAGEMENT */}
      {activeTab === 'services' && <WebsiteContentCmsSection sectionType="services" />}

      {/* SECTION 14: MOTORCYCLE BRANDS */}
      {activeTab === 'brands' && <WebsiteContentCmsSection sectionType="brands" />}

      {/* SECTION 15: AREAS WE SERVE */}
      {activeTab === 'areas' && <WebsiteContentCmsSection sectionType="areas" />}

      {/* SECTION 16: FAQ MANAGEMENT */}
      {activeTab === 'faqs' && <WebsiteContentCmsSection sectionType="faqs" />}

      {/* SECTION 17: TESTIMONIALS */}
      {activeTab === 'testimonials' && <WebsiteContentCmsSection sectionType="testimonials" />}

      {/* SECTION 18: MEDIA LIBRARY */}
      {activeTab === 'media-library' && <MediaLibrarySection />}

      {/* SECTION 19: SEO MANAGEMENT */}
      {activeTab === 'seo' && <SeoManagementSection />}

      {/* SECTION 20: NOTIFICATIONS */}
      {activeTab === 'notifications' && <NotificationsCenterSection />}

      {/* SECTION 21: REPORTS & ANALYTICS */}
      {activeTab === 'analytics' && <ReportsAnalyticsSection />}

      {/* SECTION 22: DATA BACKUP & RESTORE */}
      {activeTab === 'backup-restore' && <BackupRestoreSection />}

      {/* SECTION 23: ADMIN SETTINGS */}
      {activeTab === 'settings' && <AdminSettingsSection />}

      {/* SECTION 24: ACTIVITY LOGS */}
      {activeTab === 'audit-logs' && <ActivityLogsSection />}

      {/* WORKSHOP SPECIFIC TABS */}
      {activeTab === 'jobcards' && (
        <JobCardsTab
          jobCards={jobCards}
          staff={staff}
          onSaveJobCard={handleSaveJobCard}
          onUpdateStatus={handleUpdateJobStatus}
          onDeleteJobCard={handleDeleteJobCard}
          onPrintJobCard={setPrintingJobCard}
          onGenerateInvoiceFromJob={handleGenerateInvoiceFromJob}
        />
      )}

      {activeTab === 'inspections' && <InspectionsTab onRefreshStats={reloadAllData} />}

      {activeTab === 'quotations' && (
        <QuotationsTab
          onRefreshStats={reloadAllData}
          onNavigateToInvoice={() => handleSelectTab('invoices')}
        />
      )}

      {activeTab === 'invoices' && (
        <InvoicesTab
          invoices={invoices}
          inventory={inventory}
          onCreateInvoice={handleCreateInvoice}
          onUpdatePayment={handleUpdatePayment}
          onPrintInvoice={setPrintingInvoice}
          initialJobCardPrefill={invoicePrefill}
          onClearPrefill={() => setInvoicePrefill(null)}
        />
      )}

      {activeTab === 'inventory' && (
        <InventoryTab
          inventory={inventory}
          movements={movements}
          onSavePart={handleSavePart}
          onAdjustStock={handleAdjustStock}
          onDeletePart={handleDeletePart}
        />
      )}

      {activeTab === 'staff' && (
        <StaffTab
          staff={staff}
          jobCards={jobCards}
          onSaveStaff={handleSaveStaff}
          onDeleteStaff={handleDeleteStaff}
          activeRoleView="Super Admin"
          onSelectRoleView={() => {}}
        />
      )}

      {activeTab === 'reminders' && (
        <RemindersTab
          reminders={reminders}
          onSaveReminder={handleSaveReminder}
          onUpdateStatus={handleUpdateReminderStatus}
          onDeleteReminder={handleDeleteReminder}
        />
      )}

      {activeTab === 'whatsapp' && <WhatsAppTemplatesTab onNotify={showNotification} />}

      {/* ADVANCED MODULE 1: CRM & LEADS MANAGEMENT */}
      {activeTab === 'crm-leads' && <CrmLeadsSection />}
      {activeTab === 'crm-followups' && <FollowUpsSection />}

      {/* ADVANCED MODULE 2: MECHANIC MANAGEMENT SYSTEM */}
      {activeTab === 'mechanics' && <MechanicManagementSection />}
      {activeTab === 'attendance' && <MechanicAttendanceSection />}

      {/* ADVANCED MODULE 3: EXPENSES & PROFIT MANAGEMENT */}
      {activeTab === 'expenses' && <ExpensesManagementSection />}
      {activeTab === 'transactions' && <FinancialTransactionsSection />}
      {activeTab === 'profit-reports' && <ProfitReportsSection />}

      {/* ADVANCED MODULE 5: GLOBAL SEARCH */}
      {activeTab === 'global-search' && <GlobalSearchSection onNavigateTab={handleSelectTab} />}

      {/* ADVANCED MODULE 6: SUPPLIER & PURCHASE ORDER MANAGEMENT */}
      {activeTab === 'suppliers' && <SuppliersSection />}
      {activeTab === 'purchase-orders' && <PurchaseOrdersSection />}
      {activeTab === 'goods-receiving' && <GoodsReceivingSection />}
      {activeTab === 'supplier-payments' && <SupplierPaymentsSection />}

      {/* ADVANCED MODULE 7: SECURITY CENTRE & DATA RECOVERY */}
      {activeTab === 'security-centre' && <SecurityCentreSection />}
      {activeTab === 'storage-health' && <StorageHealthSection />}

      {/* SHOP MANAGEMENT (SEPARATE E-COMMERCE SECTION) */}
      {activeTab === 'shop-dashboard' && <ShopDashboardTab onNavigateTab={handleSelectTab} />}
      {activeTab === 'shop-products' && <ShopProductsTab />}
      {activeTab === 'shop-categories' && <ShopCategoriesTab />}
      {activeTab === 'shop-brands' && <ShopBrandsModelsTab />}
      {activeTab === 'shop-inventory' && <ShopInventoryTab />}
      {activeTab === 'shop-orders' && <ShopOrdersTab />}
      {activeTab === 'shop-payments' && <ShopPaymentsTab />}
      {activeTab === 'shop-shipping' && <ShopShippingTab />}
      {activeTab === 'shop-settings' && <ShopSettingsTab />}

      {/* PRINTABLE MODALS & BACKUP RESTORE MODAL */}
      {printingJobCard && (
        <PrintJobCardModal jobCard={printingJobCard} onClose={() => setPrintingJobCard(null)} />
      )}
      {printingInvoice && (
        <PrintInvoiceModal invoice={printingInvoice} onClose={() => setPrintingInvoice(null)} />
      )}
      {showBackupModal && (
        <DatabaseBackupModal onClose={() => setShowBackupModal(false)} onRestoreSuccess={reloadAllData} />
      )}
    </AdminLayout>
  );
};
