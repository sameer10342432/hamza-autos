/**
 * Customer Service - Local-First Customer Operations
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  STORES
} from './storageService';
import { CustomerProfile } from '../types';

export const customerService = {
  async getAll(): Promise<CustomerProfile[]> {
    const list = await getAllFromStore<CustomerProfile>(STORES.CUSTOMERS);
    return list.sort((a, b) => (b.registeredDate || '').localeCompare(a.registeredDate || ''));
  },

  async getById(id: string): Promise<CustomerProfile | null> {
    return getByIdFromStore<CustomerProfile>(STORES.CUSTOMERS, id);
  },

  async getByPhone(phone: string): Promise<CustomerProfile | null> {
    const clean = phone.replace(/[\s\-\(\)\+]/g, '').slice(-10);
    const all = await this.getAll();
    return all.find(c => c.phoneNumber.replace(/[\s\-\(\)\+]/g, '').slice(-10) === clean) || null;
  },

  async findByPhone(phone: string): Promise<CustomerProfile | null> {
    return this.getByPhone(phone);
  },

  async search(query: string): Promise<CustomerProfile[]> {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAll();
    const all = await this.getAll();
    return all.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phoneNumber.includes(q) ||
      (c.registrationNumber && c.registrationNumber.toLowerCase().includes(q)) ||
      (c.area && c.area.toLowerCase().includes(q))
    );
  },

  async create(data: Omit<CustomerProfile, 'id' | 'registeredDate'> & { id?: string; registeredDate?: string }): Promise<CustomerProfile> {
    const newCustomer: CustomerProfile = {
      id: data.id || `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: data.name.trim(),
      phoneNumber: data.phoneNumber.trim(),
      alternatePhone: data.alternatePhone?.trim(),
      area: data.area || 'Badami Bagh',
      bikeBrand: data.bikeBrand || 'Honda',
      bikeModel: data.bikeModel || 'CD 70',
      registrationNumber: data.registrationNumber?.trim().toUpperCase(),
      registeredDate: data.registeredDate || new Date().toISOString().slice(0, 10),
      notes: data.notes?.trim(),
      optInReminders: data.optInReminders !== false,
      totalSpent: data.totalSpent || 0,
      totalVisits: data.totalVisits || 1
    };

    await putInStore(STORES.CUSTOMERS, newCustomer);
    return newCustomer;
  },

  async update(customer: CustomerProfile): Promise<CustomerProfile> {
    await putInStore(STORES.CUSTOMERS, customer);
    return customer;
  },

  async delete(id: string): Promise<void> {
    await deleteFromStore(STORES.CUSTOMERS, id);
  },

  async findOrCreateFromActivity(data: {
    name: string;
    phoneNumber: string;
    area?: string;
    bikeBrand?: string;
    bikeModel?: string;
    registrationNumber?: string;
  }): Promise<CustomerProfile> {
    const existing = await this.getByPhone(data.phoneNumber);
    if (existing) {
      // Update details if missing
      let modified = false;
      if (!existing.registrationNumber && data.registrationNumber) {
        existing.registrationNumber = data.registrationNumber.toUpperCase();
        modified = true;
      }
      if (modified) {
        await this.update(existing);
      }
      return existing;
    }

    return this.create({
      name: data.name,
      phoneNumber: data.phoneNumber,
      area: data.area || 'Badami Bagh',
      bikeBrand: data.bikeBrand || 'Honda',
      bikeModel: data.bikeModel || 'CD 70',
      registrationNumber: data.registrationNumber,
      optInReminders: true,
      totalSpent: 0,
      totalVisits: 1
    });
  }
};
