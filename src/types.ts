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
