/**
 * Hamza Autos - Complete Online Shop & Motorcycle Spare Parts E-Commerce Type Definitions
 * Targeting Customers Across All Pakistan (Punjab, Sindh, KPK, Balochistan, ICT, GB, AJK)
 */

export type PakistaniProvince = 
  | 'Punjab'
  | 'Sindh'
  | 'Khyber Pakhtunkhwa'
  | 'Balochistan'
  | 'Islamabad Capital Territory'
  | 'Gilgit-Baltistan'
  | 'Azad Jammu & Kashmir';

export type MotorcycleBrandName = 
  | 'Honda'
  | 'Yamaha'
  | 'Suzuki'
  | 'United'
  | 'Road Prince'
  | 'Super Power'
  | 'Hi-Speed'
  | 'Crown'
  | 'Other Chinese Motorcycle Brands';

export interface MotorcycleModelSpec {
  id: string;
  brand: MotorcycleBrandName;
  modelName: string; // e.g. "CD 70", "CG 125", "YBR 125", "GD 110", "Pridor"
  engineCc: string;  // e.g. "70cc", "125cc", "100cc", "110cc", "150cc"
  popularYears?: string; // e.g. "2010 - 2026"
  isPopularInPakistan: boolean;
}

export interface BikeCompatibility {
  brand: MotorcycleBrandName;
  model: string;
  engineCc?: string;
  notes?: string; // e.g. "Fits all Euro 2 models", "Front wheel only"
}

export interface ProductImageItem {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ShopCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName?: string;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
}

export type ProductCondition = 'New (OEM / Genuine)' | 'New (High-Grade Aftermarket)' | 'Refurbished / Tested';

export type ProductAvailability = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  brand: string; // Manufacturer / Brand of the part, e.g. "Crown Lifan", "FCC Japan", "NGK", "Servis", "Osaka", "Honda Genuine"
  condition: ProductCondition;
  price: number; // in PKR
  discountedPrice?: number; // in PKR, optional
  stockQuantity: number;
  lowStockThreshold: number;
  availabilityStatus: ProductAvailability;
  isFeatured: boolean;
  isPublished: boolean;
  rating: number; // Genuine baseline rating (e.g. 4.8)
  reviewCount: number;
  description: string;
  shortDescription?: string;
  specifications: Record<string, string>; // e.g. { "Material": "Semi-metallic", "Warranty": "7-day check warranty" }
  images: ProductImageItem[];
  compatibleBikes: BikeCompatibility[];
  weightKg?: number;
  originCountry?: string; // e.g. "Pakistan", "Japan", "China", "Thailand"
  warrantyText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  slug: string;
  image: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
  selectedCompatibility?: string;
}

export interface OrderCustomerDetails {
  fullName: string;
  mobileNumber: string; // e.g. 0321-1234567
  whatsappNumber?: string;
  email?: string;
  deliveryAddress: string;
  city: string;
  province: PakistaniProvince;
  postalCode?: string;
  orderNotes?: string;
}

export type PaymentMethod = 'Cash on Delivery (COD)' | 'Bank Transfer / Manual Payment';

export type PaymentStatus = 
  | 'Pending Verification'
  | 'Payment Received'
  | 'Unpaid'
  | 'Refunded';

export type OrderStatus = 
  | 'New Order'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Dispatched'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type CourierPartner = 
  | 'TCS Courier'
  | 'Leopards Courier'
  | 'M&P Express'
  | 'Trax Logistics'
  | 'PostEx'
  | 'Call Courier'
  | 'Hamza Autos Express (Lahore)'
  | 'Other';

export interface OrderShippingDetails {
  courier: CourierPartner;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDeliveryDays: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  returnedAt?: string;
  cancelledAt?: string;
}

export interface OrderPricingBreakdown {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

export interface OrderStatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface ShopOrder {
  id: string;
  orderNumber: string; // e.g. "HA-SHOP-2026-1001"
  customer: OrderCustomerDetails;
  items: CartItem[];
  pricing: OrderPricingBreakdown;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string; // e.g. Bank transaction ID or Easypaisa TID
  paymentProofUrl?: string;
  paymentVerifiedAt?: string;
  paymentVerifiedBy?: string;
  shipping: OrderShippingDetails;
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistoryEntry[];
  stockAdjusted: boolean; // Ensures idempotent stock deductions
  createdAt: string;
  updatedAt: string;
}

export type InventoryMovementType = 
  | 'ORDER_CONFIRMED'
  | 'ORDER_CANCELLED'
  | 'ORDER_RETURNED'
  | 'MANUAL_ADJUSTMENT'
  | 'STOCK_RECEIVED'
  | 'INITIAL_SETUP';

export interface ShopInventoryMovement {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  changeType: InventoryMovementType;
  previousQuantity: number;
  changeAmount: number; // positive or negative
  newQuantity: number;
  reason: string;
  orderId?: string;
  orderNumber?: string;
  performedBy: string;
  timestamp: string;
}

export interface BankAccountDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branchName: string;
  easypaisaNumber?: string;
  jazzcashNumber?: string;
}

export interface ShopShippingSettings {
  defaultShippingFee: number; // e.g. 250 PKR
  freeShippingThreshold: number; // e.g. 3500 PKR
  lahoreExpressDeliveryFee: number; // e.g. 150 PKR
  allowedProvinces: PakistaniProvince[];
  estimatedDeliveryText: string;
  courierPartners: CourierPartner[];
  specialCityRates?: Record<string, number>;
}

export interface ShopSettings {
  shopName: string;
  tagline: string;
  bannerTitle: string;
  bannerSubtitle: string;
  supportPhone: string;
  whatsappNumber: string; // e.g. "923251814548"
  supportEmail: string;
  currency: string; // "PKR"
  bankDetails: BankAccountDetails;
  returnPolicy: string;
  shippingPolicy: string;
  lowStockThresholdDefault: number;
  isShopActive: boolean;
}

export interface ShopDashboardStats {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalCollectedRevenue: number;
  totalPendingRevenue: number;
}
