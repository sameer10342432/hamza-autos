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
