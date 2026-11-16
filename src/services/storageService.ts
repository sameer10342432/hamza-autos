/**
 * Hamza Autos - Local-First IndexedDB Storage Service
 * Database: hamza_autos_db
 * Version: 1
 * Primary persistent storage for 16 object stores. Zero external database dependencies.
 */

import {
  CustomerProfile,
  MotorcycleProfile,
  AppointmentBooking,
  JobCard,
  BikeInspectionReport,
  Quotation,
  WorkshopInvoice,
  PaymentRecord,
  SparePart,
  InventoryMovementRecord,
  MaintenanceReminderRecord,
  CustomerFeedbackRecord,
  AppNotification,
  WhatsAppTemplate,
  ApplicationSettingRecord,
  AuditLogRecord
} from '../types';

export const DB_NAME = 'hamza_autos_db';
export const DB_VERSION = 1;

export const STORES = {
  CUSTOMERS: 'customers',
  MOTORCYCLES: 'motorcycles',
  BOOKINGS: 'bookings',
  JOB_CARDS: 'jobCards',
  INSPECTIONS: 'inspections',
  QUOTATIONS: 'quotations',
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  INVENTORY: 'inventory',
  INVENTORY_MOVEMENTS: 'inventoryMovements',
  MAINTENANCE_REMINDERS: 'maintenanceReminders',
  FEEDBACK: 'feedback',
  NOTIFICATIONS: 'notifications',
  WHATSAPP_TEMPLATES: 'whatsappTemplates',
  APPLICATION_SETTINGS: 'applicationSettings',
  AUDIT_LOGS: 'auditLogs',
} as const;

export type StoreName = typeof STORES[keyof typeof STORES];

let dbInstance: IDBDatabase | null = null;
let dbInitPromise: Promise<IDBDatabase> | null = null;

/**
 * Open or initialize the IndexedDB connection
 */
export function openDatabase(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;

      // 1. customers
      if (!db.objectStoreNames.contains(STORES.CUSTOMERS)) {
        const store = db.createObjectStore(STORES.CUSTOMERS, { keyPath: 'id' });
        store.createIndex('phoneNumber', 'phoneNumber', { unique: false });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('registeredDate', 'registeredDate', { unique: false });
      }

      // 2. motorcycles
      if (!db.objectStoreNames.contains(STORES.MOTORCYCLES)) {
        const store = db.createObjectStore(STORES.MOTORCYCLES, { keyPath: 'id' });
        store.createIndex('customerId', 'customerId', { unique: false });
        store.createIndex('registrationNumber', 'registrationNumber', { unique: false });
        store.createIndex('brand', 'brand', { unique: false });
      }

      // 3. bookings
      if (!db.objectStoreNames.contains(STORES.BOOKINGS)) {
        const store = db.createObjectStore(STORES.BOOKINGS, { keyPath: 'id' });
        store.createIndex('bookingNumber', 'bookingNumber', { unique: true });
        store.createIndex('customerId', 'customerId', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('appointmentDate', 'appointmentDate', { unique: false });
      }

      // 4. jobCards
      if (!db.objectStoreNames.contains(STORES.JOB_CARDS)) {
        const store = db.createObjectStore(STORES.JOB_CARDS, { keyPath: 'id' });
        store.createIndex('jobCardNumber', 'jobCardNumber', { unique: true });
        store.createIndex('customerId', 'customerId', { unique: false });
        store.createIndex('repairStatus', 'repairStatus', { unique: false });
        store.createIndex('createdDate', 'createdDate', { unique: false });
      }

      // 5. inspections
      if (!db.objectStoreNames.contains(STORES.INSPECTIONS)) {
        const store = db.createObjectStore(STORES.INSPECTIONS, { keyPath: 'id' });
        store.createIndex('inspectionNumber', 'inspectionNumber', { unique: true });
        store.createIndex('jobCardId', 'jobCardId', { unique: false });
        store.createIndex('customerId', 'customerId', { unique: false });
        store.createIndex('inspectionDate', 'inspectionDate', { unique: false });
      }

      // 6. quotations
      if (!db.objectStoreNames.contains(STORES.QUOTATIONS)) {
        const store = db.createObjectStore(STORES.QUOTATIONS, { keyPath: 'id' });
        store.createIndex('quotationNumber', 'quotationNumber', { unique: true });
        store.createIndex('customerId', 'customerId', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }

      // 7. invoices
      if (!db.objectStoreNames.contains(STORES.INVOICES)) {
        const store = db.createObjectStore(STORES.INVOICES, { keyPath: 'id' });
        store.createIndex('invoiceNumber', 'invoiceNumber', { unique: true });
        store.createIndex('customerId', 'customerId', { unique: false });
        store.createIndex('jobCardNumber', 'jobCardNumber', { unique: false });
        store.createIndex('paymentStatus', 'paymentStatus', { unique: false });
      }

      // 8. payments
      if (!db.objectStoreNames.contains(STORES.PAYMENTS)) {
        const store = db.createObjectStore(STORES.PAYMENTS, { keyPath: 'id' });
        store.createIndex('invoiceId', 'invoiceId', { unique: false });
        store.createIndex('invoiceNumber', 'invoiceNumber', { unique: false });
        store.createIndex('paymentDate', 'paymentDate', { unique: false });
      }

      // 9. inventory
      if (!db.objectStoreNames.contains(STORES.INVENTORY)) {
        const store = db.createObjectStore(STORES.INVENTORY, { keyPath: 'id' });
        store.createIndex('sku', 'sku', { unique: true });
        store.createIndex('partName', 'partName', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }

      // 10. inventoryMovements
      if (!db.objectStoreNames.contains(STORES.INVENTORY_MOVEMENTS)) {
        const store = db.createObjectStore(STORES.INVENTORY_MOVEMENTS, { keyPath: 'id' });
        store.createIndex('partId', 'partId', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }

      // 11. maintenanceReminders
      if (!db.objectStoreNames.contains(STORES.MAINTENANCE_REMINDERS)) {
        const store = db.createObjectStore(STORES.MAINTENANCE_REMINDERS, { keyPath: 'id' });
        store.createIndex('customerId', 'customerId', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('nextDueDate', 'nextDueDate', { unique: false });
      }

      // 12. feedback
      if (!db.objectStoreNames.contains(STORES.FEEDBACK)) {
        const store = db.createObjectStore(STORES.FEEDBACK, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('overallRating', 'overallRating', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // 13. notifications
      if (!db.objectStoreNames.contains(STORES.NOTIFICATIONS)) {
        const store = db.createObjectStore(STORES.NOTIFICATIONS, { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('read', 'read', { unique: false });
      }

      // 14. whatsappTemplates
      if (!db.objectStoreNames.contains(STORES.WHATSAPP_TEMPLATES)) {
        const store = db.createObjectStore(STORES.WHATSAPP_TEMPLATES, { keyPath: 'id' });
        store.createIndex('key', 'key', { unique: true });
      }

      // 15. applicationSettings
      if (!db.objectStoreNames.contains(STORES.APPLICATION_SETTINGS)) {
        db.createObjectStore(STORES.APPLICATION_SETTINGS, { keyPath: 'id' });
      }

      // 16. auditLogs
      if (!db.objectStoreNames.contains(STORES.AUDIT_LOGS)) {
        const store = db.createObjectStore(STORES.AUDIT_LOGS, { keyPath: 'id' });
        store.createIndex('action', 'action', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = async () => {
      dbInstance = request.result;

      // Handle connection closing
      dbInstance.onversionchange = () => {
        dbInstance?.close();
        dbInstance = null;
      };

      // Seed initial data if newly created or empty
      try {
        await seedDefaultDataIfEmpty(dbInstance);
      } catch (err) {
        console.warn('[IndexedDB] Auto-seed warning:', err);
      }

      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });

  return dbInitPromise;
}

/**
 * Generic Transaction Execution
 */
export async function withTransaction<T>(
  storeNames: StoreName | StoreName[],
  mode: IDBTransactionMode,
  callback: (stores: Record<string, IDBObjectStore>, tx: IDBTransaction) => Promise<T>
): Promise<T> {
  const db = await openDatabase();
  const names = Array.isArray(storeNames) ? storeNames : [storeNames];
  const tx = db.transaction(names, mode);

  const storesMap: Record<string, IDBObjectStore> = {};
  for (const name of names) {
    storesMap[name] = tx.objectStore(name);
  }

  return new Promise<T>((resolve, reject) => {
    let result: T;
    let promiseResolved = false;

    callback(storesMap, tx)
      .then((res) => {
        result = res;
        promiseResolved = true;
      })
      .catch((err) => {
        tx.abort();
        reject(err);
      });

    tx.oncomplete = () => {
      if (promiseResolved) {
        resolve(result);
      } else {
        resolve(result);
      }
    };

    tx.onerror = () => {
      reject(tx.error || new Error('IndexedDB transaction failed.'));
    };

    tx.onabort = () => {
      reject(new Error('IndexedDB transaction was aborted.'));
    };
  });
}

/**
 * Basic CRUD helpers
 */
export async function getAllFromStore<T>(storeName: StoreName): Promise<T[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

export async function getByIdFromStore<T>(storeName: StoreName, id: string): Promise<T | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(id);
    req.onsuccess = () => resolve((req.result as T) || null);
    req.onerror = () => reject(req.error);
  });
}

export async function putInStore<T extends { id: string }>(storeName: StoreName, item: T): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(item);
    req.onsuccess = () => resolve(item);
    req.onerror = () => reject(req.error);
  });
}

export async function putBatchInStore<T extends { id: string }>(storeName: StoreName, items: T[]): Promise<void> {
  if (!items.length) return;
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    items.forEach(item => store.put(item));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteFromStore(storeName: StoreName, id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function clearStore(storeName: StoreName): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function countStore(storeName: StoreName): Promise<number> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Storage Quota Estimation
 */
export async function getStorageQuotaInfo(): Promise<{
  isAvailable: boolean;
  usedBytes: number;
  quotaBytes: number;
  usedFormatted: string;
  quotaFormatted: string;
  percentageUsed: number;
}> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const est = await navigator.storage.estimate();
      const used = est.usage || 0;
      const quota = est.quota || 0;
      const pct = quota > 0 ? (used / quota) * 100 : 0;

      const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      return {
        isAvailable: true,
        usedBytes: used,
        quotaBytes: quota,
        usedFormatted: formatBytes(used),
        quotaFormatted: formatBytes(quota),
        percentageUsed: parseFloat(pct.toFixed(2))
      };
    } catch {
      // ignore
    }
  }

  return {
    isAvailable: false,
    usedBytes: 0,
    quotaBytes: 0,
    usedFormatted: 'Not Supported',
    quotaFormatted: 'Unlimited (Browser Managed)',
    percentageUsed: 0
  };
}

/**
 * Export Entire IndexedDB Database to JSON payload
 */
export interface FullDatabaseBackup {
  metadata: {
    appName: 'Hamza Autos Workshop Management';
    database: string;
    schemaVersion: number;
    exportDate: string;
    exportTimestamp: number;
    recordCounts: Record<string, number>;
  };
  data: {
    customers: CustomerProfile[];
    motorcycles: MotorcycleProfile[];
    bookings: AppointmentBooking[];
    jobCards: JobCard[];
    inspections: BikeInspectionReport[];
    quotations: Quotation[];
    invoices: WorkshopInvoice[];
    payments: PaymentRecord[];
    inventory: SparePart[];
    inventoryMovements: InventoryMovementRecord[];
    maintenanceReminders: MaintenanceReminderRecord[];
    feedback: CustomerFeedbackRecord[];
    notifications: AppNotification[];
    whatsappTemplates: WhatsAppTemplate[];
    applicationSettings: ApplicationSettingRecord[];
    auditLogs: AuditLogRecord[];
  };
}

export async function exportAllData(): Promise<FullDatabaseBackup> {
  const storeNames = Object.values(STORES);
  const data: Record<string, any[]> = {};
  const recordCounts: Record<string, number> = {};

  for (const name of storeNames) {
    const records = await getAllFromStore(name);
    data[name] = records;
    recordCounts[name] = records.length;
  }

  return {
    metadata: {
      appName: 'Hamza Autos Workshop Management',
      database: DB_NAME,
      schemaVersion: DB_VERSION,
      exportDate: new Date().toISOString(),
      exportTimestamp: Date.now(),
      recordCounts
    },
    data: data as FullDatabaseBackup['data']
  };
}

/**
 * Validate and Import JSON Backup (Replace or Merge)
 */
export interface ImportPreviewSummary {
  isValid: boolean;
  error?: string;
  schemaVersion: number;
  exportDate: string;
  totalRecords: number;
  storeCounts: Record<string, number>;
}

export function validateBackupFile(content: any): ImportPreviewSummary {
  if (!content || typeof content !== 'object') {
    return { isValid: false, error: 'File is not a valid JSON object.', schemaVersion: 0, exportDate: '', totalRecords: 0, storeCounts: {} };
  }

  if (!content.metadata || !content.data) {
    return { isValid: false, error: 'Missing metadata or data envelope in backup file.', schemaVersion: 0, exportDate: '', totalRecords: 0, storeCounts: {} };
  }

  if (content.metadata.appName && !content.metadata.appName.includes('Hamza Autos')) {
    return { isValid: false, error: 'Backup belongs to an unrecognized application.', schemaVersion: 0, exportDate: '', totalRecords: 0, storeCounts: {} };
  }

  const storeCounts: Record<string, number> = {};
  let total = 0;

  for (const key of Object.values(STORES)) {
    const arr = content.data[key];
    if (Array.isArray(arr)) {
      storeCounts[key] = arr.length;
      total += arr.length;
    } else {
      storeCounts[key] = 0;
    }
  }

  return {
    isValid: true,
    schemaVersion: content.metadata.schemaVersion || 1,
    exportDate: content.metadata.exportDate || 'Unknown',
    totalRecords: total,
    storeCounts
  };
}

export async function importData(
  backup: FullDatabaseBackup,
  mode: 'replace' | 'merge'
): Promise<{ success: boolean; recordsImported: number; details: Record<string, number> }> {
  const validation = validateBackupFile(backup);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid backup structure');
  }

  // If replacing, clear all stores first
  if (mode === 'replace') {
    for (const name of Object.values(STORES)) {
      await clearStore(name);
    }
  }

  const details: Record<string, number> = {};
  let total = 0;

  for (const name of Object.values(STORES)) {
    const items = backup.data[name as keyof FullDatabaseBackup['data']] || [];
    if (Array.isArray(items) && items.length > 0) {
      await putBatchInStore(name, items);
      details[name] = items.length;
      total += items.length;
    } else {
      details[name] = 0;
    }
  }

  return {
    success: true,
    recordsImported: total,
    details
  };
}

/**
 * Clear All Local IndexedDB Stores
 */
export async function clearAllLocalData(): Promise<void> {
  for (const name of Object.values(STORES)) {
    await clearStore(name);
  }
}

/**
 * Seed Default Data if Database is completely new / empty
 */
async function seedDefaultDataIfEmpty(db: IDBDatabase): Promise<void> {
  const customerCount = await new Promise<number>((res) => {
    try {
      const tx = db.transaction(STORES.CUSTOMERS, 'readonly');
      const req = tx.objectStore(STORES.CUSTOMERS).count();
      req.onsuccess = () => res(req.result);
      req.onerror = () => res(0);
    } catch (e) {
      res(0);
    }
  });
  if (customerCount > 0) return; // Already has data

  console.log('[IndexedDB] Initializing default Hamza Autos data seed...');

  // 1. Settings
  const defaultSettings: ApplicationSettingRecord = {
    id: 'main_settings',
    businessName: 'Hamza Autos',
    phone: '+92 325 1814548',
    phoneRaw: '+923251814548',
    whatsappNumber: '+923251814548',
    operatingHours: '9:00 AM – 9:00 PM',
    operatingDays: 'Monday to Sunday (7 Days Open)',
    fullAddress: 'Abu Bakar Road, Near Ali Hajvery Marriage Hall, Badami Bagh, Lahore, Punjab 54000',
    taxPercentage: 0,
    slotCapacityPerHour: 2,
    autoBackupReminderDays: 7,
    currency: 'PKR',
    customerPortalPinRequired: false,
    seoTitle: 'Hamza Autos – Bike Mechanic & Motorcycle Repair Shop Badami Bagh Lahore',
    seoMetaDescription: 'Honest motorcycle mechanic in Badami Bagh Lahore on Abu Bakar Road. Engine rebuilds, carburetor tuning, genuine 4T oil changes, brake repairs.'
  };
  await putInStore(STORES.APPLICATION_SETTINGS, defaultSettings);

  // 2. WhatsApp Templates
  const defaultTemplates: WhatsAppTemplate[] = [
    {
      id: 'tpl-1',
      key: 'new_booking',
      name: 'New Booking Acknowledgement',
      description: 'Sent when customer books an appointment locally.',
      template: 'Salam {customerName}! We have noted your appointment request #{bookingNumber} for your {bikeBrand} {bikeModel} on {appointmentDate} at {appointmentTime}. Workshop Location: Abu Bakar Road, Badami Bagh, Lahore.',
      updatedAt: '2026-11-16'
    },
    {
      id: 'tpl-2',
      key: 'booking_confirmation',
      name: 'Booking Confirmation',
      description: 'Sent when workshop confirms the time slot.',
      template: 'Salam {customerName}! Your repair slot #{bookingNumber} at Hamza Autos Badami Bagh is CONFIRMED for {appointmentDate} at {appointmentTime}. Please arrive 10 minutes prior.',
      updatedAt: '2026-11-16'
    },
    {
      id: 'tpl-3',
      key: 'repair_status',
      name: 'Repair Status Update',
      description: 'Sent when job card milestone changes.',
      template: 'Salam {customerName}! Status update for Job Card #{jobCardNumber} ({bikeBrand} {bikeModel}): Current Milestone is "{repairStatus}". Estimated Completion: {completionDate}. Contact Hamza Autos: +923251814548.',
      updatedAt: '2026-11-16'
    },
    {
      id: 'tpl-4',
      key: 'quotation',
      name: 'Digital Quotation',
      description: 'Sent before starting disassembly with estimated costs.',
      template: 'Salam {customerName}! Your repair quotation #{quotationNumber} for {bikeBrand} {bikeModel} is ready: Labour: PKR {labourTotal}, Parts: PKR {partsTotal}. Total: PKR {totalAmount}. Please reply to approve.',
      updatedAt: '2026-11-16'
    },
    {
      id: 'tpl-5',
      key: 'ready_for_collection',
      name: 'Ready for Collection',
      description: 'Sent when bike passes quality testing and is ready for pickup.',
      template: 'Salam {customerName}! Your {bikeBrand} {bikeModel} is READY for collection at Hamza Autos Badami Bagh. Test ride and final QC completed. Total Bill: PKR {totalAmount}. Location: Abu Bakar Road.',
      updatedAt: '2026-11-16'
    },
    {
      id: 'tpl-6',
      key: 'invoice',
      name: 'Digital Invoice / Receipt',
      description: 'Sent upon delivery with payment breakdown.',
      template: 'Salam {customerName}! Thank you for choosing Hamza Autos. Invoice #{invoiceNumber} for {bikeBrand} {bikeModel}: Total PKR {totalAmount}, Paid: PKR {amountPaid}, Balance: PKR {remainingBalance}. Drive safe!',
      updatedAt: '2026-11-16'
    },
    {
      id: 'tpl-7',
      key: 'maintenance_reminder',
      name: 'Maintenance Service Reminder',
      description: 'Sent when periodic oil or tuning is due.',
      template: 'Salam {customerName}! Periodic maintenance ({reminderType}) is due for your {bikeBrand} {bikeModel}. Protect engine life in Lahore traffic with genuine 4T lubricant. Visit Hamza Autos Abu Bakar Road.',
      updatedAt: '2026-11-16'
    }
  ];
  await putBatchInStore(STORES.WHATSAPP_TEMPLATES, defaultTemplates);

  // 3. Customers
  const defaultCustomers: CustomerProfile[] = [
    {
      id: 'cust-1',
      name: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      area: 'Badami Bagh',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      registeredDate: '2026-10-15',
      optInReminders: true,
      totalSpent: 8500,
      totalVisits: 2
    },
    {
      id: 'cust-2',
      name: 'Muhammad Arshad',
      phoneNumber: '0300 1234567',
      area: 'Shadbagh',
      bikeBrand: 'Honda',
      bikeModel: 'CD 70 (2023)',
      registrationNumber: 'LEN-23-4412',
      registeredDate: '2026-10-20',
      optInReminders: true,
      totalSpent: 2200,
      totalVisits: 1
    },
    {
      id: 'cust-3',
      name: 'Zahid Hussain',
      phoneNumber: '0321 9876543',
      area: 'Misri Shah',
      bikeBrand: 'Yamaha',
      bikeModel: 'YBR 125G',
      registrationNumber: 'LEA-21-9081',
      registeredDate: '2026-11-01',
      optInReminders: true,
      totalSpent: 4500,
      totalVisits: 1
    }
  ];
  await putBatchInStore(STORES.CUSTOMERS, defaultCustomers);

  // 4. Motorcycles
  const defaultBikes: MotorcycleProfile[] = [
    {
      id: 'bike-1',
      customerId: 'cust-1',
      customerName: 'Tariq Mahmood',
      customerPhone: '0300 7654321',
      brand: 'Honda',
      model: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      engineCapacity: '125cc',
      mileage: 24500,
      color: 'Black',
      createdAt: '2026-10-15',
      updatedAt: '2026-11-10'
    },
    {
      id: 'bike-2',
      customerId: 'cust-2',
      customerName: 'Muhammad Arshad',
      customerPhone: '0300 1234567',
      brand: 'Honda',
      model: 'CD 70 (2023)',
      registrationNumber: 'LEN-23-4412',
      engineCapacity: '70cc',
      mileage: 14200,
      color: 'Red',
      createdAt: '2026-10-20',
      updatedAt: '2026-11-12'
    },
    {
      id: 'bike-3',
      customerId: 'cust-3',
      customerName: 'Zahid Hussain',
      customerPhone: '0321 9876543',
      brand: 'Yamaha',
      model: 'YBR 125G',
      registrationNumber: 'LEA-21-9081',
      engineCapacity: '125cc',
      mileage: 18900,
      color: 'Matte Grey',
      createdAt: '2026-11-01',
      updatedAt: '2026-11-10'
    }
  ];
  await putBatchInStore(STORES.MOTORCYCLES, defaultBikes);

  // 5. Inventory Spare Parts
  const defaultInventory: SparePart[] = [
    {
      id: 'part-1',
      sku: 'LUB-4T-20W50-1L',
      partNumber: 'OIL-20W50-1L',
      partName: 'Havoline 4T 20W-50 Engine Oil (1L Sealed)',
      category: 'Lubricants',
      compatibleBrands: ['Honda', 'Yamaha', 'Suzuki', 'United', 'Road Prince'],
      compatibleModels: ['All 70cc, 100cc, 125cc, 150cc'],
      purchasePrice: 950,
      sellingPrice: 1200,
      stockQuantity: 42,
      minStockAlert: 10,
      supplier: 'Caltex / Chevron Authorized Lahore',
      description: 'Factory-sealed high temperature shear stability lubricant for commuter bikes.'
    },
    {
      id: 'part-2',
      sku: 'LUB-4T-10W40-08L',
      partNumber: 'OIL-10W40-08L',
      partName: 'Genuine 4T 10W-40 Synthetic Blend (0.7L/0.8L)',
      category: 'Lubricants',
      compatibleBrands: ['Honda', 'United'],
      compatibleModels: ['CD 70', 'Dream 70', 'United 70'],
      purchasePrice: 800,
      sellingPrice: 1050,
      stockQuantity: 36,
      minStockAlert: 8,
      supplier: 'Atlas Honda Distributor',
      description: 'Optimal viscosity for CD70 engines during mild and winter seasons.'
    },
    {
      id: 'part-3',
      sku: 'SPK-NGK-C7HSA',
      partNumber: 'NGK-C7HSA-70',
      partName: 'NGK C7HSA Spark Plug (Genuine Japan Spec)',
      category: 'Electrical Parts',
      compatibleBrands: ['Honda', 'United', 'Road Prince'],
      compatibleModels: ['CD 70', 'Pridor 100', 'Chinese 70cc'],
      purchasePrice: 280,
      sellingPrice: 400,
      stockQuantity: 28,
      minStockAlert: 6,
      supplier: 'NGK Official Importer Badami Bagh',
      description: 'Pre-calibrated 0.7mm electrode gap for reliable cold morning ignition.'
    },
    {
      id: 'part-4',
      sku: 'BRK-SHOE-70-OEM',
      partNumber: 'BS-CD70-RR',
      partName: 'Asbestos-Free Heavy Brake Shoe Set (Front/Rear)',
      category: 'Brake Parts',
      compatibleBrands: ['Honda', 'United'],
      compatibleModels: ['CD 70', 'United 70', 'Road Prince 70'],
      purchasePrice: 380,
      sellingPrice: 600,
      stockQuantity: 22,
      minStockAlert: 5,
      supplier: 'Crown Lifan Lahore Depot',
      description: 'High friction coefficient with anti-fade spring set included.'
    },
    {
      id: 'part-5',
      sku: 'CHN-428H-104L',
      partNumber: 'CHN-428H-HD',
      partName: 'Heavy Duty 428H Drive Chain (Gold Roller)',
      category: 'Chains & Sprockets',
      compatibleBrands: ['Honda', 'Yamaha', 'Suzuki'],
      compatibleModels: ['CG 125', 'YBR 125', 'GS 150'],
      purchasePrice: 1400,
      sellingPrice: 1950,
      stockQuantity: 14,
      minStockAlert: 4,
      supplier: 'DID / KMC Lahore Dealer',
      description: 'Reinforced link plates resisting stretch on rough Lahore roads.'
    },
    {
      id: 'part-6',
      sku: 'CLT-DISC-CG125',
      partNumber: 'CL-CG125-5P',
      partName: 'Friction Clutch Plate Set (5 Plates CG 125)',
      category: 'Clutch Parts',
      compatibleBrands: ['Honda'],
      compatibleModels: ['CG 125', 'CG 125 Special Edition'],
      purchasePrice: 1200,
      sellingPrice: 1750,
      stockQuantity: 11,
      minStockAlert: 3,
      supplier: 'FCC Clutch Technologies',
      description: 'Cork-composite friction discs preventing slip during high throttle.'
    },
    {
      id: 'part-7',
      sku: 'PST-KIT-CG125-025',
      partNumber: 'PK-CG125-025',
      partName: 'Piston & Ring Kit (+0.25mm Overbore)',
      category: 'Engine Parts',
      compatibleBrands: ['Honda'],
      compatibleModels: ['CG 125'],
      purchasePrice: 2200,
      sellingPrice: 3100,
      stockQuantity: 4,
      minStockAlert: 2,
      supplier: 'Rik / NPR Piston Ring Corp',
      description: 'Precision Japanese spec ring set with molybdenum coating.'
    },
    {
      id: 'part-8',
      sku: 'FLT-AIR-CD70',
      partNumber: 'AF-CD70-OEM',
      partName: 'High Flow Polyurethane Air Filter Element',
      category: 'Filters',
      compatibleBrands: ['Honda', 'United'],
      compatibleModels: ['CD 70', 'Chinese 70cc'],
      purchasePrice: 150,
      sellingPrice: 280,
      stockQuantity: 30,
      minStockAlert: 6,
      supplier: 'Guard Filters Pakistan',
      description: 'Triple layer foam trapping fine dust particles in dry city air.'
    }
  ];
  await putBatchInStore(STORES.INVENTORY, defaultInventory);

  // 6. Bookings
  const defaultBookings: AppointmentBooking[] = [
    {
      id: 'bk-1',
      bookingNumber: 'HA-BK-2026-001',
      customerId: 'cust-2',
      motorcycleId: 'bike-2',
      customerName: 'Muhammad Arshad',
      phoneNumber: '0300 1234567',
      area: 'Badami Bagh',
      bikeBrand: 'Honda',
      bikeModel: 'CD 70 (2023)',
      registrationNumber: 'LEN-23-4412',
      serviceRequested: 'Bike Tuning & Fuel Economy Optimization',
      problemDescription: 'Poor petrol mileage, doing 35 km/l only. Needs carburetor ultrasonic cleaning.',
      appointmentDate: '2026-11-16',
      appointmentTime: '10:30 AM',
      status: 'Confirmed',
      internalNotes: 'Allotted Bay 1 with Ustad Tariq.',
      isLocallyRecorded: true,
      createdAt: '2026-11-14 14:00',
      updatedAt: '2026-11-15 10:15'
    },
    {
      id: 'bk-2',
      bookingNumber: 'HA-BK-2026-002',
      customerId: 'cust-3',
      motorcycleId: 'bike-3',
      customerName: 'Zahid Hussain',
      phoneNumber: '0321 9876543',
      area: 'Shadbagh',
      bikeBrand: 'Yamaha',
      bikeModel: 'YBR 125G',
      registrationNumber: 'LEA-21-9081',
      serviceRequested: 'Motorcycle Brake Repair & Shoe/Pad Replacement',
      problemDescription: 'Front hydraulic disc brake lever has lost pressure after riding over bumpy roads.',
      appointmentDate: '2026-11-16',
      appointmentTime: '02:30 PM',
      status: 'Pending',
      internalNotes: 'Check hydraulic fluid level and disc pads.',
      isLocallyRecorded: true,
      createdAt: '2026-11-15 16:30',
      updatedAt: '2026-11-15 16:30'
    }
  ];
  await putBatchInStore(STORES.BOOKINGS, defaultBookings);

  // 7. Job Cards
  const defaultJobCards: JobCard[] = [
    {
      id: 'jc-1',
      jobCardNumber: 'HA-JC-2026-001',
      bookingId: 'bk-1',
      customerId: 'cust-1',
      motorcycleId: 'bike-1',
      customerName: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      engineCapacity: '125cc',
      mileage: 24500,
      customerComplaint: 'Excessive white smoke from silencer, loss of power and engine overheating on circular road.',
      initialInspectionNotes: 'Piston ring leakage diagnosed; cylinder bore required. Head tappets out of clearance.',
      requiredServices: ['Motorcycle Engine Repair & Overhaul', 'Motorcycle Engine Oil Change & Filter Service'],
      labourItems: [
        { id: 'l-1', description: 'Engine Complete Disassembly, Bore & Overhaul Labour', amount: 3500 },
        { id: 'l-2', description: 'Tappet & Valve Clearance Calibration', amount: 700 }
      ],
      spareParts: [
        { id: 'p-1', partId: 'part-7', partName: 'Piston & Ring Kit (+0.25mm Overbore)', quantity: 1, unitPrice: 3100, total: 3100 },
        { id: 'p-2', partId: 'part-1', partName: 'Havoline 4T 20W-50 Engine Oil (1L Sealed)', quantity: 1, unitPrice: 1200, total: 1200 }
      ],
      labourCharges: 4200,
      partsCharges: 4300,
      estimatedCost: 8500,
      finalCost: 8500,
      assignedMechanicId: 'staff-1',
      assignedMechanicName: 'Ustad Tariq (Senior Engine Rebuilder)',
      createdDate: '2026-11-09 10:00',
      expectedCompletionDate: '2026-11-10 18:00',
      actualCompletionDate: '2026-11-10 17:30',
      repairStatus: 'Ready for Collection',
      photosBefore: ['assets/images/gallery/gallery-engine-rebuild.jpg'],
      photosAfter: ['assets/images/home/motorcycle-service-bay-presence.jpg'],
      internalNotes: 'Used genuine 0.25 oversize piston kit and 20W-50 4T lubricant. Tested on 5km road run - zero smoke.',
      invoiceId: 'inv-1',
      createdAt: '2026-11-09 10:00',
      updatedAt: '2026-11-10 17:30'
    }
  ];
  await putBatchInStore(STORES.JOB_CARDS, defaultJobCards);

  // 8. Inspections
  const defaultInspections: BikeInspectionReport[] = [
    {
      id: 'ins-1',
      inspectionNumber: 'HA-INS-2026-001',
      jobCardId: 'jc-1',
      jobCardNumber: 'HA-JC-2026-001',
      motorcycleId: 'bike-1',
      customerId: 'cust-1',
      customerName: 'Tariq Mahmood',
      customerPhone: '0300 7654321',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      mileage: 24500,
      inspectorName: 'Ustad Tariq',
      inspectionDate: '2026-11-09',
      overallCondition: 'Good',
      items: [
        { category: 'Engine', status: 'Good', notes: 'Freshly honed sleeve and new piston ring compression tested at 145 PSI.' },
        { category: 'Engine Oil', status: 'Good', notes: 'Fresh 20W-50 filled to upper dipstick mark.' },
        { category: 'Brakes', status: 'Needs Attention', notes: 'Front drum shoe lining at 40% thickness. Advised replacement in 2,000 km.' },
        { category: 'Front Tyre', status: 'Good', notes: 'Tread depth 3.2mm, air pressure set to 28 PSI.' },
        { category: 'Rear Tyre', status: 'Good', notes: 'Tread depth 3.8mm, air pressure set to 32 PSI.' },
        { category: 'Battery', status: 'Good', notes: '12V 5Ah electrolyte level normal, output 12.6V resting.' },
        { category: 'Headlight', status: 'Good', notes: 'High/low beam aligned to 15m throw.' },
        { category: 'Indicators', status: 'Good', notes: 'All 4 blinkers functioning at 80 pulses/min.' },
        { category: 'Electrical System', status: 'Good', notes: 'Rectifier delivering 14.1V charging at 3,000 RPM.' },
        { category: 'Chain & Sprocket', status: 'Good', notes: 'Free play adjusted to 25mm, lubricated with chain wax.' },
        { category: 'Clutch', status: 'Good', notes: 'Free play 3mm, smooth engagement.' },
        { category: 'Suspension', status: 'Good', notes: 'No fork seal leakage detected.' },
        { category: 'Steering', status: 'Good', notes: 'Cone set bearing free from notchiness.' },
        { category: 'Horn', status: 'Good', notes: 'Louder dual tone operational.' },
        { category: 'Fuel System', status: 'Good', notes: 'Petcock filter clean, zero fuel drip.' },
        { category: 'General Condition', status: 'Good', notes: 'Chassis nuts torqued to specification.' }
      ],
      mechanicObservations: 'Engine running smoothly post-overhaul. Road test showed crisp response and zero exhaust smoke.',
      recommendedRepairs: ['Schedule brake shoe replacement on next 2,000 km oil service.'],
      priority: 'Medium',
      createdAt: '2026-11-09 11:30'
    },
    {
      id: 'ins-2',
      inspectionNumber: 'HA-INSP-2026-002',
      jobCardId: 'jc-2',
      jobCardNumber: 'HA-JC-2026-002',
      motorcycleId: 'bike-2',
      customerId: 'cust-2',
      customerName: 'Muhammad Arshad',
      customerPhone: '0300 1234567',
      bikeBrand: 'Honda',
      bikeModel: 'CD 70 (2023)',
      registrationNumber: 'LEN-23-4412',
      mileage: 18450,
      inspectorName: 'Master Mechanic Hamza',
      inspectionDate: '2026-11-14',
      overallCondition: 'Good',
      maintenanceUrgency: 'Low',
      estimatedCost: 1200,
      technicianNotes: 'Routine 16-point safety check completed. Bike in roadworthy condition.',
      items: [
        { category: 'Engine Condition & Compression', status: 'Good', notes: 'Compression 130 PSI, zero tappet rattle.' },
        { category: 'Engine Oil Level & Viscosity', status: 'Good', notes: 'Fresh 20W-50 oil, level optimal.' },
        { category: 'Front & Rear Brake Shoes / Pads', status: 'Needs Attention', notes: 'Rear brake shoe wear at 50%. Cleaned drum.' },
        { category: 'Front Tyre Tread Depth & Pressure', status: 'Good', notes: 'Tread depth 3.5mm, 28 PSI.' },
        { category: 'Rear Tyre Tread Depth & Pressure', status: 'Good', notes: 'Tread depth 3.8mm, 32 PSI.' },
        { category: 'Battery Voltage & Terminal Health', status: 'Good', notes: 'Terminals cleaned and greased, 12.5V.' },
        { category: 'Headlight & High/Low Beam Focus', status: 'Good', notes: 'Beam properly aligned.' },
        { category: 'Turn Indicators & Hazard Warning', status: 'Good', notes: 'All blinkers operational.' },
        { category: 'Main Wiring Harness & CDI Ignition', status: 'Good', notes: 'No frayed wires, ignition timing crisp.' },
        { category: 'Drive Chain Tension & Sprocket Teeth', status: 'Good', notes: 'Slack adjusted to 25mm, lubricated.' },
        { category: 'Clutch Cable Freeplay & Friction Plates', status: 'Good', notes: 'Smooth engagement.' },
        { category: 'Front Telescopic & Rear Shock Absorbers', status: 'Good', notes: 'Dampers intact, no oil leaks.' },
        { category: 'Steering Cone Bearings & Handle Alignment', status: 'Good', notes: 'Smooth steering rotation.' },
        { category: 'Electric Horn & Handlebar Switchgear', status: 'Good', notes: 'Horn crisp, switches responsive.' },
        { category: 'Fuel Line, Petcock & Carburetor / EFI', status: 'Good', notes: 'Ultrasonic cleaned carburetor.' },
        { category: 'Chassis Frame, Nuts, Bolts & Roadworthiness', status: 'Good', notes: 'All chassis bolts torqued.' }
      ],
      recommendedRepairs: ['Inspect rear brake shoes at next 1,500 km.'],
      priority: 'Low',
      createdAt: '2026-11-14 10:30'
    }
  ];
  await putBatchInStore(STORES.INSPECTIONS, defaultInspections);

  // 9. Quotations
  const defaultQuotations: Quotation[] = [
    {
      id: 'qt-1',
      quotationNumber: 'HA-QT-2026-001',
      jobCardId: 'jc-1',
      jobCardNumber: 'HA-JC-2026-001',
      customerId: 'cust-1',
      customerName: 'Tariq Mahmood',
      customerPhone: '0300 7654321',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      labourItems: [
        { id: 'ql-1', description: 'Engine Complete Disassembly & Cylinder Boring', amount: 3500 },
        { id: 'ql-2', description: 'Tappet & Valve Seat Calibration', amount: 700 }
      ],
      partsItems: [
        { id: 'qp-1', partId: 'part-7', partName: 'Piston & Ring Kit (+0.25mm Overbore)', quantity: 1, unitPrice: 3100, total: 3100 },
        { id: 'qp-2', partId: 'part-1', partName: 'Havoline 4T 20W-50 Engine Oil (1L Sealed)', quantity: 1, unitPrice: 1200, total: 1200 }
      ],
      labourTotal: 4200,
      partsTotal: 4300,
      discount: 0,
      additionalCharges: 0,
      taxPercentage: 0,
      taxAmount: 0,
      totalAmount: 8500,
      status: 'Converted to Invoice',
      validUntil: '2026-11-16',
      notes: 'Includes genuine 4T lubricant and hone calibration.',
      createdAt: '2026-11-09 10:15',
      updatedAt: '2026-11-10 17:35'
    }
  ];
  await putBatchInStore(STORES.QUOTATIONS, defaultQuotations);

  // 10. Invoices
  const defaultInvoices: WorkshopInvoice[] = [
    {
      id: 'inv-1',
      invoiceNumber: 'HA-INV-2026-001',
      jobCardNumber: 'HA-JC-2026-001',
      quotationNumber: 'HA-QT-2026-001',
      customerId: 'cust-1',
      invoiceDate: '2026-11-10',
      customerName: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      customerAddress: 'Abu Bakar Road, Badami Bagh',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      labourItems: [
        { id: 'il-1', description: 'Engine Complete Disassembly, Bore & Overhaul Labour', amount: 3500 },
        { id: 'il-2', description: 'Tappet & Valve Clearance Calibration', amount: 700 }
      ],
      partsItems: [
        { id: 'ip-1', partId: 'part-7', partName: 'Piston & Ring Kit (+0.25mm Overbore)', quantity: 1, unitPrice: 3100, total: 3100 },
        { id: 'ip-2', partId: 'part-1', partName: 'Havoline 4T 20W-50 Engine Oil (1L Sealed)', quantity: 1, unitPrice: 1200, total: 1200 }
      ],
      additionalCharges: 0,
      discount: 0,
      totalAmount: 8500,
      amountPaid: 8500,
      remainingBalance: 0,
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      notes: 'Payment received in full upon delivery. 30-day workmanship warranty included.',
    }
  ];
  await putBatchInStore(STORES.INVOICES, defaultInvoices);

  // 11. Payments
  const defaultPayments: PaymentRecord[] = [
    {
      id: 'pay-1',
      invoiceId: 'inv-1',
      invoiceNumber: 'HA-INV-2026-001',
      customerId: 'cust-1',
      customerName: 'Tariq Mahmood',
      amount: 8500,
      paymentDate: '2026-11-10 17:40',
      method: 'Cash',
      transactionReference: 'CASH-COUNTER-001',
      receivedBy: 'Hamza (Proprietor)',
      notes: 'Customer cleared full bill at workshop counter.',
      createdAt: '2026-11-10 17:40'
    }
  ];
  await putBatchInStore(STORES.PAYMENTS, defaultPayments);

  // 12. Maintenance Reminders
  const defaultReminders: MaintenanceReminderRecord[] = [
    {
      id: 'rem-1',
      motorcycleId: 'bike-1',
      customerId: 'cust-1',
      customerName: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      bikeBrand: 'Honda',
      bikeModel: 'CG 125 (2022)',
      registrationNumber: 'LEB-22-1082',
      reminderType: 'Engine Oil Change',
      lastServiceDate: '2026-11-10',
      lastMileage: 24500,
      nextDueDate: '2026-12-10',
      nextDueMileage: 25700,
      reminderNotes: 'Post-overhaul 1,200 km run-in oil replacement.',
      status: 'Upcoming',
      createdAt: '2026-11-10'
    },
    {
      id: 'rem-2',
      motorcycleId: 'bike-2',
      customerId: 'cust-2',
      customerName: 'Muhammad Arshad',
      phoneNumber: '0300 1234567',
      bikeBrand: 'Honda',
      bikeModel: 'CD 70 (2023)',
      registrationNumber: 'LEN-23-4412',
      reminderType: 'General Service',
      lastServiceDate: '2026-10-20',
      lastMileage: 14200,
      nextDueDate: '2026-11-20',
      nextDueMileage: 15400,
      reminderNotes: 'Periodic tappet inspection and carburetor balance.',
      status: 'Upcoming',
      createdAt: '2026-10-20'
    }
  ];
  await putBatchInStore(STORES.MAINTENANCE_REMINDERS, defaultReminders);

  // 13. Feedback
  const defaultFeedback: CustomerFeedbackRecord[] = [
    {
      id: 'fb-1',
      customerName: 'Tariq Mahmood',
      phoneNumber: '0300 7654321',
      bookingOrJobCardRef: 'HA-JC-2026-001',
      overallRating: 5,
      serviceQualityRating: 5,
      staffBehaviourRating: 5,
      workQualityRating: 5,
      comment: 'Very professional overhaul on my CG 125. White smoke completely stopped and pickup is like brand new. Transparent pricing on Abu Bakar Road.',
      status: 'Approved',
      isFeatured: true,
      createdAt: '2026-11-11 10:00',
      approvedAt: '2026-11-11 12:00',
      approvedBy: 'Hamza (Admin)'
    },
    {
      id: 'fb-2',
      customerName: 'Muhammad Arshad',
      phoneNumber: '0300 1234567',
      bookingOrJobCardRef: 'HA-BK-2026-001',
      overallRating: 5,
      serviceQualityRating: 5,
      staffBehaviourRating: 5,
      workQualityRating: 5,
      comment: 'Carburetor ultrasonic tuning restored my CD70 mileage from 35 km/l to 55 km/l! Honest mechanics with real tools.',
      status: 'Approved',
      isFeatured: true,
      createdAt: '2026-11-14 18:30',
      approvedAt: '2026-11-14 19:00',
      approvedBy: 'Hamza (Admin)'
    }
  ];
  await putBatchInStore(STORES.FEEDBACK, defaultFeedback);

  // 14. Notifications
  const defaultNotifications: AppNotification[] = [
    {
      id: 'notif-1',
      title: 'Local-First Storage Active',
      message: 'Hamza Autos is running on browser IndexedDB with zero database servers required.',
      type: 'system',
      read: false,
      createdAt: '2026-11-16 09:00'
    },
    {
      id: 'notif-2',
      title: 'Piston Kit Low Stock Alert',
      message: 'Piston & Ring Kit (+0.25mm Overbore) has only 4 units remaining (Min Alert: 2).',
      type: 'low_stock',
      link: '#admin/inventory',
      read: false,
      createdAt: '2026-11-16 09:30'
    }
  ];
  await putBatchInStore(STORES.NOTIFICATIONS, defaultNotifications);

  // 15. Audit Logs
  const defaultAudit: AuditLogRecord = {
    id: 'aud-1',
    action: 'INITIALIZE_DATABASE',
    entity: 'SYSTEM',
    entityId: 'hamza_autos_db',
    details: 'Initialized 16 local IndexedDB object stores with default Badami Bagh records.',
    timestamp: new Date().toISOString(),
    user: 'System'
  };
  await putInStore(STORES.AUDIT_LOGS, defaultAudit);

  console.log('[IndexedDB] Database initialized and seeded successfully.');
}
