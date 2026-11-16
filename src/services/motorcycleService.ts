/**
 * Motorcycle Service - Local-First Motorcycle Profile Operations
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  STORES
} from './storageService';
import { MotorcycleProfile } from '../types';

export const motorcycleService = {
  async getAll(): Promise<MotorcycleProfile[]> {
    return getAllFromStore<MotorcycleProfile>(STORES.MOTORCYCLES);
  },

  async getById(id: string): Promise<MotorcycleProfile | null> {
    return getByIdFromStore<MotorcycleProfile>(STORES.MOTORCYCLES, id);
  },

  async getByCustomerId(customerId: string): Promise<MotorcycleProfile[]> {
    const all = await this.getAll();
    return all.filter(m => m.customerId === customerId);
  },

  async getByRegistration(regNo: string): Promise<MotorcycleProfile | null> {
    const clean = regNo.trim().toUpperCase();
    const all = await this.getAll();
    return all.find(m => m.registrationNumber.trim().toUpperCase() === clean) || null;
  },

  async create(data: Omit<MotorcycleProfile, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<MotorcycleProfile> {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const item: MotorcycleProfile = {
      id: data.id || `bike-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      brand: data.brand,
      model: data.model,
      registrationNumber: data.registrationNumber.trim().toUpperCase(),
      engineCapacity: data.engineCapacity || '70cc',
      mileage: data.mileage || 0,
      chassisNumber: data.chassisNumber?.trim().toUpperCase(),
      color: data.color?.trim(),
      year: data.year?.trim(),
      createdAt: now,
      updatedAt: now
    };

    await putInStore(STORES.MOTORCYCLES, item);
    return item;
  },

  async update(item: MotorcycleProfile): Promise<MotorcycleProfile> {
    item.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    await putInStore(STORES.MOTORCYCLES, item);
    return item;
  },

  async delete(id: string): Promise<void> {
    await deleteFromStore(STORES.MOTORCYCLES, id);
  }
};
