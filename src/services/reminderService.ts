/**
 * Reminder Service - Feature 9: Maintenance Reminder System
 * In-app notification calculations, browser notification requests, and WhatsApp templates
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  STORES
} from './storageService';
import { MaintenanceReminderRecord } from '../types';

export const REMINDER_TYPES = [
  'Engine Oil Change',
  'General Service',
  'Brake Inspection',
  'Tyre Inspection',
  'Chain Lubrication',
  'Chain Adjustment',
  'Battery Inspection',
  'Air Filter Cleaning',
  'Spark Plug Inspection',
  'Other'
] as const;

export const reminderService = {
  async getAll(): Promise<MaintenanceReminderRecord[]> {
    const list = await getAllFromStore<MaintenanceReminderRecord>(STORES.MAINTENANCE_REMINDERS);
    return list.map(r => this.recalculateStatus(r)).sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate));
  },

  async getById(id: string): Promise<MaintenanceReminderRecord | null> {
    const r = await getByIdFromStore<MaintenanceReminderRecord>(STORES.MAINTENANCE_REMINDERS, id);
    return r ? this.recalculateStatus(r) : null;
  },

  async getByCustomerId(customerId: string): Promise<MaintenanceReminderRecord[]> {
    const all = await this.getAll();
    return all.filter(r => r.customerId === customerId);
  },

  async getByPhone(phone: string): Promise<MaintenanceReminderRecord[]> {
    const clean = phone.replace(/[\s\-\(\)\+]/g, '').slice(-10);
    const all = await this.getAll();
    return all.filter(r => r.phoneNumber.replace(/[\s\-\(\)\+]/g, '').slice(-10) === clean);
  },

  recalculateStatus(reminder: MaintenanceReminderRecord): MaintenanceReminderRecord {
    if (reminder.status === 'Completed' || reminder.status === 'Cancelled') {
      return reminder;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (reminder.nextDueDate === today) {
      reminder.status = 'Due Today';
    } else if (reminder.nextDueDate < today) {
      reminder.status = 'Overdue';
    } else {
      reminder.status = 'Upcoming';
    }
    return reminder;
  },

  async create(data: {
    motorcycleId?: string;
    customerId?: string;
    customerName: string;
    phoneNumber: string;
    bikeBrand: string;
    bikeModel: string;
    registrationNumber?: string;
    reminderType: MaintenanceReminderRecord['reminderType'];
    lastServiceDate?: string;
    lastMileage?: number;
    nextDueDate: string;
    nextDueMileage?: number;
    reminderNotes?: string;
  }): Promise<MaintenanceReminderRecord> {
    const now = new Date().toISOString().slice(0, 10);
    const rec: MaintenanceReminderRecord = {
      id: `rem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      motorcycleId: data.motorcycleId,
      customerId: data.customerId,
      customerName: data.customerName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      bikeBrand: data.bikeBrand,
      bikeModel: data.bikeModel,
      registrationNumber: data.registrationNumber?.trim().toUpperCase(),
      reminderType: data.reminderType,
      lastServiceDate: data.lastServiceDate || now,
      lastMileage: data.lastMileage,
      nextDueDate: data.nextDueDate,
      nextDueMileage: data.nextDueMileage,
      reminderNotes: data.reminderNotes?.trim() || 'Periodic maintenance to preserve 4-stroke engine life.',
      status: 'Upcoming',
      createdAt: now,
      updatedAt: now
    };

    const evaluated = this.recalculateStatus(rec);
    await putInStore(STORES.MAINTENANCE_REMINDERS, evaluated);
    return evaluated;
  },

  async updateStatus(id: string, status: MaintenanceReminderRecord['status']): Promise<MaintenanceReminderRecord | null> {
    const reminder = await this.getById(id);
    if (!reminder) return null;
    reminder.status = status;
    reminder.updatedAt = new Date().toISOString().slice(0, 10);
    await putInStore(STORES.MAINTENANCE_REMINDERS, reminder);
    return reminder;
  },

  async update(reminder: MaintenanceReminderRecord): Promise<MaintenanceReminderRecord> {
    reminder.updatedAt = new Date().toISOString().slice(0, 10);
    await putInStore(STORES.MAINTENANCE_REMINDERS, reminder);
    return reminder;
  },

  async delete(id: string): Promise<void> {
    await deleteFromStore(STORES.MAINTENANCE_REMINDERS, id);
  },

  /**
   * Request standard browser Notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.requestPermission();
    }
    return 'denied';
  },

  /**
   * Trigger local browser notification if permitted
   */
  showLocalNotification(title: string, options?: NotificationOptions): boolean {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options
        });
        return true;
      } catch (e) {
        console.warn('Browser notification failed:', e);
      }
    }
    return false;
  }
};
