/**
 * Inspection Service - Feature 3: Bike Health Inspection Report
 * & Feature 6: My Bike Health Customer Interface Data
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  STORES
} from './storageService';
import { BikeInspectionReport, InspectionItem } from '../types';

export const INSPECTION_CATEGORIES = [
  'Engine',
  'Engine Oil',
  'Brakes',
  'Front Tyre',
  'Rear Tyre',
  'Battery',
  'Headlight',
  'Indicators',
  'Electrical System',
  'Chain & Sprocket',
  'Clutch',
  'Suspension',
  'Steering',
  'Horn',
  'Fuel System',
  'General Condition'
];

export const inspectionService = {
  async getAll(): Promise<BikeInspectionReport[]> {
    const list = await getAllFromStore<BikeInspectionReport>(STORES.INSPECTIONS);
    return list.sort((a, b) => b.inspectionDate.localeCompare(a.inspectionDate));
  },

  async getById(id: string): Promise<BikeInspectionReport | null> {
    return getByIdFromStore<BikeInspectionReport>(STORES.INSPECTIONS, id);
  },

  async getByNumber(inspectionNumber: string): Promise<BikeInspectionReport | null> {
    const clean = inspectionNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.find(i => i.inspectionNumber.toUpperCase() === clean) || null;
  },

  async getByJobCardId(jobCardId: string): Promise<BikeInspectionReport[]> {
    const all = await this.getAll();
    return all.filter(i => i.jobCardId === jobCardId);
  },

  async getByCustomerId(customerId: string): Promise<BikeInspectionReport[]> {
    const all = await this.getAll();
    return all.filter(i => i.customerId === customerId);
  },

  async getByMotorcycleId(motorcycleId: string): Promise<BikeInspectionReport[]> {
    const all = await this.getAll();
    return all.filter(i => i.motorcycleId === motorcycleId);
  },

  async getLatestForMotorcycle(motorcycleId: string): Promise<BikeInspectionReport | null> {
    const reports = await this.getByMotorcycleId(motorcycleId);
    return reports.length > 0 ? reports[0] : null;
  },

  async generateInspectionNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const all = await this.getAll();
    const prefix = `HA-INS-${year}-`;
    const nums = all
      .filter(i => i.inspectionNumber.startsWith(prefix))
      .map(i => parseInt(i.inspectionNumber.replace(prefix, ''), 10))
      .filter(n => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `${prefix}${String(nextSeq).padStart(3, '0')}`;
  },

  async create(data: {
    jobCardId?: string;
    jobCardNumber?: string;
    motorcycleId?: string;
    customerId?: string;
    customerName: string;
    customerPhone: string;
    bikeBrand: string;
    bikeModel: string;
    registrationNumber?: string;
    mileage?: number;
    inspectorName?: string;
    overallCondition?: 'Excellent' | 'Good' | 'Fair' | 'Critical / Needs Immediate Attention';
    items: InspectionItem[];
    mechanicObservations?: string;
    recommendedRepairs?: string[];
    priority?: 'Low' | 'Medium' | 'High' | 'Immediate Safety Risk';
  }): Promise<BikeInspectionReport> {
    const inspectionNumber = await this.generateInspectionNumber();
    const now = new Date().toISOString().slice(0, 10);

    const report: BikeInspectionReport = {
      id: `ins-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      inspectionNumber,
      jobCardId: data.jobCardId,
      jobCardNumber: data.jobCardNumber,
      motorcycleId: data.motorcycleId,
      customerId: data.customerId,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      bikeBrand: data.bikeBrand,
      bikeModel: data.bikeModel,
      registrationNumber: data.registrationNumber?.trim().toUpperCase(),
      mileage: data.mileage || 0,
      inspectorName: data.inspectorName || 'Ustad Tariq (Senior Inspector)',
      inspectionDate: now,
      overallCondition: data.overallCondition || 'Good',
      items: data.items,
      mechanicObservations: data.mechanicObservations || 'Visual check and component testing completed on Abu Bakar Road service lift.',
      recommendedRepairs: data.recommendedRepairs || [],
      priority: data.priority || 'Medium',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    await putInStore(STORES.INSPECTIONS, report);
    return report;
  },

  async update(report: BikeInspectionReport): Promise<BikeInspectionReport> {
    await putInStore(STORES.INSPECTIONS, report);
    return report;
  },

  async delete(id: string): Promise<void> {
    await deleteFromStore(STORES.INSPECTIONS, id);
  }
};
