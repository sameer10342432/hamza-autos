import { 
  AppointmentBooking, 
  JobCard, 
  CustomerProfile, 
  SparePart, 
  StockMovement, 
  WorkshopInvoice, 
  ServiceReminder, 
  StaffMember, 
  SearchResultItem, 
  BookingStatus,
  RepairStatus,
  PaymentStatus,
  CustomerReview
} from '../types';
import { validatePakistaniPhone } from './businessLogic';
import { SERVICES_LIST, BRANDS_LIST, AREAS_LIST, BLOG_POSTS, FAQS, BUSINESS_INFO } from '../data/businessData';

// Storage Keys
export const STORAGE_KEYS = {
  BOOKINGS: 'hamza_autos_bookings_v2',
  JOB_CARDS: 'hamza_autos_jobcards_v2',
  CUSTOMERS: 'hamza_autos_customers_v2',
  INVENTORY: 'hamza_autos_inventory_v2',
  MOVEMENTS: 'hamza_autos_movements_v2',
  INVOICES: 'hamza_autos_invoices_v2',
  REMINDERS: 'hamza_autos_reminders_v2',
  STAFF: 'hamza_autos_staff_v2',
  REVIEWS: 'hamza_autos_reviews_moderated_v2',
  AUDIT_LOGS: 'hamza_autos_audit_logs_v2'
};

// Available appointment time slots during business hours (9:00 AM – 9:00 PM)
export const APPOINTMENT_TIME_SLOTS = [
  '09:30 AM',
  '10:30 AM',
  '11:30 AM',
  '12:30 PM',
  '02:30 PM',
  '03:30 PM',
  '04:30 PM',
  '05:30 PM',
  '06:30 PM',
  '07:30 PM',
  '08:30 PM'
];

export const DEFAULT_SLOT_CAPACITY = 2; // Maximum simultaneous bikes per slot

// ==========================================
// 1. APPOINTMENT BOOKINGS SYSTEM
// ==========================================

export function getStoredBookings(): AppointmentBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return [
    {
      id: 'bk-1',
      bookingNumber: 'HA-BK-2026-001',
      customerName: 'Muhammad Arshad',
      phoneNumber: '0300 1234567',
      area: 'Badami Bagh',
      bikeBrand: 'Honda',
      bikeModel: 'CD 70 (2023)',
      registrationNumber: 'LEN-23-4412',
      serviceRequested: 'Bike Tuning & Fuel Economy Optimization',
      problemDescription: 'Poor petrol mileage, doing 35 km/l only. Needs carburetor ultrasonic cleaning.',
      appointmentDate: '2026-11-12',
      appointmentTime: '10:30 AM',
      status: 'Confirmed',
      internalNotes: 'Allotted Bay 1 with Mechanic Bilal.',
      createdAt: '2026-11-10 14:00',
      updatedAt: '2026-11-10 14:15'
    },
    {
      id: 'bk-2',
      bookingNumber: 'HA-BK-2026-002',
      customerName: 'Zahid Hussain',
      phoneNumber: '0321 9876543',
      area: 'Shadbagh',
      bikeBrand: 'Yamaha',
      bikeModel: 'YBR 125G',
      registrationNumber: 'LEA-21-9081',
      serviceRequested: 'Motorcycle Brake Repair & Shoe/Pad Replacement',
      problemDescription: 'Front hydraulic disc brake lever has lost pressure after riding over bumpy roads.',
      appointmentDate: '2026-11-12',
      appointmentTime: '02:30 PM',
      status: 'Pending Confirmation',
      internalNotes: 'Check hydraulic fluid level and disc pads.',
      createdAt: '2026-11-10 16:30',
      updatedAt: '2026-11-10 16:30'
    }
  ];
}

export function saveStoredBookings(bookings: AppointmentBooking[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    // ignore
  }
}

/**
 * Checks if a time slot has available capacity on a given date.
 * Prevents double-booking.
 */
export function isTimeSlotAvailable(
  date: string, 
  timeSlot: string, 
  excludeBookingId?: string, 
  capacity: number = DEFAULT_SLOT_CAPACITY
): { available: boolean; bookedCount: number; remaining: number } {
  const bookings = getStoredBookings();
  const activeBookings = bookings.filter(b => 
    b.appointmentDate === date && 
    b.appointmentTime === timeSlot && 
    b.status !== 'Cancelled' &&
    (!excludeBookingId || b.id !== excludeBookingId)
  );
  
  const bookedCount = activeBookings.length;
  const remaining = Math.max(0, capacity - bookedCount);
  return {
    available: remaining > 0,
    bookedCount,
    remaining
  };
}

export function createAppointmentBooking(data: {
  customerName: string;
  phoneNumber: string;
  area?: string;
  bikeBrand: string;
  bikeModel: string;
  registrationNumber?: string;
  serviceRequested: string;
  problemDescription: string;
  appointmentDate: string;
  appointmentTime: string;
}): { success: boolean; booking?: AppointmentBooking; error?: string } {
  // 1. Validate phone
  const phoneValidation = validatePakistaniPhone(data.phoneNumber);
  if (!phoneValidation.isValid) {
    return { success: false, error: phoneValidation.error || 'Invalid Pakistani phone number' };
  }

  // 2. Validate slot availability (double-booking protection)
  const slotStatus = isTimeSlotAvailable(data.appointmentDate, data.appointmentTime);
  if (!slotStatus.available) {
    return { 
      success: false, 
      error: `The ${data.appointmentTime} slot on ${data.appointmentDate} is fully booked. Please select another time or date.` 
    };
  }

  const bookings = getStoredBookings();
  const seq = bookings.length + 1;
  const bookingNumber = `HA-BK-2026-${String(seq).padStart(3, '0')}`;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

  const newBooking: AppointmentBooking = {
    id: `bk-${Date.now()}`,
    bookingNumber,
    customerName: data.customerName.trim(),
    phoneNumber: phoneValidation.normalized,
    area: data.area?.trim() || 'Badami Bagh',
    bikeBrand: data.bikeBrand.trim(),
    bikeModel: data.bikeModel.trim(),
    registrationNumber: data.registrationNumber?.trim().toUpperCase(),
    serviceRequested: data.serviceRequested.trim(),
    problemDescription: data.problemDescription.trim(),
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    status: 'New Request',
    createdAt: now,
    updatedAt: now
  };

  const updated = [newBooking, ...bookings];
  saveStoredBookings(updated);

  // Auto-link with CRM
  upsertCustomerFromActivity({
    name: newBooking.customerName,
    phoneNumber: newBooking.phoneNumber,
    area: newBooking.area || 'Badami Bagh',
    bikeBrand: newBooking.bikeBrand,
    bikeModel: newBooking.bikeModel,
    registrationNumber: newBooking.registrationNumber
  });

  return { success: true, booking: newBooking };
}

export function updateBookingStatus(
  id: string, 
  status: BookingStatus, 
  internalNotes?: string
): boolean {
  const bookings = getStoredBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return false;

  bookings[idx].status = status;
  if (internalNotes !== undefined) {
    bookings[idx].internalNotes = internalNotes;
  }
  bookings[idx].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

  saveStoredBookings(bookings);
  return true;
}

// ==========================================
// 2. DIGITAL WORKSHOP JOB CARDS
// ==========================================

export function getStoredJobCards(): JobCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOB_CARDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return [
    {
      id: 'jc-1',
      jobCardNumber: 'HA-JC-2026-001',
      customerName: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      customerComplaint: 'Excessive white smoke from silencer, loss of power and engine overheating on circular road.',
      initialInspectionNotes: 'Piston ring leakage diagnosed; cylinder bore required. Head tappets out of clearance.',
      requiredServices: ['Motorcycle Engine Repair & Overhaul', 'Motorcycle Engine Oil Change & Filter Service'],
      estimatedCost: 8500,
      finalCost: 8500,
      assignedMechanicId: 'staff-2',
      assignedMechanicName: 'Ustad Tariq (Senior Engine Rebuilder)',
      createdDate: '2026-11-09 10:00',
      expectedCompletionDate: '2026-11-10 18:00',
      completionDate: '2026-11-10 17:30',
      repairStatus: 'Ready for Delivery',
      photosBefore: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80'],
      photosAfter: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80'],
      internalNotes: 'Used genuine 0.25 oversize piston kit and 20W-50 4T lubricant. Tested on 5km road run - zero smoke.',
      invoiceId: 'inv-1'
    },
    {
      id: 'jc-2',
      jobCardNumber: 'HA-JC-2026-002',
      customerName: 'Asif Raza',
      phoneNumber: '0322 4567890',
      bikeBrand: 'Yamaha',
      bikeModel: 'YBR 125',
      registrationNumber: 'LEC-20-5544',
      customerComplaint: 'Electric self-starter clicking but not cranking engine.',
      initialInspectionNotes: 'Battery charge ok (12.6V). Starter relay contact corroded and carbon brushes worn out.',
      requiredServices: ['Motorcycle Electrical System Repair'],
      estimatedCost: 2200,
      finalCost: 0,
      assignedMechanicId: 'staff-3',
      assignedMechanicName: 'Bilal Ahmad (Electrical Specialist)',
      createdDate: '2026-11-10 11:30',
      expectedCompletionDate: '2026-11-11 14:00',
      repairStatus: 'Work In Progress',
      photosBefore: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80'],
      photosAfter: [],
      internalNotes: 'Starter motor disassembled. Sourcing genuine Yamaha carbon brush set.'
    }
  ];
}

export function saveStoredJobCards(jobCards: JobCard[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.JOB_CARDS, JSON.stringify(jobCards));
  } catch (e) {
    // ignore
  }
}

export function createJobCard(data: Omit<JobCard, 'id' | 'jobCardNumber' | 'createdDate'>): JobCard {
  const jobCards = getStoredJobCards();
  const seq = jobCards.length + 1;
  const jobCardNumber = `HA-JC-2026-${String(seq).padStart(3, '0')}`;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

  const newCard: JobCard = {
    ...data,
    id: `jc-${Date.now()}`,
    jobCardNumber,
    createdDate: now,
    photosBefore: data.photosBefore || [],
    photosAfter: data.photosAfter || []
  };

  const updated = [newCard, ...jobCards];
  saveStoredJobCards(updated);

  // Link with CRM
  upsertCustomerFromActivity({
    name: newCard.customerName,
    phoneNumber: newCard.phoneNumber,
    area: 'Badami Bagh',
    bikeBrand: newCard.bikeBrand,
    bikeModel: newCard.bikeModel,
    registrationNumber: newCard.registrationNumber
  });

  return newCard;
}

export function updateJobCard(id: string, updates: Partial<JobCard>): boolean {
  const cards = getStoredJobCards();
  const idx = cards.findIndex(c => c.id === id);
  if (idx === -1) return false;

  cards[idx] = { ...cards[idx], ...updates };
  saveStoredJobCards(cards);
  return true;
}

// ==========================================
// 3. SECURE CUSTOMER REPAIR TRACKING LOOKUP
// ==========================================

export interface PublicTrackingResult {
  found: boolean;
  jobCardNumber?: string;
  customerName?: string;
  bikeBrand?: string;
  bikeModel?: string;
  registrationNumber?: string;
  repairStatus?: RepairStatus;
  customerComplaint?: string;
  requiredServices?: string[];
  createdDate?: string;
  expectedCompletionDate?: string;
  completionDate?: string;
  estimatedCost?: number;
  finalCost?: number;
  invoiceId?: string;
  photosBefore?: string[];
  photosAfter?: string[];
  error?: string;
}

/**
 * Secure lookup: Customer must provide BOTH the Job Card Number and their matching registered Phone Number.
 * This completely prevents guessing random IDs. Internal mechanic notes are NEVER returned.
 */
export function lookupJobCardForTracking(
  jobCardNumber: string, 
  verificationPhone: string
): PublicTrackingResult {
  const cleanCardNo = jobCardNumber.trim().toUpperCase();
  const phoneValidation = validatePakistaniPhone(verificationPhone);

  if (!cleanCardNo) {
    return { found: false, error: 'Please enter your Job Card Number (e.g. HA-JC-2026-001)' };
  }

  if (!phoneValidation.isValid) {
    return { found: false, error: 'Please enter a valid phone number used during repair booking' };
  }

  const jobCards = getStoredJobCards();
  const card = jobCards.find(c => c.jobCardNumber.toUpperCase() === cleanCardNo);

  if (!card) {
    return { 
      found: false, 
      error: `No repair record found for Job Card "${cleanCardNo}". Please double check your receipt or contact Hamza Autos.` 
    };
  }

  // Verify phone matches (compare normalized digits)
  const cardPhoneClean = card.phoneNumber.replace(/[\s\-\(\)\+]/g, '').slice(-10);
  const inputPhoneClean = phoneValidation.normalized.replace(/[\s\-\(\)\+]/g, '').slice(-10);

  if (cardPhoneClean !== inputPhoneClean) {
    return { 
      found: false, 
      error: 'Security verification failed: The phone number does not match the customer record on this job card.' 
    };
  }

  // Return public-safe payload (strictly NO internalNotes or assignedMechanicId)
  return {
    found: true,
    jobCardNumber: card.jobCardNumber,
    customerName: card.customerName,
    bikeBrand: card.bikeBrand,
    bikeModel: card.bikeModel,
    registrationNumber: card.registrationNumber,
    repairStatus: card.repairStatus,
    customerComplaint: card.customerComplaint,
    requiredServices: card.requiredServices,
    createdDate: card.createdDate,
    expectedCompletionDate: card.expectedCompletionDate,
    completionDate: card.completionDate,
    estimatedCost: card.estimatedCost,
    finalCost: card.finalCost,
    invoiceId: card.invoiceId,
    photosBefore: card.photosBefore,
    photosAfter: card.photosAfter
  };
}

// ==========================================
// 4. CUSTOMER CRM
// ==========================================

export function getStoredCustomers(): CustomerProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return [
    {
      id: 'cust-1',
      name: 'Muhammad Arshad',
      phoneNumber: '0300 1234567',
      area: 'Badami Bagh',
      bikeBrand: 'Honda',
      bikeModel: 'CD 70 (2023)',
      registrationNumber: 'LEN-23-4412',
      registeredDate: '2026-10-15',
      notes: 'Daily commuter on Abu Bakar road. Prefers genuine Atlas Honda 4T lubricant.',
      optInReminders: true,
      totalSpent: 4200,
      totalVisits: 3
    },
    {
      id: 'cust-2',
      name: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      area: 'Timber Market, Lahore',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      registeredDate: '2026-10-28',
      notes: 'Carries commercial cargo loads. Heavy clutch wear noted.',
      optInReminders: true,
      totalSpent: 12500,
      totalVisits: 4
    },
    {
      id: 'cust-3',
      name: 'Asif Raza',
      phoneNumber: '0322 4567890',
      area: 'Shadbagh',
      bikeBrand: 'Yamaha',
      bikeModel: 'YBR 125',
      registrationNumber: 'LEC-20-5544',
      registeredDate: '2026-11-02',
      notes: 'Requested WhatsApp notification when disc brake pads arrive.',
      optInReminders: true,
      totalSpent: 2200,
      totalVisits: 1
    }
  ];
}

export function saveStoredCustomers(customers: CustomerProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch (e) {
    // ignore
  }
}

/**
 * Automatically creates or updates customer profile by verified phone number.
 * Avoids creating duplicate customer records.
 */
export function upsertCustomerFromActivity(data: {
  name: string;
  phoneNumber: string;
  area?: string;
  bikeBrand: string;
  bikeModel: string;
  registrationNumber?: string;
}): CustomerProfile {
  const customers = getStoredCustomers();
  const phoneClean = data.phoneNumber.replace(/[\s\-\(\)\+]/g, '').slice(-10);

  const existingIdx = customers.findIndex(c => 
    c.phoneNumber.replace(/[\s\-\(\)\+]/g, '').slice(-10) === phoneClean
  );

  if (existingIdx !== -1) {
    // Update existing customer record
    customers[existingIdx].name = data.name || customers[existingIdx].name;
    customers[existingIdx].area = data.area || customers[existingIdx].area;
    customers[existingIdx].bikeBrand = data.bikeBrand || customers[existingIdx].bikeBrand;
    customers[existingIdx].bikeModel = data.bikeModel || customers[existingIdx].bikeModel;
    if (data.registrationNumber) {
      customers[existingIdx].registrationNumber = data.registrationNumber;
    }
    customers[existingIdx].totalVisits = (customers[existingIdx].totalVisits || 0) + 1;
    saveStoredCustomers(customers);
    return customers[existingIdx];
  } else {
    // Create new customer record
    const newCust: CustomerProfile = {
      id: `cust-${Date.now()}`,
      name: data.name.trim(),
      phoneNumber: data.phoneNumber.trim(),
      area: data.area?.trim() || 'Badami Bagh',
      bikeBrand: data.bikeBrand.trim(),
      bikeModel: data.bikeModel.trim(),
      registrationNumber: data.registrationNumber?.trim().toUpperCase(),
      registeredDate: new Date().toISOString().slice(0, 10),
      optInReminders: true,
      totalSpent: 0,
      totalVisits: 1
    };
    const updated = [newCust, ...customers];
    saveStoredCustomers(updated);
    return newCust;
  }
}

// ==========================================
// 5. SPARE PARTS INVENTORY MANAGEMENT
// ==========================================

export function getStoredInventory(): SparePart[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return [
    {
      id: 'sp-1',
      partNumber: 'SP-ENG-001',
      partName: 'Piston Kit Complete 0.25 (70cc OHC)',
      category: 'Engine & Mechanical',
      compatibleBrands: ['Honda', 'United', 'Road Prince', 'Chinese Motorcycles'],
      compatibleModels: ['CD 70', 'US 70', 'RP 70', 'All 70cc Chinese'],
      purchasePrice: 1200,
      sellingPrice: 1800,
      stockQuantity: 14,
      minStockAlert: 5,
      lastRestocked: '2026-11-01'
    },
    {
      id: 'sp-2',
      partNumber: 'SP-ENG-002',
      partName: 'Piston Kit Complete 0.25 (CG 125 OHV)',
      category: 'Engine & Mechanical',
      compatibleBrands: ['Honda'],
      compatibleModels: ['CG 125', 'CG 125 SE'],
      purchasePrice: 2100,
      sellingPrice: 2900,
      stockQuantity: 8,
      minStockAlert: 4,
      lastRestocked: '2026-11-04'
    },
    {
      id: 'sp-3',
      partNumber: 'SP-OIL-001',
      partName: 'Caltex Havoline 4T 20W-50 Engine Oil (0.7L)',
      category: 'Lubricants & Fluids',
      compatibleBrands: ['Honda', 'United', 'Road Prince'],
      compatibleModels: ['CD 70', 'CD 70 Dream', 'US 70'],
      purchasePrice: 850,
      sellingPrice: 1050,
      stockQuantity: 28,
      minStockAlert: 10,
      lastRestocked: '2026-11-08'
    },
    {
      id: 'sp-4',
      partNumber: 'SP-BRK-001',
      partName: 'Yamaha Front Hydraulic Disc Brake Pads (YBR 125)',
      category: 'Brakes & Safety',
      compatibleBrands: ['Yamaha'],
      compatibleModels: ['YBR 125', 'YBR 125G', 'YB 125Z-DX'],
      purchasePrice: 650,
      sellingPrice: 950,
      stockQuantity: 3, // LOW STOCK!
      minStockAlert: 5,
      lastRestocked: '2026-10-20'
    },
    {
      id: 'sp-5',
      partNumber: 'SP-CLU-001',
      partName: 'Clutch Friction Plates Set (CG 125 5-Plate Heavy Duty)',
      category: 'Clutch & Transmission',
      compatibleBrands: ['Honda', 'United'],
      compatibleModels: ['CG 125', 'US 125'],
      purchasePrice: 1400,
      sellingPrice: 2000,
      stockQuantity: 9,
      minStockAlert: 4,
      lastRestocked: '2026-11-05'
    },
    {
      id: 'sp-6',
      partNumber: 'SP-ELC-001',
      partName: 'Ignition Coil & Spark Plug Cap (CD 70 12V)',
      category: 'Electrical & Ignition',
      compatibleBrands: ['Honda', 'United', 'Chinese Motorcycles'],
      compatibleModels: ['CD 70', 'Pridor', 'All 70cc'],
      purchasePrice: 450,
      sellingPrice: 700,
      stockQuantity: 2, // LOW STOCK!
      minStockAlert: 4,
      lastRestocked: '2026-10-18'
    }
  ];
}

export function saveStoredInventory(parts: SparePart[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(parts));
  } catch (e) {
    // ignore
  }
}

export function adjustStockQuantity(
  partId: string, 
  quantityDelta: number, 
  type: 'restock' | 'consumed' | 'adjustment', 
  reason: string,
  recordedBy: string = 'Super Admin'
): { success: boolean; newQuantity?: number } {
  const parts = getStoredInventory();
  const idx = parts.findIndex(p => p.id === partId);
  if (idx === -1) return { success: false };

  const current = parts[idx].stockQuantity;
  const newQty = Math.max(0, current + quantityDelta);
  parts[idx].stockQuantity = newQty;

  if (type === 'restock') {
    parts[idx].lastRestocked = new Date().toISOString().slice(0, 10);
  }

  saveStoredInventory(parts);

  // Record movement
  try {
    const rawMovements = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    const movements: StockMovement[] = rawMovements ? JSON.parse(rawMovements) : [];
    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      partId,
      partName: parts[idx].partName,
      type,
      quantity: Math.abs(quantityDelta),
      reason,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      recordedBy
    };
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify([newMovement, ...movements]));
  } catch (e) {
    // ignore
  }

  return { success: true, newQuantity: newQty };
}

// ==========================================
// 6. DIGITAL INVOICING AND RECEIPTS
// ==========================================

export function getStoredInvoices(): WorkshopInvoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return [
    {
      id: 'inv-1',
      invoiceNumber: 'HA-INV-2026-001',
      jobCardNumber: 'HA-JC-2026-001',
      invoiceDate: '2026-11-10',
      customerName: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      labourItems: [
        { id: 'l-1', description: 'Complete 4-Stroke Engine Overhauling & Head Assembly Labour', amount: 3500 },
        { id: 'l-2', description: 'Cylinder Reboring & Precision Lathe Turning', amount: 1200 }
      ],
      partsItems: [
        { id: 'p-1', partName: 'Piston Kit Complete 0.25 (CG 125 OHV)', quantity: 1, unitPrice: 2900, total: 2900 },
        { id: 'p-2', partName: 'Atlas Honda 4T 20W-50 Engine Oil (1L)', quantity: 1, unitPrice: 1100, total: 1100 }
      ],
      additionalCharges: 0,
      discount: 200,
      totalAmount: 8500,
      amountPaid: 8500,
      remainingBalance: 0,
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      notes: 'First 500 km break-in inspection recommended. Keep speed under 50 km/h.'
    }
  ];
}

export function saveStoredInvoices(invoices: WorkshopInvoice[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  } catch (e) {
    // ignore
  }
}

export function createInvoice(data: Omit<WorkshopInvoice, 'id' | 'invoiceNumber' | 'totalAmount' | 'remainingBalance' | 'paymentStatus'> & { paymentStatus?: PaymentStatus }): WorkshopInvoice {
  const invoices = getStoredInvoices();
  const seq = invoices.length + 1;
  const invoiceNumber = `HA-INV-2026-${String(seq).padStart(3, '0')}`;

  const labourTotal = data.labourItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const partsTotal = data.partsItems.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
  const additional = Number(data.additionalCharges) || 0;
  const discount = Number(data.discount) || 0;

  const totalAmount = Math.max(0, labourTotal + partsTotal + additional - discount);
  const amountPaid = Number(data.amountPaid) || 0;
  const remainingBalance = Math.max(0, totalAmount - amountPaid);

  let paymentStatus: PaymentStatus = 'Unpaid';
  if (remainingBalance === 0 && totalAmount > 0) {
    paymentStatus = 'Paid';
  } else if (amountPaid > 0 && remainingBalance > 0) {
    paymentStatus = 'Partially Paid';
  }

  const newInvoice: WorkshopInvoice = {
    ...data,
    id: `inv-${Date.now()}`,
    invoiceNumber,
    totalAmount,
    amountPaid,
    remainingBalance,
    paymentStatus,
    notes: data.notes || ''
  };

  const updated = [newInvoice, ...invoices];
  saveStoredInvoices(updated);

  // Deduct inventory parts consumed if linked
  data.partsItems.forEach(part => {
    if (part.partId) {
      adjustStockQuantity(
        part.partId, 
        -part.quantity, 
        'consumed', 
        `Used in Invoice ${invoiceNumber} for ${data.customerName}`
      );
    }
  });

  return newInvoice;
}

// ==========================================
// 7. WHATSAPP AUTOMATION TEMPLATES ENGINE
// ==========================================

export interface PreparedWhatsAppMessage {
  recipientPhone: string;
  templateType: string;
  text: string;
  waUrl: string;
  toString: () => string;
}

export function generatePreparedWhatsApp(
  type: string,
  payload: {
    customerName?: string;
    phoneNumber?: string;
    bikeBrand?: string;
    bikeModel?: string;
    bookingNumber?: string;
    jobCardNumber?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    estimatedCost?: number;
    finalCost?: number;
    totalCost?: number;
    amountPaid?: number;
    balance?: number;
    invoiceNumber?: string;
    serviceType?: string;
    completionTime?: string;
  }
): PreparedWhatsAppMessage {
  const phoneClean = (payload.phoneNumber || BUSINESS_INFO.phoneRaw || '923251814548')
    .toString()
    .replace(/[\s\-\(\)]/g, '')
    .replace(/^0/, '92')
    .replace(/^\+/, '');
  const workshopAddress = "Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore";
  const cName = payload.customerName || 'Valued Customer';
  const bModel = payload.bikeModel || (payload.bikeBrand ? `${payload.bikeBrand} Motorcycle` : 'Motorcycle');
  const cost = payload.finalCost ?? payload.totalCost ?? payload.estimatedCost ?? 0;
  let text = "";

  switch (type) {
    case 'booking_confirmed':
    case 'booking_confirmation':
      text = `Salam ${cName}! Your motorcycle repair appointment at *Hamza Autos Badami Bagh* has been CONFIRMED.\n\n` +
             `📋 *Booking #:* ${payload.bookingNumber || 'N/A'}\n` +
             `🏍 *Motorcycle:* ${bModel}\n` +
             `📅 *Date:* ${payload.appointmentDate}\n` +
             `⏰ *Time Slot:* ${payload.appointmentTime}\n` +
             `📍 *Location:* ${workshopAddress}\n\n` +
             `Please arrive 5 minutes early. We look forward to assisting you! For directions, call +92 325 1814548.`;
      break;

    case 'booking_rescheduled':
    case 'reschedule':
      text = `Salam ${cName}, regarding your booking at *Hamza Autos Badami Bagh*:\n\n` +
             `Due to bay capacity, your appointment has been rescheduled to:\n` +
             `📅 *New Date:* ${payload.appointmentDate}\n` +
             `⏰ *New Time Slot:* ${payload.appointmentTime}\n\n` +
             `If this time works for you, please reply 'CONFIRM'. Thank you for your patience!`;
      break;

    case 'repair_started':
      text = `Salam ${cName}! Work on your *${bModel}* has officially STARTED at *Hamza Autos Badami Bagh*.\n\n` +
             `📋 *Job Card #:* ${payload.jobCardNumber}\n` +
             `🔧 *Inspection & Diagnosis:* In progress by assigned mechanic.\n\n` +
             `Track live repair status online anytime: https://hamza-autos.pk/#/track-repair\n` +
             `Workshop: +92 325 1814548`;
      break;

    case 'estimate_approval':
    case 'job_estimate':
      text = `Salam ${cName}! Initial mechanical inspection for your *${bModel}* (Job Card #${payload.jobCardNumber}) is complete at *Hamza Autos*.\n\n` +
             `💰 *Estimated Total:* PKR ${cost.toLocaleString()}\n` +
             (payload.completionTime ? `⏱ *Estimated Delivery:* ${payload.completionTime}\n\n` : `\n`) +
             `Before proceeding with parts fitting, we request your kind approval. Please reply *'APPROVED'* to commence assembly, or call us with questions.`;
      break;

    case 'repair_completed':
    case 'ready_for_pickup':
      text = `Salam ${cName}! Great news – your *${bModel}* repair is COMPLETE and tested at *Hamza Autos Badami Bagh*! 🏍✨\n\n` +
             `📋 *Job Card #:* ${payload.jobCardNumber}\n` +
             `💵 *Final Amount:* PKR ${cost.toLocaleString()}\n` +
             `📍 *Workshop:* Abu Bakar Road, Badami Bagh (Open until 9:00 PM)\n\n` +
             `Your bike is ready for test drive & delivery!`;
      break;

    case 'invoice_summary':
    case 'invoice_receipt':
      text = `Salam ${cName}! Here is your digital repair receipt from *Hamza Autos Badami Bagh*:\n\n` +
             `🧾 *Invoice #:* ${payload.invoiceNumber}\n` +
             `🏍 *Bike:* ${bModel}\n` +
             `💰 *Total Amount:* PKR ${cost.toLocaleString()}\n` +
             (payload.amountPaid !== undefined ? `💵 *Paid:* PKR ${payload.amountPaid.toLocaleString()}\n` : ``) +
             (payload.balance !== undefined && payload.balance > 0 ? `⚠️ *Remaining Balance:* PKR ${payload.balance.toLocaleString()}\n` : `✅ *Status:* Paid in Full\n`) +
             `📍 *Workshop:* Abu Bakar Road, Badami Bagh, Lahore\n\n` +
             `Thank you for trusting Hamza Autos. Workmanship guaranteed!`;
      break;

    case 'service_reminder':
      text = `Salam ${cName}! A friendly maintenance reminder from *Hamza Autos Badami Bagh*:\n\n` +
             `Your *${bModel}* is due for its periodic *${payload.serviceType || 'Engine Oil Change & Tuning'}*.\n\n` +
             `Regular oil changes protect your engine against heat and preserve top mileage (50-65 km/l). Visit us on Abu Bakar Road, Badami Bagh (9:00 AM – 9:00 PM) or reply to book your slot!`;
      break;

    default:
      text = `Salam ${cName}! Update from Hamza Autos Badami Bagh regarding your motorcycle: ${bModel}. Call +92 325 1814548 for details.`;
      break;
  }

  const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`;

  return {
    recipientPhone: payload.phoneNumber || '',
    templateType: type,
    text,
    waUrl,
    toString: () => waUrl
  };
}

// ==========================================
// 8. SERVICE REMINDER SYSTEM
// ==========================================

export function getStoredReminders(): ServiceReminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return [
    {
      id: 'rem-1',
      customerName: 'Muhammad Arshad',
      phoneNumber: '0300 1234567',
      bikeBrand: 'Honda',
      bikeModel: 'CD 70 (2023)',
      serviceType: '1,000 km Engine Oil Change',
      lastServiceDate: '2026-10-15',
      nextDueDate: '2026-11-15',
      status: 'Pending',
      notes: 'Customer uses Havoline 4T 20W-50.'
    },
    {
      id: 'rem-2',
      customerName: 'Zahid Hussain',
      phoneNumber: '0321 9876543',
      bikeBrand: 'Yamaha',
      bikeModel: 'YBR 125G',
      serviceType: 'Carburetor Ultrasonic Tuning & Air Filter',
      lastServiceDate: '2026-09-10',
      nextDueDate: '2026-11-10',
      status: 'Pending',
      notes: 'Rider commutes 40km daily from Shadbagh to Bund Road.'
    }
  ];
}

export function saveStoredReminders(reminders: ServiceReminder[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (e) {
    // ignore
  }
}

// ==========================================
// 9. STAFF AND MECHANIC MANAGEMENT
// ==========================================

export function getStoredStaff(): StaffMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STAFF);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return [
    {
      id: 'staff-1',
      name: 'Ustad Hamza (Chief Technician & Owner)',
      phoneNumber: '+92 325 1814548',
      role: 'Super Admin',
      specialties: ['Master Engine Rebuilder', 'Diagnostic Overhaul', 'Carburetor Calibration'],
      status: 'Active',
      joinedDate: '2020-01-01'
    },
    {
      id: 'staff-2',
      name: 'Ustad Tariq (Senior Mechanic)',
      phoneNumber: '+92 301 5566778',
      role: 'Workshop Manager',
      specialties: ['4-Stroke Head & Cylinder Boring', 'Clutch Plate & Transmission Rebuild'],
      status: 'Active',
      joinedDate: '2021-06-15'
    },
    {
      id: 'staff-3',
      name: 'Bilal Ahmad (Electrical & Tuning)',
      phoneNumber: '+92 322 9988776',
      role: 'Mechanic',
      specialties: ['Wiring Harness Repair', 'Self-Starter Motors', 'Ignition CDI Coils'],
      status: 'Active',
      joinedDate: '2023-03-10'
    }
  ];
}

export function saveStoredStaff(staff: StaffMember[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  } catch (e) {
    // ignore
  }
}

// ==========================================
// 10. CUSTOMER REVIEW MODERATION
// ==========================================

export function getModeratedReviews(): CustomerReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return [
    {
      id: 'rev-1',
      authorName: 'Muhammad Usman',
      area: 'Badami Bagh, Lahore',
      bikeModel: 'Honda CG 125 (2022)',
      rating: 5,
      date: '2 weeks ago',
      serviceReceived: 'Engine Tappet Setting & Tuning',
      comment: 'My CG 125 had an annoying top-end clatter and was giving poor mileage. Hamza Autos did a proper feeler gauge tappet setting and carburetor clean. The bike runs smooth and quiet now. Transparent pricing and honest advice.',
      isVerifiedCustomer: true,
      status: 'approved',
      source: 'Google Business Profile'
    },
    {
      id: 'rev-2',
      authorName: 'Rizwan Ahmed',
      area: 'Shadbagh, Lahore',
      bikeModel: 'Yamaha YBR 125G',
      rating: 5,
      date: '1 month ago',
      serviceReceived: 'Hydraulic Disc Brake Bleeding & Oil Change',
      comment: 'I live in Shadbagh, only 7 minutes away. Took my YBR for spongy front disc brakes. They bled the hydraulic line, fitted genuine brake pads, and did an oil change. Very professional workshop setup.',
      isVerifiedCustomer: true,
      status: 'approved',
      source: 'Website Submission'
    },
    {
      id: 'rev-3',
      authorName: 'Tariq Mahmood',
      area: 'Timber Market, Lahore',
      bikeModel: 'United 70',
      rating: 5,
      date: '1 month ago',
      serviceReceived: 'Cylinder Reboring & Piston Replacement',
      comment: 'My daily work bike was throwing white smoke. Hamza Autos completed the cylinder bore and ring job on the same day. Pickup restored 100% and zero smoke. Reliable mechanic for all of us in the Timber Market area.',
      isVerifiedCustomer: true,
      status: 'approved',
      source: 'Google Business Profile'
    },
    {
      id: 'rev-4',
      authorName: 'Kashif Ali',
      area: 'Misri Shah, Lahore',
      bikeModel: 'Suzuki GS 150',
      rating: 4,
      date: '3 weeks ago',
      serviceReceived: 'Clutch Overhaul',
      comment: 'Replaced clutch plates with genuine parts. Smooth gear shifts now. Slightly crowded on Sunday but work quality is top tier.',
      isVerifiedCustomer: true,
      status: 'approved',
      source: 'Website Submission'
    },
    {
      id: 'rev-5',
      authorName: 'Zubair Butt',
      area: 'Ravi Road, Lahore',
      bikeModel: 'Honda CD 70 Dream',
      rating: 5,
      date: '3 days ago',
      serviceReceived: 'General Tuning & Oil Service',
      comment: 'Got my 70cc tuned up before long commute. Excellent petrol average now. Hamza bhai explains everything honestly.',
      isVerifiedCustomer: true,
      status: 'pending', // Unmoderated
      source: 'Website Submission'
    }
  ];
}

export function saveModeratedReviews(reviews: CustomerReview[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    // ignore
  }
}

// ==========================================
// 11. ADVANCED SITE-WIDE SEARCH INDEX
// ==========================================

export function performSiteSearch(query: string): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  // Search Services
  SERVICES_LIST.forEach(s => {
    if (
      s.title.toLowerCase().includes(q) || 
      s.shortDescription.toLowerCase().includes(q) || 
      s.commonSymptoms.some(sym => sym.toLowerCase().includes(q))
    ) {
      results.push({
        id: `srv-${s.id}`,
        title: s.title,
        category: 'Service',
        snippet: s.shortDescription,
        view: 'services',
        slug: s.slug
      });
    }
  });

  // Search Brands
  BRANDS_LIST.forEach(b => {
    if (
      b.name.toLowerCase().includes(q) || 
      b.popularModels.some(m => m.toLowerCase().includes(q)) ||
      b.overview.toLowerCase().includes(q)
    ) {
      results.push({
        id: `brd-${b.id}`,
        title: `${b.name} Motorcycle Repair`,
        category: 'Brand',
        snippet: `Specialized repairs for ${b.popularModels.join(', ')} in Badami Bagh.`,
        view: 'brands',
        slug: b.slug
      });
    }
  });

  // Search Blog Articles
  BLOG_POSTS.forEach(p => {
    if (
      p.title.toLowerCase().includes(q) || 
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    ) {
      results.push({
        id: `blg-${p.id}`,
        title: p.title,
        category: 'Article',
        snippet: p.excerpt,
        view: 'blog',
        slug: p.slug
      });
    }
  });

  // Search Areas
  AREAS_LIST.forEach(a => {
    if (
      a.name.toLowerCase().includes(q) || 
      a.localIntro.toLowerCase().includes(q) ||
      a.landmarks.some(l => l.toLowerCase().includes(q))
    ) {
      results.push({
        id: `area-${a.id}`,
        title: `Motorcycle Mechanic for ${a.name}`,
        category: 'Area',
        snippet: `Fastest route: ${a.estimatedDriveTime} (${a.distanceFromBadamiBagh}) to Abu Bakar Road workshop.`,
        view: 'areas',
        slug: a.slug
      });
    }
  });

  // Search FAQs
  FAQS.forEach((f, idx) => {
    if (
      f.question.toLowerCase().includes(q) || 
      f.answer.toLowerCase().includes(q)
    ) {
      results.push({
        id: `faq-${idx}`,
        title: f.question,
        category: 'FAQ',
        snippet: f.answer.slice(0, 110) + '...',
        view: 'home'
      });
    }
  });

  // Search Inventory
  const inventory = getStoredInventory();
  inventory.forEach(part => {
    if (
      part.partName.toLowerCase().includes(q) ||
      part.partNumber.toLowerCase().includes(q) ||
      part.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: `part-${part.id}`,
        title: `${part.partName} (${part.partNumber})`,
        category: 'Part',
        snippet: `In Stock: ${part.stockQuantity} units · Compatible: ${part.compatibleBrands.join(', ')}`,
        view: 'contact'
      });
    }
  });

  return results.slice(0, 12);
}

// ==========================================
// 12. DATABASE BACKUP AND RESTORE
// ==========================================

export interface WorkshopDatabaseBackup {
  version: string;
  exportedAt: string;
  data: {
    bookings: AppointmentBooking[];
    jobCards: JobCard[];
    customers: CustomerProfile[];
    inventory: SparePart[];
    invoices: WorkshopInvoice[];
    reminders: ServiceReminder[];
    staff: StaffMember[];
    reviews: CustomerReview[];
  };
}

export function exportDatabaseBackup(): string {
  const payload: WorkshopDatabaseBackup = {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    data: {
      bookings: getStoredBookings(),
      jobCards: getStoredJobCards(),
      customers: getStoredCustomers(),
      inventory: getStoredInventory(),
      invoices: getStoredInvoices(),
      reminders: getStoredReminders(),
      staff: getStoredStaff(),
      reviews: getModeratedReviews()
    }
  };
  return JSON.stringify(payload, null, 2);
}

export function importDatabaseBackup(jsonString: string): { success: boolean; error?: string } {
  try {
    const backup: WorkshopDatabaseBackup = JSON.parse(jsonString);
    if (!backup.data || !backup.version) {
      return { success: false, error: 'Invalid backup format: Missing data or version header' };
    }

    if (backup.data.bookings) saveStoredBookings(backup.data.bookings);
    if (backup.data.jobCards) saveStoredJobCards(backup.data.jobCards);
    if (backup.data.customers) saveStoredCustomers(backup.data.customers);
    if (backup.data.inventory) saveStoredInventory(backup.data.inventory);
    if (backup.data.invoices) saveStoredInvoices(backup.data.invoices);
    if (backup.data.reminders) saveStoredReminders(backup.data.reminders);
    if (backup.data.staff) saveStoredStaff(backup.data.staff);
    if (backup.data.reviews) saveModeratedReviews(backup.data.reviews);

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to parse JSON backup file' };
  }
}
