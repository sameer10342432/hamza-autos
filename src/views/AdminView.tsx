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
  logoutAdmin
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
  UserCheck
} from 'lucide-react';

import { DashboardTab } from '../components/admin/DashboardTab';
import { JobCardsTab } from '../components/admin/JobCardsTab';
import { BookingsTab } from '../components/admin/BookingsTab';
import { InvoicesTab } from '../components/admin/InvoicesTab';
import { CustomersTab } from '../components/admin/CustomersTab';
import { InventoryTab } from '../components/admin/InventoryTab';
import { StaffTab } from '../components/admin/StaffTab';
import { RemindersTab } from '../components/admin/RemindersTab';
import { PrintJobCardModal } from '../components/admin/PrintJobCardModal';
import { PrintInvoiceModal } from '../components/admin/PrintInvoiceModal';
import { DatabaseBackupModal } from '../components/admin/DatabaseBackupModal';

export type AdminTab = 
  | 'dashboard' 
  | 'jobcards' 
  | 'bookings' 
  | 'invoices' 
  | 'customers' 
  | 'inventory' 
  | 'staff' 
  | 'reminders' 
  | 'leads' 
  | 'services' 
  | 'blogs' 
  | 'gallery' 
  | 'reviews' 
  | 'faqs' 
  | 'settings';

export const AdminView: React.FC = () => {
  // Authentication State
  const [authenticated, setAuthenticated] = useState<boolean>(isAdminLoggedIn());
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [activeRoleView, setActiveRoleView] = useState<string>('Super Admin');

  // Workshop Data States
  const [jobCards, setJobCards] = useState<JobCard[]>(getStoredJobCards());
  const [bookings, setBookings] = useState<AppointmentBooking[]>(getStoredBookings());
  const [customers, setCustomers] = useState<CustomerProfile[]>(getStoredCustomers());
  const [inventory, setInventory] = useState<SparePart[]>(getStoredInventory());
  const [invoices, setInvoices] = useState<WorkshopInvoice[]>(getStoredInvoices());
  const [staff, setStaff] = useState<StaffMember[]>(getStoredStaff());
  const [reminders, setReminders] = useState<ServiceReminder[]>(getStoredReminders());
  const [movements, setMovements] = useState<StockMovement[]>([]);

  // Website Content States
  const [leads, setLeads] = useState<InquiryLead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(getStoredAnalytics());
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getStoredSettings());

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

  // Content Modals
  const [showAddLead, setShowAddLead] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerArea, setNewCustomerArea] = useState('Badami Bagh');
  const [newCustomerService, setNewCustomerService] = useState('');

  // Service Edit/Add Modal
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Blog Edit/Add Modal
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [showBlogModal, setShowBlogModal] = useState(false);

  // Gallery Add Modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState('Workshop Bay');
  const [newGalleryImage, setNewGalleryImage] = useState('/src/assets/images/workshop_front_hero_1794328983946.jpg');

  // FAQ Edit/Add Modal
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);

  // Reload all records helper
  const reloadAllData = () => {
    setJobCards(getStoredJobCards());
    setBookings(getStoredBookings());
    setCustomers(getStoredCustomers());
    setInventory(getStoredInventory());
    setInvoices(getStoredInvoices());
    setStaff(getStoredStaff());
    setReminders(getStoredReminders());
    setLeads(getStoredLeads());
    setAnalytics(getStoredAnalytics());
    setServices(getStoredServices());
    setBlogs(getStoredBlogs());
    setGallery(getStoredGallery());
    setFaqs(getStoredFAQs());
    setReviews(getModeratedReviews());
    setSettings(getStoredSettings());

    try {
      const rawM = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      if (rawM) setMovements(JSON.parse(rawM));
    } catch (e) {
      // fallback
    }
  };

  useEffect(() => {
    reloadAllData();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => {
      setSuccessNotice(null);
    }, 4000);
  };

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passwordInput)) {
      setAuthenticated(true);
      setLoginError(null);
      setPasswordInput('');
    } else {
      setLoginError('Invalid password. Default demo password is "HamzaAutos2026!"');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthenticated(false);
  };

  // ==========================================
  // WORKSHOP OPERATIONS HANDLERS
  // ==========================================

  // Job Cards CRUD
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

  // Bookings Handlers
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
      photosBefore: ['/src/assets/images/motorcycle_engine_repair_1794329002524.jpg'],
      photosAfter: []
    });
    updateBookingStatus(b.id, 'In Progress', 'Converted to Job Card');
    setJobCards(getStoredJobCards());
    setBookings(getStoredBookings());
    setActiveTab('jobcards');
    showNotification(`Booking ${b.bookingNumber} converted to active Job Card`);
  };

  // Invoices Handlers
  const handleCreateInvoice = (data: any, deductStock: boolean) => {
    const newInv = createInvoice(data);
    if (deductStock && data.partsItems) {
      data.partsItems.forEach((partItem: any) => {
        if (partItem.partId) {
          adjustStockQuantity(partItem.partId, -partItem.quantity, 'consumed', `Consumed in Invoice ${newInv.invoiceNumber}`, 'Admin');
        }
      });
      setInventory(getStoredInventory());
    }
    setInvoices(getStoredInvoices());
    setCustomers(getStoredCustomers());
    showNotification(`Invoice ${newInv.invoiceNumber} created successfully`);
  };

  const handleUpdatePayment = (id: string, amountPaid: number, status: PaymentStatus) => {
    const list = getStoredInvoices();
    const updated = list.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          amountPaid,
          remainingBalance: Math.max(0, inv.totalAmount - amountPaid),
          paymentStatus: status
        };
      }
      return inv;
    });
    saveStoredInvoices(updated);
    setInvoices(updated);
    showNotification('Payment recorded successfully');
  };

  // Customers Handlers
  const handleUpdateCustomer = (id: string, updates: Partial<CustomerProfile>) => {
    const list = getStoredCustomers();
    const updated = list.map(c => c.id === id ? { ...c, ...updates } : c);
    saveStoredCustomers(updated);
    setCustomers(updated);
    showNotification('Customer CRM profile updated');
  };

  // Inventory Handlers
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
    try {
      const rawM = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      if (rawM) setMovements(JSON.parse(rawM));
    } catch (e) {}
    showNotification('Stock quantity adjusted and audit logged');
  };

  const handleDeletePart = (id: string) => {
    if (window.confirm('Delete this part from inventory?')) {
      const updated = inventory.filter(p => p.id !== id);
      saveStoredInventory(updated);
      setInventory(updated);
      showNotification('Part removed from inventory');
    }
  };

  // Staff Handlers
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

  // Reminders Handlers
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

  // Content Handlers (Leads, Services, Blogs, Gallery, FAQs, Reviews, Settings)
  const handleStatusChange = (id: string, status: InquiryLead['status']) => {
    updateLeadStatus(id, status);
    setLeads(getStoredLeads());
    showNotification('Inquiry status updated');
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to delete this test inquiry?')) {
      deleteLead(id);
      setLeads(getStoredLeads());
      showNotification('Inquiry deleted successfully');
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerPhone) return;

    saveLead({
      customerName: newCustomerName,
      phoneNumber: newCustomerPhone,
      area: newCustomerArea,
      bikeBrand: 'Honda',
      bikeModel: 'CD 70',
      serviceRequested: newCustomerService || 'Bike Tuning',
      problemDetails: 'Direct workshop manual lead entry',
      preferredTime: 'Today'
    });

    setLeads(getStoredLeads());
    setAnalytics(getStoredAnalytics());
    setShowAddLead(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    showNotification('Customer inquiry recorded');
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Phone,Area,Brand,Model,Service,Details,Created,Status\n';
    const rows = leads.map(l => 
      `"${l.id}","${l.customerName}","${l.phoneNumber}","${l.area}","${l.bikeBrand}","${l.bikeModel}","${l.serviceRequested}","${l.problemDetails}","${l.createdAt}","${l.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hamza_autos_leads_${Date.now()}.csv`;
    a.click();
  };

  const handleSaveService = (service: ServiceItem) => {
    const existingIndex = services.findIndex(s => s.id === service.id);
    let updated: ServiceItem[];
    if (existingIndex >= 0) {
      updated = [...services];
      updated[existingIndex] = service;
    } else {
      updated = [service, ...services];
    }
    setServices(updated);
    saveStoredServices(updated);
    setShowServiceModal(false);
    setEditingService(null);
    showNotification('Service saved successfully');
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      saveStoredServices(updated);
      showNotification('Service removed');
    }
  };

  const handleRestoreDefaultServices = () => {
    if (window.confirm('Restore official default services list?')) {
      setServices(SERVICES_LIST);
      saveStoredServices(SERVICES_LIST);
      showNotification('Default services restored');
    }
  };

  const handleSaveBlog = (blog: BlogPost) => {
    const existingIndex = blogs.findIndex(b => b.id === blog.id);
    let updated: BlogPost[];
    if (existingIndex >= 0) {
      updated = [...blogs];
      updated[existingIndex] = blog;
    } else {
      updated = [blog, ...blogs];
    }
    setBlogs(updated);
    saveStoredBlogs(updated);
    setShowBlogModal(false);
    setEditingBlog(null);
    showNotification('Article saved successfully');
  };

  const handleDeleteBlog = (id: string) => {
    if (window.confirm('Delete this article?')) {
      const updated = blogs.filter(b => b.id !== id);
      setBlogs(updated);
      saveStoredBlogs(updated);
      showNotification('Article removed');
    }
  };

  const handleCreateGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle) return;

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newGalleryTitle,
      category: newGalleryCategory,
      description: 'Original photograph from Hamza Autos workshop in Badami Bagh',
      image: newGalleryImage || '/src/assets/images/workshop_front_hero_1794328983946.jpg'
    };

    const updated = [newItem, ...gallery];
    setGallery(updated);
    saveStoredGallery(updated);
    setShowGalleryModal(false);
    setNewGalleryTitle('');
    showNotification('Photograph added to gallery');
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (window.confirm('Remove this photo from workshop gallery?')) {
      const updated = gallery.filter(g => g.id !== id);
      setGallery(updated);
      saveStoredGallery(updated);
      showNotification('Photograph removed');
    }
  };

  const handleSaveFaq = (faq: FAQItem) => {
    const existingIndex = faqs.findIndex(f => f.id === faq.id);
    let updated: FAQItem[];
    if (existingIndex >= 0) {
      updated = [...faqs];
      updated[existingIndex] = faq;
    } else {
      updated = [faq, ...faqs];
    }
    setFaqs(updated);
    saveStoredFAQs(updated);
    setShowFaqModal(false);
    setEditingFaq(null);
    showNotification('FAQ saved');
  };

  const handleDeleteFaq = (id: string) => {
    if (window.confirm('Delete this FAQ?')) {
      const updated = faqs.filter(f => f.id !== id);
      setFaqs(updated);
      saveStoredFAQs(updated);
      showNotification('FAQ removed');
    }
  };

  const handleToggleReviewVerified = (id: string) => {
    const updated = reviews.map(r => r.id === id ? { ...r, isVerifiedCustomer: !r.isVerifiedCustomer } : r);
    setReviews(updated);
    saveModeratedReviews(updated);
    showNotification('Customer verification toggled');
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Remove this review?')) {
      const updated = reviews.filter(r => r.id !== id);
      setReviews(updated);
      saveModeratedReviews(updated);
      showNotification('Review deleted');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settings);
    showNotification('Workshop business settings and SEO synchronized');
  };

  // LOGIN GATE
  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">Hamza Autos Operations Portal</h1>
            <p className="text-xs text-slate-500 mt-1">
              Protected workshop management area for Abu Bakar Road, Badami Bagh
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs text-left">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Sign In to Workshop Operations
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
            Testing credentials: <strong className="text-slate-700">HamzaAutos2026!</strong>
          </div>
        </div>
      </div>
    );
  }

  // Active Job count for tab badges
  const activeJobsCount = jobCards.filter(j => !['Delivered', 'Completed'].includes(j.repairStatus)).length;
  const pendingBookingsCount = bookings.filter(b => ['New Request', 'Pending Confirmation'].includes(b.status)).length;
  const lowStockCount = inventory.filter(p => p.stockQuantity <= p.minStockAlert).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar with Logout & Global Tools */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Hamza Autos Enterprise Workshop Management
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
              {activeRoleView}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Workshop Operations &amp; Business Suite
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Abu Bakar Road, Badami Bagh, Lahore · Appointments, Job Cards, Inventory, Invoices &amp; Local SEO
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBackupModal(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Database className="w-4 h-4 text-slate-500" />
            Backup &amp; Restore
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Floating Success Notice */}
      {successNotice && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-md animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Primary Workshop Tabs Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'dashboard' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab('jobcards')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'jobcards' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Job Cards ({jobCards.length})
          {activeJobsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'bookings' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Appointments ({bookings.length})
          {pendingBookingsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] rounded-full font-bold">
              {pendingBookingsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'invoices' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Invoices &amp; Billing ({invoices.length})
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'customers' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Customers CRM ({customers.length})
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'inventory' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          Spare Parts ({inventory.length})
          {lowStockCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-full font-bold">
              {lowStockCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'staff' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Staff ({staff.length})
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reminders' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          Reminders ({reminders.length})
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'leads' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Inbound Leads ({leads.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'services' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Services ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'blogs' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Articles ({blogs.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reviews' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Reviews ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'settings' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          SEO &amp; Settings
        </button>
      </div>

      {/* TAB 1: OPERATIONS DASHBOARD */}
      {activeTab === 'dashboard' && (
        <DashboardTab
          jobCards={jobCards}
          bookings={bookings}
          customers={customers}
          inventory={inventory}
          invoices={invoices}
          analytics={analytics}
          onNavigateTab={setActiveTab}
          onOpenNewJobCard={() => setActiveTab('jobcards')}
          onOpenNewBooking={() => setActiveTab('bookings')}
          onOpenNewInvoice={() => setActiveTab('invoices')}
          onPrintJobCard={setPrintingJobCard}
        />
      )}

      {/* TAB 2: DIGITAL JOB CARDS */}
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

      {/* TAB 3: APPOINTMENT BOOKINGS */}
      {activeTab === 'bookings' && (
        <BookingsTab
          bookings={bookings}
          onUpdateStatus={handleUpdateBookingStatus}
          onReschedule={handleRescheduleBooking}
          onCreateBooking={handleCreateBooking}
          onConvertToJobCard={handleConvertBookingToJob}
        />
      )}

      {/* TAB 4: INVOICES & BILLING */}
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

      {/* TAB 5: CUSTOMER CRM */}
      {activeTab === 'customers' && (
        <CustomersTab
          customers={customers}
          jobCards={jobCards}
          invoices={invoices}
          bookings={bookings}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}

      {/* TAB 6: SPARE PARTS INVENTORY */}
      {activeTab === 'inventory' && (
        <InventoryTab
          inventory={inventory}
          movements={movements}
          onSavePart={handleSavePart}
          onAdjustStock={handleAdjustStock}
          onDeletePart={handleDeletePart}
        />
      )}

      {/* TAB 7: STAFF & MECHANICS */}
      {activeTab === 'staff' && (
        <StaffTab
          staff={staff}
          jobCards={jobCards}
          onSaveStaff={handleSaveStaff}
          onDeleteStaff={handleDeleteStaff}
          activeRoleView={activeRoleView}
          onSelectRoleView={setActiveRoleView}
        />
      )}

      {/* TAB 8: SERVICE REMINDERS */}
      {activeTab === 'reminders' && (
        <RemindersTab
          reminders={reminders}
          onSaveReminder={handleSaveReminder}
          onUpdateStatus={handleUpdateReminderStatus}
          onDeleteReminder={handleDeleteReminder}
        />
      )}

      {/* TAB 9: INBOUND CONTACT LEADS */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Inbound Customer Inquiries</h2>
              <p className="text-xs text-slate-500">Track and respond to incoming web inquiries</p>
            </div>
            <button
              onClick={() => setShowAddLead(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
            >
              + Add Inquiry
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Customer Name</th>
                  <th className="py-3 px-4 font-bold">Phone Number</th>
                  <th className="py-3 px-4 font-bold">Area</th>
                  <th className="py-3 px-4 font-bold">Bike &amp; Service</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {lead.customerName}
                      <span className="block text-[10px] text-slate-400 font-normal">{lead.createdAt}</span>
                    </td>
                    <td className="py-3 px-4">
                      <a href={`tel:${lead.phoneNumber}`} className="text-red-600 font-semibold hover:underline">
                        {lead.phoneNumber}
                      </a>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">{lead.area}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{lead.serviceRequested}</span>
                      <span className="text-[11px] text-slate-500">{lead.bikeBrand} {lead.bikeModel}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        lead.status === 'new' ? 'bg-amber-100 text-amber-800' :
                        lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as InquiryLead['status'])}
                          className="py-1 px-2 rounded-lg border border-slate-300 text-[11px] bg-white cursor-pointer"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 10: SERVICES MANAGEMENT */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Manage Repair Services</h2>
              <p className="text-xs text-slate-500">Edit existing services, add new offerings, or restore defaults</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRestoreDefaultServices}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
              >
                Restore Defaults
              </button>
              <button
                onClick={() => {
                  setEditingService({
                    id: `srv-${Date.now()}`,
                    slug: `new-service-${Date.now()}`,
                    title: '',
                    category: 'General Maintenance',
                    shortDescription: '',
                    fullDescription: '',
                    keyFeatures: ['Comprehensive inspection', 'Genuine replacement parts'],
                    commonSymptoms: ['Unusual noise or reduced pickup'],
                    processSteps: ['1. Initial inspection', '2. Precision repair', '3. Road testing'],
                    supportedBikes: ['Honda', 'Yamaha', 'Suzuki', 'United', 'Chinese Bikes'],
                    estimatedTime: '1 to 2 Hours',
                    image: '/src/assets/images/motorcycle_engine_repair_1794329002524.jpg'
                  });
                  setShowServiceModal(true);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Service
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc) => (
              <div key={svc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-red-600">{svc.category}</span>
                    <span className="text-slate-500">{svc.estimatedTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{svc.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{svc.shortDescription}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setEditingService(svc);
                      setShowServiceModal(true);
                    }}
                    className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(svc.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 11: BLOG ARTICLES */}
      {activeTab === 'blogs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Manage Maintenance Articles</h2>
              <p className="text-xs text-slate-500">Publish guides, tuning tips, and local riding advice</p>
            </div>
            <button
              onClick={() => {
                setEditingBlog({
                  id: `post-${Date.now()}`,
                  slug: `post-${Date.now()}`,
                  title: '',
                  excerpt: '',
                  content: '',
                  category: 'Maintenance',
                  author: 'Hamza Autos Technical Team',
                  publishedDate: new Date().toISOString().split('T')[0],
                  readTime: '4 min read',
                  image: '/src/assets/images/workshop_front_hero_1794328983946.jpg',
                  faqs: [],
                  tags: ['Motorcycle Maintenance', 'Badami Bagh']
                });
                setShowBlogModal(true);
              }}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Article
            </button>
          </div>

          <div className="space-y-3">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-red-600">{blog.category}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{blog.publishedDate}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{blog.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{blog.excerpt}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingBlog(blog);
                      setShowBlogModal(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-red-600 bg-white rounded-lg border border-slate-200 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 bg-white rounded-lg border border-slate-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 12: CUSTOMER REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Customer Reviews Moderation</h2>
              <p className="text-xs text-slate-500">Approve authentic reviews and share your Google Business Profile review link</p>
            </div>
            <a
              href="https://maps.google.com/?cid=hamza-autos-badami-bagh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Star className="w-4 h-4" /> Google Review Page Link
            </a>
          </div>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rev.authorName}</span>
                    <span className="text-xs text-slate-500">({rev.area} · {rev.bikeModel})</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rev.isVerifiedCustomer ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                      {rev.isVerifiedCustomer ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                  <span className="text-[10px] text-slate-400">Service: {rev.serviceReceived} · {rev.date}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleReviewVerified(rev.id)}
                    className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
                  >
                    {rev.isVerifiedCustomer ? 'Mark Unverified' : 'Mark Verified'}
                  </button>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 13: SETTINGS & LOCAL SEO */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Workshop Information &amp; Technical SEO Settings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official NAP (Name, Address, Phone) data synchronizes across all public pages, schema markup, and meta tags.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={settings.operatingHours}
                  onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Business Address</label>
              <textarea
                rows={2}
                value={settings.fullAddress}
                onChange={(e) => setSettings({ ...settings, fullAddress: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Local SEO Meta Tags</h3>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Global SEO Title</label>
                <input
                  type="text"
                  value={settings.seoTitle}
                  onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={settings.seoMetaDescription}
                  onChange={(e) => setSettings({ ...settings, seoMetaDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Settings &amp; Sync SEO
            </button>
          </form>
        </div>
      )}

      {/* PRINTABLE MODAL: A4 JOB CARD */}
      {printingJobCard && (
        <PrintJobCardModal
          jobCard={printingJobCard}
          onClose={() => setPrintingJobCard(null)}
        />
      )}

      {/* PRINTABLE MODAL: A4 INVOICE */}
      {printingInvoice && (
        <PrintInvoiceModal
          invoice={printingInvoice}
          onClose={() => setPrintingInvoice(null)}
        />
      )}

      {/* DATABASE BACKUP & RESTORE MODAL */}
      <DatabaseBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onBackupRestored={reloadAllData}
      />

      {/* MODAL: ADD MANUAL INQUIRY */}
      {showAddLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Customer Walk-In / Phone Lead</h3>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="e.g. Kamran Malik"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="e.g. 0321 4455667"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Area in Lahore</label>
                <input
                  type="text"
                  value={newCustomerArea}
                  onChange={(e) => setNewCustomerArea(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Needed</label>
                <select
                  value={newCustomerService}
                  onChange={(e) => setNewCustomerService(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden cursor-pointer"
                >
                  <option value="Bike Tuning">Bike Tuning &amp; Fuel Economy</option>
                  <option value="Engine Overhaul">Engine Overhaul / Smoke Fix</option>
                  <option value="Brake Repair">Brake Shoe / Disc Repair</option>
                  <option value="Electrical Repair">Electrical Wiring / Battery</option>
                  <option value="Chain Sprocket">Chain Sprocket Replacement</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer">
                  Save Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLead(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/ADD SERVICE */}
      {showServiceModal && editingService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingService.title ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveService(editingService); }} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Time</label>
                  <input
                    type="text"
                    value={editingService.estimatedTime}
                    onChange={(e) => setEditingService({ ...editingService, estimatedTime: e.target.value })}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingService.shortDescription}
                  onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Technical Description</label>
                <textarea
                  rows={4}
                  value={editingService.fullDescription}
                  onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer">
                  Save Service
                </button>
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT/ADD BLOG */}
      {showBlogModal && editingBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingBlog.title ? 'Edit Article' : 'Write New Article'}
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveBlog(editingBlog); }} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={editingBlog.readTime}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Article Body</label>
                <textarea
                  rows={6}
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer">
                  Save Article
                </button>
                <button
                  type="button"
                  onClick={() => setShowBlogModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
