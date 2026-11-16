/**
 * Job Card Service - Feature 2: Digital Repair Job Card Management
 * Local-First IndexedDB persistence, status progression, and inventory integration
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  STORES
} from './storageService';
import { JobCard, RepairStatus } from '../types';
import { customerService } from './customerService';
import { motorcycleService } from './motorcycleService';
import { inventoryService } from './inventoryService';

export const JOB_CARD_STATUSES: RepairStatus[] = [
  'Bike Received',
  'Initial Inspection',
  'Diagnosis',
  'Waiting for Customer Approval',
  'Waiting for Spare Parts',
  'Repair in Progress',
  'Quality Inspection',
  'Ready for Collection',
  'Delivered',
  'Cancelled'
];

export const jobCardService = {
  async getAll(): Promise<JobCard[]> {
    const list = await getAllFromStore<JobCard>(STORES.JOB_CARDS);
    return list.sort((a, b) => b.createdDate.localeCompare(a.createdDate));
  },

  async getById(id: string): Promise<JobCard | null> {
    return getByIdFromStore<JobCard>(STORES.JOB_CARDS, id);
  },

  async getByNumber(jobCardNumber: string): Promise<JobCard | null> {
    const clean = jobCardNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.find(j => j.jobCardNumber.toUpperCase() === clean) || null;
  },

  async getByCustomerId(customerId: string): Promise<JobCard[]> {
    const all = await this.getAll();
    return all.filter(j => j.customerId === customerId);
  },

  async getByPhone(phone: string): Promise<JobCard[]> {
    const clean = phone.replace(/[\s\-\(\)\+]/g, '').slice(-10);
    const all = await this.getAll();
    return all.filter(j => j.phoneNumber.replace(/[\s\-\(\)\+]/g, '').slice(-10) === clean);
  },

  /**
   * Generate Next Unique Reference: HA-JC-YYYY-XXX
   */
  async generateJobCardNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const all = await this.getAll();
    const prefix = `HA-JC-${year}-`;
    const nums = all
      .filter(j => j.jobCardNumber.startsWith(prefix))
      .map(j => parseInt(j.jobCardNumber.replace(prefix, ''), 10))
      .filter(n => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `${prefix}${String(nextSeq).padStart(3, '0')}`;
  },

  /**
   * Create Digital Job Card with customer & motorcycle linkage
   */
  async create(data: {
    bookingId?: string;
    customerName: string;
    phoneNumber: string;
    area?: string;
    bikeBrand: string;
    bikeModel: string;
    registrationNumber?: string;
    engineCapacity?: string;
    mileage?: number;
    customerComplaint: string;
    initialInspectionNotes?: string;
    requiredServices: string[];
    labourItems?: { id: string; description: string; amount: number }[];
    spareParts?: { id: string; partId?: string; partName: string; quantity: number; unitPrice: number; total: number }[];
    estimatedCost?: number;
    finalCost?: number;
    assignedMechanicId?: string;
    assignedMechanicName?: string;
    expectedCompletionDate?: string;
    internalNotes?: string;
    photosBefore?: string[];
    photosAfter?: string[];
  }): Promise<JobCard> {
    // 1. Link or create customer
    const customer = await customerService.findOrCreateFromActivity({
      name: data.customerName,
      phoneNumber: data.phoneNumber,
      area: data.area,
      bikeBrand: data.bikeBrand,
      bikeModel: data.bikeModel,
      registrationNumber: data.registrationNumber
    });

    // 2. Link or create motorcycle
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

    const jobCardNumber = await this.generateJobCardNumber();
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const labour = data.labourItems || [];
    const parts = data.spareParts || [];

    const labourCharges = labour.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const partsCharges = parts.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const totalCalculated = labourCharges + partsCharges;

    // Deduct stock if parts are allocated
    if (parts.length > 0) {
      await inventoryService.consumeStockForJob(
        parts,
        'jobCard',
        jobCardNumber,
        data.assignedMechanicName || 'Workshop Mechanic'
      );
    }

    const jobCard: JobCard = {
      id: `jc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      jobCardNumber,
      bookingId: data.bookingId,
      customerId: customer.id,
      motorcycleId: motorcycle?.id,
      customerName: data.customerName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      bikeBrand: data.bikeBrand,
      bikeModel: data.bikeModel,
      registrationNumber: data.registrationNumber?.trim().toUpperCase(),
      customerComplaint: data.customerComplaint.trim(),
      initialInspectionNotes: data.initialInspectionNotes?.trim() || 'Visual check and road test pending.',
      requiredServices: data.requiredServices,
      labourItems: labour,
      spareParts: parts,
      labourCharges,
      partsCharges,
      estimatedCost: data.estimatedCost || totalCalculated,
      finalCost: data.finalCost || totalCalculated,
      assignedMechanicId: data.assignedMechanicId,
      assignedMechanicName: data.assignedMechanicName || 'Ustad Tariq (Senior Engine Rebuilder)',
      createdDate: now,
      expectedCompletionDate: data.expectedCompletionDate || now.slice(0, 10),
      repairStatus: 'Bike Received',
      photosBefore: data.photosBefore || [],
      photosAfter: data.photosAfter || [],
      internalNotes: data.internalNotes?.trim() || '',
      createdAt: now,
      updatedAt: now
    };

    await putInStore(STORES.JOB_CARDS, jobCard);
    return jobCard;
  },

  async update(jobCard: JobCard): Promise<JobCard> {
    jobCard.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    await putInStore(STORES.JOB_CARDS, jobCard);
    return jobCard;
  },

  async updateStatus(id: string, newStatus: RepairStatus, notes?: string): Promise<JobCard | null> {
    const job = await this.getById(id);
    if (!job) return null;

    const previousStatus = job.repairStatus;
    job.repairStatus = newStatus;

    if (newStatus === 'Delivered' && !job.actualCompletionDate) {
      job.actualCompletionDate = new Date().toISOString().replace('T', ' ').slice(0, 16);
    }

    if (notes) {
      job.internalNotes = (job.internalNotes ? job.internalNotes + '\n' : '') + `[${newStatus}]: ${notes}`;
    }

    // If cancelled, restore allocated spare parts back to inventory
    if (newStatus === 'Cancelled' && previousStatus !== 'Cancelled' && job.spareParts?.length) {
      await inventoryService.restoreStockForJob(
        job.spareParts,
        'jobCard',
        job.jobCardNumber,
        'Job Card Cancelled - Restored Stock'
      );
    }

    job.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    await putInStore(STORES.JOB_CARDS, job);
    return job;
  },

  async delete(id: string): Promise<void> {
    const job = await this.getById(id);
    if (job && job.spareParts?.length && job.repairStatus !== 'Delivered') {
      // Restore allocated parts
      await inventoryService.restoreStockForJob(
        job.spareParts,
        'jobCard',
        job.jobCardNumber,
        'Job Card Deleted - Restored Stock'
      );
    }
    await deleteFromStore(STORES.JOB_CARDS, id);
  }
};
