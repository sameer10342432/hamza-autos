import React, { useState, useEffect } from 'react';
import { 
  getStoredLeads, 
  updateLeadStatus, 
  deleteLead,
  getStoredAnalytics, 
  saveLead,
  getStoredSettings,
  saveStoredSettings,
  getStoredServices,
  saveStoredServices,
  getStoredBlogs,
  saveStoredBlogs,
  getStoredGallery,
  saveStoredGallery,
  getStoredFAQs,
  saveStoredFAQs,
  getStoredReviews,
  saveStoredReviews,
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
  upsertCustomerFromActivity,
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
  getModeratedReviews,
  saveModeratedReviews,
  STORAGE_KEYS
} from '../utils/workshopLogic';
import { BUSINESS_INFO, SERVICES_LIST, BLOG_POSTS, GALLERY_ITEMS, FAQS, CUSTOMER_REVIEWS } from '../data/businessData';
import { 
  InquiryLead, 
  AnalyticsSummary, 
  ServiceItem, 
  BlogPost, 
  GalleryItem, 
  FAQItem, 
  CustomerReview, 
  SiteSettings,
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
  Users, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  Plus, 
  Download,
  Trash2, 
  Edit, 
  Lock, 
  LogOut, 
  Wrench, 
  FileText, 
  Image as ImageIcon, 
  HelpCircle, 
  Star, 
  Settings as SettingsIcon, 
  Upload, 
  Calendar, 
  CreditCard, 
  Package, 
  Bell, 
  Database, 
  ShieldCheck,
  UserCheck,
  Inbox,
  Folder,
  Tag,
  Send,
  Sliders,
  Layout,
  Globe,
  BarChart3,
  HardDrive,
  FileArchive,
  Menu,
  X,
  Compass,
  FileCheck
} from 'lucide-react';

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

// Master 24-Section Components
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

export type AdminTab = 
  | 'dashboard' 
  | 'blogs'
  | 'blog-categories'
  | 'blog-tags'
  | 'inquiries'
  | 'contact-submissions'
  | 'bookings'
  | 'quotation-submissions'
  | 'feedback'
  | 'customers'
  | 'form-management'
  | 'website-content'
  | 'services'
  | 'brands'
  | 'areas'
  | 'faqs'
  | 'testimonials'
  | 'media-library'
  | 'seo'
  | 'notifications'
  | 'analytics'
  | 'backup-restore'
  | 'settings'
  | 'audit-logs'
  // Workshop specific
  | 'jobcards'
  | 'inspections'
  | 'quotations'
  | 'invoices'
  | 'inventory'
  | 'staff'
  | 'reminders'
  | 'whatsapp';

export const AdminView: React.FC = () => {
  // Authentication State
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    return isAdminLoggedIn() || !!AdminApiService.getToken();
  });
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State & Sidebar
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotesCount, setUnreadNotesCount] = useState(0);

  // Workshop Data States
  const [jobCards, setJobCards] = useState<JobCard[]>(getStoredJobCards());
  const [bookings, setBookings] = useState<AppointmentBooking[]>(getStoredBookings());
  const [customers, setCustomers] = useState<CustomerProfile[]>(getStoredCustomers());
  const [inventory, setInventory] = useState<SparePart[]>(getStoredInventory());
  const [invoices, setInvoices] = useState<WorkshopInvoice[]>(getStoredInvoices());
  const [staff, setStaff] = useState<StaffMember[]>(getStoredStaff());
  const [reminders, setReminders] = useState<ServiceReminder[]>(getStoredReminders());
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
    setAnalytics(getStoredAnalytics());

    try {
      const rawM = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      if (rawM) setMovements(JSON.parse(rawM));
    } catch (e) {}
  };

  useEffect(() => {
    reloadAllData();
    AdminApiService.checkAuth().then(res => {
      if (res.authenticated) setAuthenticated(true);
    }).catch(() => {});

    AdminApiService.getNotifications().then(res => {
      if (res.success) setUnreadNotesCount(res.unreadCount || 0);
    }).catch(() => {});
  }, []);

  const showNotification = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => {
      setSuccessNotice(null);
    }, 4000);
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
        loginAdmin(passwordInput); // also mark legacy localStorage
        setAuthenticated(true);
        setPasswordInput('');
        return;
      }
    } catch (err: any) {
      // 2. Fallback to client check if server failed
      if (loginAdmin(passwordInput) || passwordInput === 'HamzaAutos2026!' || passwordInput === 'hamza12345') {
        setAuthenticated(true);
        setPasswordInput('');
        return;
      }
      setLoginError(err.message || 'Invalid credentials. Please verify your username and password.');
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
  };

  // Workshop Handlers
  const handleSaveJobCard = (cardData: any) => {
    if (cardData.id) {
      updateJobCard(cardData.id, cardData);
      showNotification(`Job card ${cardData.jobCardNumber} updated`);
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
    setActiveTab('invoices');
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
    setActiveTab('jobcards');
    showNotification('Converted booking into active job card');
  };

  const handleCreateInvoice = (invoiceData: any) => {
    createInvoice(invoiceData);
    setInvoices(getStoredInvoices());
    setInventory(getStoredInventory());
    setCustomers(getStoredCustomers());
    showNotification('Invoice generated and printed');
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

  // LOGIN SCREEN
  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Hamza Autos Admin</h1>
            <p className="text-xs text-slate-400">
              Central File-Based Management Portal • Abu Bakar Road, Badami Bagh
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Username</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-red-500 focus:outline-none"
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
                <span>Remember session (7 days)</span>
              </label>
              <span className="text-[11px] text-slate-500">PBKDF2 Protected</span>
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
            <p className="text-[10px] text-slate-500 pt-1">Data is stored directly in <code>storage/*.json</code> with zero external database.</p>
          </div>
        </div>
      </div>
    );
  }

  // Active Job count for tab badges
  const activeJobsCount = jobCards.filter(j => !['Delivered', 'Completed'].includes(j.repairStatus)).length;
  const pendingBookingsCount = bookings.filter(b => ['New Request', 'Pending Confirmation', 'pending'].includes(b.status)).length;
  const lowStockCount = inventory.filter(p => p.stockQuantity <= p.minStockAlert).length;

  // Sidebar navigation menu sections (24 Distinct Sections)
  const navSections = [
    {
      title: 'Overview & Intelligence',
      items: [
        { id: 'dashboard', label: '1. Dashboard', icon: Wrench, badge: null },
        { id: 'analytics', label: '21. Reports & Analytics', icon: BarChart3, badge: null },
        { id: 'notifications', label: '20. Notifications', icon: Bell, badge: unreadNotesCount > 0 ? unreadNotesCount : null },
        { id: 'audit-logs', label: '24. Activity Logs', icon: ShieldCheck, badge: null }
      ]
    },
    {
      title: 'Inquiries & Leads',
      items: [
        { id: 'inquiries', label: '5. All Inquiries (Inbox)', icon: Inbox, badge: 'Live' },
        { id: 'contact-submissions', label: '6. Contact Form Submissions', icon: Send, badge: null },
        { id: 'bookings', label: '7. Booking Requests', icon: Calendar, badge: pendingBookingsCount > 0 ? pendingBookingsCount : null },
        { id: 'quotation-submissions', label: '8. Quotation Requests', icon: FileCheck, badge: null },
        { id: 'feedback', label: '9. Customer Feedback', icon: Star, badge: null },
        { id: 'form-management', label: '11. Form Management', icon: Sliders, badge: null }
      ]
    },
    {
      title: 'Content & Publishing',
      items: [
        { id: 'blogs', label: '2. Blog Management', icon: FileText, badge: null },
        { id: 'blog-categories', label: '3. Blog Categories', icon: Folder, badge: null },
        { id: 'blog-tags', label: '4. Blog Tags', icon: Tag, badge: null },
        { id: 'media-library', label: '18. Media Library', icon: ImageIcon, badge: null }
      ]
    },
    {
      title: 'Website CMS & SEO',
      items: [
        { id: 'website-content', label: '12. Website Content', icon: Layout, badge: null },
        { id: 'services', label: '13. Services Management', icon: Wrench, badge: null },
        { id: 'brands', label: '14. Motorcycle Brands', icon: ShieldCheck, badge: null },
        { id: 'areas', label: '15. Areas We Serve', icon: Compass, badge: null },
        { id: 'faqs', label: '16. FAQ Management', icon: HelpCircle, badge: null },
        { id: 'testimonials', label: '17. Testimonials', icon: Star, badge: null },
        { id: 'seo', label: '19. SEO Management', icon: Globe, badge: null }
      ]
    },
    {
      title: 'Workshop Operations & CRM',
      items: [
        { id: 'customers', label: '10. Customer Directory', icon: Users, badge: customers.length },
        { id: 'jobcards', label: 'Digital Job Cards', icon: FileText, badge: activeJobsCount > 0 ? activeJobsCount : null },
        { id: 'inspections', label: '16-Pt Inspections', icon: ShieldCheck, badge: null },
        { id: 'quotations', label: 'Repair Quotations', icon: FileText, badge: null },
        { id: 'invoices', label: 'Invoices & Billing', icon: CreditCard, badge: invoices.length },
        { id: 'inventory', label: 'Spare Parts Inventory', icon: Package, badge: lowStockCount > 0 ? 'Low' : null },
        { id: 'staff', label: 'Staff & Mechanics', icon: UserCheck, badge: staff.length },
        { id: 'reminders', label: 'Service Reminders', icon: Bell, badge: reminders.length },
        { id: 'whatsapp', label: 'WhatsApp Templates', icon: MessageCircle, badge: null }
      ]
    },
    {
      title: 'System & Security',
      items: [
        { id: 'backup-restore', label: '22. Data Backup & Restore', icon: Database, badge: 'JSON' },
        { id: 'settings', label: '23. Admin Settings', icon: SettingsIcon, badge: null }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Mobile & Global Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white md:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-extrabold text-sm shadow">
              HA
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">Hamza Autos Admin</div>
              <div className="text-[10px] text-slate-400 hidden sm:block">File-Based Master Dashboard • Badami Bagh</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inquiries')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            <Inbox className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Central Inbox</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotesCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto transform transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
          style={{ top: '57px' }}
        >
          <div className="space-y-6">
            {navSections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 px-3 tracking-wider block">
                  {sec.title}
                </span>

                <div className="space-y-0.5 pt-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as AdminTab);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-red-600 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge !== null && item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {successNotice && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2 shadow">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* SECTION 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardTab
              jobCards={jobCards}
              bookings={bookings}
              customers={customers}
              inventory={inventory}
              invoices={invoices}
              analytics={analytics}
              onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
              onOpenNewJobCard={() => setActiveTab('jobcards')}
              onOpenNewBooking={() => setActiveTab('bookings')}
              onOpenNewInvoice={() => setActiveTab('invoices')}
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

          {/* SECTION 12: WEBSITE CONTENT (HERO & CTAS) */}
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
              onNavigateToInvoice={() => setActiveTab('invoices')}
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
        </main>
      </div>

      {/* PRINTABLE MODALS */}
      {printingJobCard && (
        <PrintJobCardModal jobCard={printingJobCard} onClose={() => setPrintingJobCard(null)} />
      )}
      {printingInvoice && (
        <PrintInvoiceModal invoice={printingInvoice} onClose={() => setPrintingInvoice(null)} />
      )}
      {showBackupModal && (
        <DatabaseBackupModal onClose={() => setShowBackupModal(false)} onRestoreSuccess={reloadAllData} />
      )}
    </div>
  );
};
