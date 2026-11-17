export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  keyFeatures: string[];
  commonSymptoms: string[];
  processSteps: string[];
  supportedBikes: string[];
  estimatedTime: string;
  image: string;
  imageAlt?: string;
}

export interface BrandItem {
  id: string;
  slug: string;
  name: string;
  popularModels: string[];
  overview: string;
  commonServices: string[];
  maintenanceTips: string[];
  image?: string;
  imageAlt?: string;
}

export interface AreaItem {
  id: string;
  slug: string;
  name: string;
  distanceFromBadamiBagh: string;
  estimatedDriveTime: string;
  bestRouteDescription: string;
  localIntro: string;
  commuterContext: string;
  landmarks: string[];
  image?: string;
  imageAlt?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  publishedDate: string;
  readTime: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  faqs: { question: string; answer: string }[];
  tags: string[];
  status?: 'published' | 'draft';
  image?: string;
  imageAlt?: string;
  seoTitle?: string;
  metaDescription?: string;
}

export interface CustomerReview {
  id: string;
  authorName: string;
  area: string;
  bikeModel: string;
  rating: number;
  date: string;
  serviceReceived: string;
  comment: string;
  isVerifiedCustomer: boolean;
  status?: 'approved' | 'pending' | 'rejected';
  source?: 'Website Submission' | 'Google Business Profile';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  imageAlt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface InquiryLead {
  id: string;
  customerName: string;
  phoneNumber: string;
  area: string;
  bikeBrand: string;
  bikeModel: string;
  serviceRequested: string;
  problemDetails: string;
  preferredTime: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
}

export interface AnalyticsSummary {
  whatsappClicks: number;
  phoneCallClicks: number;
  mapDirectionsClicks: number;
  enquiriesSubmitted: number;
  totalPageViews: number;
}

export interface SiteSettings {
  businessName: string;
  phone: string;
  phoneRaw?: string;
  whatsappNumber: string;
  operatingHours: string;
  operatingDays: string;
  fullAddress: string;
  seoTitle: string;
  seoMetaDescription: string;
  slotCapacityPerHour?: number;
  autoApproveBookings?: boolean;
  googleReviewUrl?: string;
}

// ==========================================
// ADVANCED WORKSHOP MANAGEMENT SYSTEM TYPES
// ==========================================

export type BookingStatus = 
  | 'New Request' 
  | 'Pending Confirmation' 
  | 'Confirmed' 
  | 'In Progress' 
  | 'Completed' 
  | 'Cancelled';

export interface AppointmentBooking {
  id: string;
  bookingNumber: string;
  customerName: string;
  phoneNumber: string;
  area?: string;
  bikeBrand: string;
  bikeModel: string;
  registrationNumber?: string;
  serviceRequested: string;
  problemDescription: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // e.g. "10:00 AM"
  status: BookingStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type RepairStatus = 
  | 'Received' 
  | 'Diagnosis' 
  | 'Parts Waiting' 
  | 'Work In Progress' 
  | 'Testing & Quality Check' 
  | 'Ready for Delivery' 
  | 'Delivered';

export interface JobCard {
  id: string;
  jobCardNumber: string; // e.g. "HA-JC-2026-001"
  customerName: string;
  phoneNumber: string;
  bikeBrand: string;
  bikeModel: string;
  registrationNumber?: string;
  customerComplaint: string;
  initialInspectionNotes: string;
  requiredServices: string[];
  estimatedCost: number;
  finalCost: number;
  assignedMechanicId?: string;
  assignedMechanicName?: string;
  createdDate: string;
  expectedCompletionDate: string;
  completionDate?: string;
  repairStatus: RepairStatus;
  photosBefore: string[];
  photosAfter: string[];
  internalNotes?: string;
  invoiceId?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phoneNumber: string;
  alternatePhone?: string;
  area: string;
  bikeBrand: string;
  bikeModel: string;
  registrationNumber?: string;
  registeredDate: string;
  notes?: string;
  optInReminders: boolean;
  totalSpent?: number;
  totalVisits?: number;
}

export interface SparePart {
  id: string;
  partNumber: string;
  partName: string;
  category: string;
  compatibleBrands: string[];
  compatibleModels: string[];
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockAlert: number;
  image?: string;
  lastRestocked?: string;
}

export interface StockMovement {
  id: string;
  partId: string;
  partName: string;
  type: 'restock' | 'consumed' | 'adjustment';
  quantity: number;
  reason: string;
  date: string;
  recordedBy: string;
}

export type PaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid';
export type PaymentMethod = 'Cash' | 'Bank Transfer / EasyPaisa / JazzCash' | 'Credit';

export interface InvoiceLabourItem {
  id: string;
  description: string;
  amount: number;
}

export interface InvoicePartItem {
  id: string;
  partId?: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface WorkshopInvoice {
  id: string;
  invoiceNumber: string; // e.g. "HA-INV-2026-001"
  jobCardNumber?: string;
  invoiceDate: string;
  customerName: string;
  phoneNumber: string;
  bikeBrand: string;
  bikeModel: string;
  registrationNumber?: string;
  labourItems: InvoiceLabourItem[];
  partsItems: InvoicePartItem[];
  additionalCharges: number;
  additionalChargesDescription?: string;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  remainingBalance: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface ServiceReminder {
  id: string;
  customerName: string;
  phoneNumber: string;
  bikeBrand: string;
  bikeModel: string;
  serviceType: string;
  lastServiceDate: string;
  nextDueDate: string;
  status: 'Pending' | 'Sent' | 'Dismissed';
  notes?: string;
}

export type StaffRole = 'Super Admin' | 'Workshop Manager' | 'Mechanic';

export interface StaffMember {
  id: string;
  name: string;
  phoneNumber: string;
  role: StaffRole;
  specialties: string[];
  status: 'Active' | 'On Leave' | 'Inactive';
  joinedDate: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'Service' | 'Brand' | 'Article' | 'Area' | 'FAQ' | 'Part';
  snippet: string;
  view: string;
  slug?: string;
}

// ==========================================
// 16 INDEXEDDB OBJECT STORE INTERFACES
// ==========================================

export interface MotorcycleProfile {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  brand: string;
  model: string;
  registrationNumber: string;
  engineCapacity?: string;
  mileage?: number;
  chassisNumber?: string;
  color?: string;
  year?: string;
  createdAt: string;
  updatedAt: string;
}

export type InspectionComponentStatus = 
  | 'Good' 
  | 'Needs Attention' 
  | 'Requires Repair' 
  | 'Not Inspected' 
  | 'Not Applicable';

export interface InspectionItem {
  category?: string;
  componentName?: string;
  status: InspectionComponentStatus;
  notes: string;
  recommendation?: string;
}

export interface BikeInspectionReport {
  id: string;
  inspectionNumber: string;
  jobCardId?: string;
  jobCardNumber?: string;
  motorcycleId?: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  bikeBrand: string;
  bikeModel: string;
  registrationNumber?: string;
  mileage?: number;
  inspectorName: string;
  inspectionDate: string;
  overallCondition: 'Excellent' | 'Good' | 'Fair' | 'Critical / Needs Immediate Attention';
  items: InspectionItem[];
  mechanicObservations: string;
  recommendedRepairs: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Immediate Safety Risk';
  createdAt: string;
}

export type QuotationStatus = 
  | 'Draft' 
  | 'Sent' 
  | 'Viewed' 
  | 'Approved' 
  | 'Rejected' 
  | 'Expired' 
  | 'Converted to Invoice';

export interface Quotation {
  id: string;
  quotationNumber: string;
  jobCardId?: string;
  jobCardNumber?: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  bikeBrand: string;
  bikeModel: string;
  registrationNumber?: string;
  labourItems: InvoiceLabourItem[];
  partsItems: InvoicePartItem[];
  labourTotal: number;
  partsTotal: number;
  discount: number;
  additionalCharges: number;
  additionalChargesDescription?: string;
  taxPercentage: number;
  taxAmount: number;
  totalAmount: number;
  status: QuotationStatus;
  validUntil: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  method: 'Cash' | 'Bank Transfer' | 'Easypaisa' | 'JazzCash' | 'Other';
  transactionReference?: string;
  receivedBy: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryMovementRecord {
  id: string;
  partId: string;
  partName: string;
  sku: string;
  type: 'purchase' | 'consumed_job' | 'consumed_invoice' | 'adjustment' | 'damaged' | 'reversal';
  quantity: number;
  previousStock: number;
  newStock: number;
  unitCost: number;
  referenceType?: 'jobCard' | 'invoice' | 'manual' | 'purchase';
  referenceId?: string;
  reason: string;
  date: string;
  recordedBy: string;
}

export interface MaintenanceReminderRecord {
  id: string;
  motorcycleId?: string;
  customerId?: string;
  customerName: string;
  phoneNumber: string;
  bikeBrand: string;
  bikeModel: string;
  registrationNumber?: string;
  reminderType: 
    | 'Engine Oil Change' 
    | 'General Service' 
    | 'Brake Inspection' 
    | 'Tyre Inspection' 
    | 'Chain Lubrication' 
    | 'Chain Adjustment' 
    | 'Battery Inspection' 
    | 'Air Filter Cleaning' 
    | 'Spark Plug Inspection' 
    | 'Other';
  lastServiceDate: string;
  lastMileage?: number;
  nextDueDate: string;
  nextDueMileage?: number;
  reminderNotes: string;
  status: 'Upcoming' | 'Due Today' | 'Overdue' | 'Completed' | 'Cancelled';
  sentViaWhatsApp?: boolean;
  lastNotificationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFeedbackRecord {
  id: string;
  customerName: string;
  phoneNumber?: string;
  bookingOrJobCardRef?: string;
  overallRating: number;
  serviceQualityRating: number;
  staffBehaviourRating: number;
  workQualityRating: number;
  comment: string;
  photoUrl?: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Hidden';
  isFeatured: boolean;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'low_stock' | 'overdue_reminder' | 'new_booking' | 'job_status' | 'backup_reminder' | 'system';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  key: 'new_booking' | 'booking_confirmation' | 'repair_status' | 'quotation' | 'invoice' | 'ready_for_collection' | 'maintenance_reminder';
  name: string;
  template: string;
  description: string;
  updatedAt: string;
}

export interface ApplicationSettingRecord {
  id: 'main_settings';
  businessName: string;
  phone: string;
  phoneRaw: string;
  whatsappNumber: string;
  operatingHours: string;
  operatingDays: string;
  fullAddress: string;
  taxPercentage: number;
  slotCapacityPerHour: number;
  autoBackupReminderDays: number;
  lastBackupDate?: string;
  lastRestoreDate?: string;
  currency: 'PKR';
  customerPortalPinRequired: boolean;
  seoTitle: string;
  seoMetaDescription: string;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
  user: string;
}

// ==========================================
// 7 ADVANCED BUSINESS MANAGEMENT MODULES TYPES
// ==========================================

// 1. ADVANCED CRM & LEAD MANAGEMENT TYPES
export type LeadPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type LeadStage = 
  | 'New Lead'
  | 'Contacted'
  | 'Interested'
  | 'Qualified'
  | 'Booking Requested'
  | 'Booking Confirmed'
  | 'Converted to Customer'
  | 'Lost'
  | 'Archived';

export interface LeadRecord {
  id: string;
  customerName: string;
  phoneNumber: string;
  whatsAppNumber?: string;
  email?: string;
  address?: string;
  bikeBrand: string;
  bikeModel: string;
  registrationNumber?: string;
  interestedService: string;
  customerMessage?: string;
  leadSource: 'Contact Form' | 'Booking Request' | 'Quotation Request' | 'Service Enquiry' | 'Direct Call' | 'Manual' | 'Other';
  sourcePage?: string;
  leadCreationDate: string;
  assignedAdmin?: string;
  priority: LeadPriority;
  status: LeadStage;
  estimatedValue?: number;
  internalNotes?: string;
  nextFollowUpDate?: string;
  convertedCustomerId?: string;
  convertedBookingId?: string;
  convertedAt?: string;
  convertedBy?: string;
  updatedAt?: string;
}

export type FollowUpStatus = 'Pending' | 'Completed' | 'Rescheduled' | 'Missed' | 'Cancelled';
export type FollowUpMethod = 'Call' | 'WhatsApp' | 'Email' | 'In-Person';

export interface FollowUpRecord {
  id: string;
  leadId: string;
  customerName: string;
  phoneNumber: string;
  followUpDate: string; // YYYY-MM-DD
  followUpTime?: string; // HH:mm or AM/PM
  followUpMethod: FollowUpMethod;
  followUpNotes: string;
  assignedAdmin: string;
  status: FollowUpStatus;
  completedAt?: string;
  completionNotes?: string;
  rescheduledTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export type InteractionType = 
  | 'Inquiry Received'
  | 'Booking Created'
  | 'Call Recorded'
  | 'WhatsApp Contact Recorded'
  | 'Follow-up Scheduled'
  | 'Follow-up Completed'
  | 'Quotation Created'
  | 'Booking Confirmed'
  | 'Job Card Created'
  | 'Repair Completed';

export interface CustomerInteraction {
  id: string;
  leadId?: string;
  customerId?: string;
  customerName: string;
  type: InteractionType;
  details: string;
  timestamp: string;
  adminName: string;
  channel?: 'Phone' | 'WhatsApp' | 'Website' | 'In-Person';
  metadata?: Record<string, any>;
}

// 2. MECHANIC MANAGEMENT TYPES
export type MechanicStatus = 'Active' | 'Inactive' | 'On Leave' | 'Archived';

export interface MechanicProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  whatsAppNumber?: string;
  email?: string;
  profilePhoto?: string;
  address?: string;
  joiningDate: string;
  specializations: string[];
  skills: string[];
  employmentStatus: MechanicStatus;
  internalNotes?: string;
  assignedBays?: string[];
  activeJobsCount?: number;
  completedJobsCount?: number;
  hourlyRate?: number;
  createdAt: string;
  updatedAt?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'Leave' | 'Holiday';

export interface MechanicAttendance {
  id: string;
  mechanicId: string;
  mechanicName: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  notes?: string;
  recordedBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MechanicAssignment {
  id: string;
  jobCardId: string;
  jobCardNumber: string;
  mechanicId: string;
  mechanicName: string;
  assignedDate: string;
  assignedBy: string;
  status: 'Assigned' | 'In Progress' | 'Completed' | 'Reassigned';
  completionDate?: string;
  internalNotes?: string;
}

// 3. EXPENSES & PROFIT MANAGEMENT TYPES
export interface ExpenseCategory {
  id: string;
  name: string;
  isSystem?: boolean;
  description?: string;
}

export interface ExpenseRecord {
  id: string;
  expenseTitle: string;
  expenseCategory: string;
  amount: number;
  expenseDate: string; // YYYY-MM-DD
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Easypaisa' | 'JazzCash' | 'Cheque';
  paidTo: string;
  description: string;
  referenceNumber?: string;
  receiptPhotoOrDoc?: string;
  createdBy: string;
  createdDate: string;
  updatedAt?: string;
  purchaseOrderId?: string;
}

export type FinancialTransactionType = 
  | 'Customer Payment'
  | 'Workshop Expense'
  | 'Supplier Payment'
  | 'Refund'
  | 'Purchase Payment'
  | 'Other';

export interface FinancialTransaction {
  id: string;
  transactionType: FinancialTransactionType;
  referenceType: 'Invoice' | 'Expense' | 'PurchaseOrder' | 'Manual';
  referenceId: string;
  amount: number;
  date: string;
  paymentMethod: string;
  description: string;
  createdBy: string;
  status: 'Completed' | 'Reversed' | 'Pending';
  customerOrPayee?: string;
  createdAt: string;
}

export interface ProfitSummary {
  collectedRevenue: number;
  invoicedAmount: number;
  outstandingReceivables: number;
  totalExpenses: number;
  partsDirectCost: number;
  operatingExpenses: number;
  grossProfitEstimate: number;
  netProfitEstimate: number;
  periodLabel: string;
  isIncompleteData: boolean;
  warningNotice?: string;
}

// 4. SUPPLIER & PURCHASE ORDER TYPES
export type SupplierStatus = 'Active' | 'Inactive' | 'Archived';

export interface SupplierRecord {
  id: string;
  supplierName: string;
  contactPerson: string;
  phoneNumber: string;
  whatsAppNumber?: string;
  email?: string;
  businessAddress: string;
  supplierCategory: string;
  productsSupplied: string[];
  paymentTerms: string;
  notes?: string;
  status: SupplierStatus;
  totalPurchases: number;
  totalPaid: number;
  outstandingBalance: number;
  createdAt: string;
  updatedAt?: string;
}

export type PODeliveryStatus = 
  | 'Draft'
  | 'Sent'
  | 'Confirmed'
  | 'Partially Received'
  | 'Received'
  | 'Cancelled'
  | 'Closed';

export type POPaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid';

export interface PurchaseOrderItem {
  id: string;
  partId?: string;
  partName: string;
  partSku?: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitPurchasePrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. "HA-PO-2026-001"
  supplierId: string;
  supplierName: string;
  orderDate: string; // YYYY-MM-DD
  expectedDeliveryDate: string;
  items: PurchaseOrderItem[];
  discount: number;
  additionalCharges: number;
  totalOrderValue: number;
  paidAmount: number;
  paymentStatus: POPaymentStatus;
  deliveryStatus: PODeliveryStatus;
  receivingNotes?: string;
  receivedDate?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SupplierPayment {
  id: string;
  supplierId: string;
  supplierName: string;
  purchaseOrderId?: string;
  poNumber?: string;
  paymentDate: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Easypaisa' | 'JazzCash' | 'Cheque';
  referenceNumber?: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

// 5. SECURITY & DATA RECOVERY TYPES
export interface SecurityEvent {
  id: string;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'UNAUTHORIZED_ACCESS' | 'INTEGRITY_WARNING' | 'BACKUP_CREATED' | 'RESTORE_EXECUTED';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  ipAddress: string;
  userAgent?: string;
  adminUsername?: string;
  timestamp: string;
}

export interface StorageFileHealth {
  filename: string;
  exists: boolean;
  sizeBytes: number;
  recordCount: number;
  isValidJson: boolean;
  lastModified: string;
  error?: string;
}

export interface StorageHealthCheck {
  overallStatus: 'Healthy' | 'Degraded' | 'Critical';
  healthyFilesCount: number;
  totalFilesCount: number;
  files: StorageFileHealth[];
  checkedAt: string;
  backupAvailability: boolean;
  lastBackupDate?: string;
}

export interface DataIntegrityIssue {
  id: string;
  severity: 'warning' | 'error';
  entity: string;
  recordId: string;
  issueDescription: string;
  suggestedAction?: string;
}

export interface DataIntegrityReport {
  checkedAt: string;
  totalRecordsChecked: number;
  issuesCount: number;
  issues: DataIntegrityIssue[];
}

export interface RecoveryHistoryRecord {
  id: string;
  backupId: string;
  backupDate: string;
  restoreDate: string;
  adminUsername: string;
  restoreType: 'full' | 'selected' | 'merge';
  modulesRestored: string[];
  result: 'Success' | 'Failed';
  errorDetails?: string;
  preRestoreSafetyBackup: string;
}

