/**
 * Hamza Autos - Mobile TypeScript Type Definitions
 * Reused and synchronized with existing website types
 */

// Motorcycle Compatibility
export type BikeBrand = 
  | 'Honda' 
  | 'Yamaha' 
  | 'Suzuki' 
  | 'United' 
  | 'Road Prince' 
  | 'Super Power' 
  | 'Chinese Motorcycles';

export interface MotorcycleModelInfo {
  id: string;
  brand: BikeBrand;
  name: string;
  engineCc: number;
  years: string;
}

// Spare Parts
export interface SparePart {
  id: string;
  partNumber: string; // SKU
  partName: string;
  category: string;
  compatibleBrands: string[];
  compatibleModels: string[];
  purchasePrice: number;
  sellingPrice: number;
  discountedPrice?: number;
  stockQuantity: number;
  minStockAlert: number;
  supplier?: string;
  description?: string;
  isArchived?: boolean;
  lastRestocked?: string;
  image?: string;
  rating?: number;
  reviewsCount?: number;
}

// Shopping Cart Item
export interface CartItem {
  part: SparePart;
  quantity: number;
}

// Pakistan Provinces and Address
export type PakistanProvince = 
  | 'Punjab' 
  | 'Sindh' 
  | 'Khyber Pakhtunkhwa' 
  | 'Balochistan' 
  | 'Islamabad Capital Territory' 
  | 'Gilgit-Baltistan' 
  | 'Azad Jammu & Kashmir';

export interface DeliveryAddress {
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email?: string;
  province: PakistanProvince;
  city: string;
  streetAddress: string;
  postalCode?: string;
  orderNotes?: string;
}

// Payment Methods
export type PaymentMethod = 
  | 'Cash on Delivery (COD)' 
  | 'Bank Transfer / Manual Payment';

export type OrderStatus = 
  | 'New' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Dispatched' 
  | 'In Transit' 
  | 'Delivered' 
  | 'Cancelled';

export interface OrderItemRecord {
  partId: string;
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string; // e.g. "HA-ORD-2026-101"
  customer: DeliveryAddress;
  items: OrderItemRecord[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  courierName?: 'TCS' | 'Leopards Courier' | 'M&P Express' | 'PostEx' | 'Local Delivery';
  courierTrackingNumber?: string;
}

// Workshop Services
export interface WorkshopService {
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
  estimatedPriceRange?: string;
  image: string;
}

// Appointment Booking
export type BookingStatus = 
  | 'Pending Confirmation' 
  | 'Confirmed' 
  | 'In Progress' 
  | 'Completed' 
  | 'Cancelled';

export interface ServiceBookingPayload {
  customerName: string;
  phoneNumber: string;
  bikeBrand: BikeBrand;
  bikeModel: string;
  registrationNumber?: string;
  serviceRequested: string;
  problemDescription: string;
  appointmentDate: string;
  appointmentTime: string;
  additionalNotes?: string;
  photoUri?: string;
}

export interface AppointmentBookingRecord extends ServiceBookingPayload {
  id: string;
  bookingNumber: string; // e.g. "HA-BK-2026-105"
  status: BookingStatus;
  createdAt: string;
}

// Repair Tracking Stages
export type RepairStage = 
  | 'Booking Requested'
  | 'Booking Confirmed'
  | 'Bike Received'
  | 'Inspection in Progress'
  | 'Quotation Prepared'
  | 'Customer Approval Pending'
  | 'Repair in Progress'
  | 'Quality Inspection'
  | 'Ready for Collection'
  | 'Completed';

export interface RepairJobCard {
  id: string;
  jobCardNumber: string; // e.g. "HA-JC-2026-001"
  customerName: string;
  phoneNumber: string;
  bikeBrand: string;
  bikeModel: string;
  registrationNumber?: string;
  customerComplaint: string;
  requiredServices: string[];
  repairStatus: RepairStage;
  assignedMechanicName?: string;
  createdDate: string;
  expectedCompletionDate?: string;
  estimatedCost: number;
  finalCost?: number;
  photosBefore?: string[];
  photosAfter?: string[];
  healthReport?: BikeHealthItem[];
}

export interface BikeHealthItem {
  component: string; // e.g. "Engine Compression", "Brake Pads", "Chain Tension"
  condition: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  recommendation: string;
}

// Customer Profile & Saved Bikes (My Garage)
export interface SavedMotorcycle {
  id: string;
  brand: BikeBrand;
  model: string;
  year?: string;
  registrationNumber?: string;
  nickname?: string;
  mileageKm?: number;
  lastOilChangeKm?: number;
  lastTuningKm?: number;
}

export interface MaintenanceReminder {
  id: string;
  bikeId: string;
  bikeName: string;
  title: string;
  type: 'Oil Change' | 'Bike Tuning' | 'Brake Inspection' | 'Chain Lubrication' | 'Tyre Inspection' | 'General Service';
  dueDate: string;
  dueKm?: number;
  isCompleted: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  area: string;
  savedAddresses: DeliveryAddress[];
  bikes: SavedMotorcycle[];
}
