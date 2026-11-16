/**
 * Booking Service - Feature 1: Smart Online Booking
 * Local-First IndexedDB persistence with slot capacity validation and duplicate check
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  STORES
} from './storageService';
import { AppointmentBooking, BookingStatus } from '../types';
import { customerService } from './customerService';
import { motorcycleService } from './motorcycleService';

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

export const bookingService = {
  async getAll(): Promise<AppointmentBooking[]> {
    const list = await getAllFromStore<AppointmentBooking>(STORES.BOOKINGS);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getById(id: string): Promise<AppointmentBooking | null> {
    return getByIdFromStore<AppointmentBooking>(STORES.BOOKINGS, id);
  },

  async getByNumber(bookingNumber: string): Promise<AppointmentBooking | null> {
    const clean = bookingNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.find(b => b.bookingNumber.toUpperCase() === clean) || null;
  },

  async getByCustomerId(customerId: string): Promise<AppointmentBooking[]> {
    const all = await this.getAll();
    return all.filter(b => b.customerId === customerId);
  },

  async getByPhone(phone: string): Promise<AppointmentBooking[]> {
    const clean = phone.replace(/[\s\-\(\)\+]/g, '').slice(-10);
    const all = await this.getAll();
    return all.filter(b => b.phoneNumber.replace(/[\s\-\(\)\+]/g, '').slice(-10) === clean);
  },

  /**
   * Check slot availability based on date and time
   */
  async checkSlotAvailability(date: string, time: string, maxCapacity = 2): Promise<{ available: boolean; currentBookings: number }> {
    const all = await this.getAll();
    const active = all.filter(b => 
      b.appointmentDate === date && 
      b.appointmentTime === time && 
      b.status !== 'Cancelled' && 
      b.status !== 'Rejected'
    );

    return {
      available: active.length < maxCapacity,
      currentBookings: active.length
    };
  },

  /**
   * Check for duplicate bookings (same phone, date, and service requested)
   */
  async checkDuplicateBooking(phone: string, date: string, service: string): Promise<boolean> {
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '').slice(-10);
    const all = await this.getAll();
    return all.some(b => 
      b.appointmentDate === date &&
      b.phoneNumber.replace(/[\s\-\(\)\+]/g, '').slice(-10) === cleanPhone &&
      b.serviceRequested.toLowerCase() === service.toLowerCase() &&
      b.status !== 'Cancelled' &&
      b.status !== 'Rejected'
    );
  },

  /**
   * Generate Next Unique Reference: HA-BK-YYYY-XXX
   */
  async generateBookingNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const all = await this.getAll();
    const prefix = `HA-BK-${year}-`;
    const nums = all
      .filter(b => b.bookingNumber.startsWith(prefix))
      .map(b => parseInt(b.bookingNumber.replace(prefix, ''), 10))
      .filter(n => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `${prefix}${String(nextSeq).padStart(3, '0')}`;
  },

  /**
   * Create Smart Online Booking
   */
  async create(data: {
    customerName: string;
    phoneNumber: string;
    whatsappNumber?: string;
    email?: string;
    address?: string;
    area?: string;
    bikeBrand: string;
    bikeModel: string;
    registrationNumber?: string;
    engineCapacity?: string;
    mileage?: number;
    serviceRequested: string;
    selectedServices?: string[];
    problemDescription: string;
    appointmentDate: string;
    appointmentTime: string;
    additionalNotes?: string;
    internalNotes?: string;
    status?: BookingStatus;
  }): Promise<{ booking: AppointmentBooking; customer: any; motorcycle: any }> {
    // 1. Duplicate check
    const isDuplicate = await this.checkDuplicateBooking(data.phoneNumber, data.appointmentDate, data.serviceRequested);
    if (isDuplicate) {
      throw new Error(`A booking for this motorcycle service on ${data.appointmentDate} already exists in your local records.`);
    }

    // 2. Slot capacity check
    const slot = await this.checkSlotAvailability(data.appointmentDate, data.appointmentTime);
    if (!slot.available) {
      throw new Error(`The requested time slot (${data.appointmentTime} on ${data.appointmentDate}) is fully booked. Please choose an alternative time slot.`);
    }

    // 3. Upsert customer
    const customer = await customerService.findOrCreateFromActivity({
      name: data.customerName,
      phoneNumber: data.phoneNumber,
      area: data.area,
      bikeBrand: data.bikeBrand,
      bikeModel: data.bikeModel,
      registrationNumber: data.registrationNumber
    });

    // 4. Upsert motorcycle if registration given
    let motorcycle = null;
    if (data.registrationNumber) {
      motorcycle = await motorcycleService.getByRegistration(data.registrationNumber);
      if (!motorcycle) {
        motorcycle = await motorcycleService.create({
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phoneNumber,
          brand: data.bikeBrand,
          model: data.bikeModel,
          registrationNumber: data.registrationNumber,
          engineCapacity: data.engineCapacity || '70cc',
          mileage: data.mileage || 0
        });
      }
    }

    // 5. Generate Reference
    const bookingNumber = await this.generateBookingNumber();
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const booking: AppointmentBooking = {
      id: `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookingNumber,
      customerId: customer.id,
      motorcycleId: motorcycle?.id,
      customerName: data.customerName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      area: data.area || customer.area || 'Badami Bagh',
      bikeBrand: data.bikeBrand,
      bikeModel: data.bikeModel,
      registrationNumber: data.registrationNumber?.trim().toUpperCase(),
      serviceRequested: data.serviceRequested,
      selectedServices: data.selectedServices || [data.serviceRequested],
      problemDescription: data.problemDescription.trim(),
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      status: data.status || 'Pending',
      internalNotes: data.internalNotes?.trim(),
      createdAt: now,
      updatedAt: now
    };

    await putInStore(STORES.BOOKINGS, booking);
    return { booking, customer, motorcycle };
  },

  async updateStatus(id: string, status: BookingStatus, internalNotes?: string): Promise<AppointmentBooking | null> {
    const booking = await this.getById(id);
    if (!booking) return null;

    booking.status = status;
    if (internalNotes !== undefined) {
      booking.internalNotes = internalNotes;
    }
    booking.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    await putInStore(STORES.BOOKINGS, booking);
    return booking;
  },

  async update(booking: AppointmentBooking): Promise<AppointmentBooking> {
    booking.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    await putInStore(STORES.BOOKINGS, booking);
    return booking;
  },

  async delete(id: string): Promise<void> {
    await deleteFromStore(STORES.BOOKINGS, id);
  }
};
