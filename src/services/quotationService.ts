/**
 * Quotation Service - Feature 5: Digital Quotations & Estimates
 * Local-First IndexedDB persistence in PKR currency
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  STORES
} from './storageService';
import { Quotation, QuotationStatus, InvoiceLabourItem, InvoicePartItem } from '../types';

export const quotationService = {
  async getAll(): Promise<Quotation[]> {
    const list = await getAllFromStore<Quotation>(STORES.QUOTATIONS);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getById(id: string): Promise<Quotation | null> {
    return getByIdFromStore<Quotation>(STORES.QUOTATIONS, id);
  },

  async getByNumber(quotationNumber: string): Promise<Quotation | null> {
    const clean = quotationNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.find(q => q.quotationNumber.toUpperCase() === clean) || null;
  },

  async getByCustomerId(customerId: string): Promise<Quotation[]> {
    const all = await this.getAll();
    return all.filter(q => q.customerId === customerId);
  },

  async generateQuotationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const all = await this.getAll();
    const prefix = `HA-QT-${year}-`;
    const nums = all
      .filter(q => q.quotationNumber.startsWith(prefix))
      .map(q => parseInt(q.quotationNumber.replace(prefix, ''), 10))
      .filter(n => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `${prefix}${String(nextSeq).padStart(3, '0')}`;
  },

  async create(data: {
    jobCardId?: string;
    jobCardNumber?: string;
    customerId?: string;
    customerName: string;
    customerPhone: string;
    bikeBrand: string;
    bikeModel: string;
    registrationNumber?: string;
    labourItems: InvoiceLabourItem[];
    partsItems: InvoicePartItem[];
    discount?: number;
    additionalCharges?: number;
    additionalChargesDescription?: string;
    taxPercentage?: number;
    validDays?: number;
    notes?: string;
  }): Promise<Quotation> {
    const quotationNumber = await this.generateQuotationNumber();
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const labour = data.labourItems || [];
    const parts = data.partsItems || [];

    const labourTotal = labour.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const partsTotal = parts.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const subtotal = labourTotal + partsTotal + (Number(data.additionalCharges) || 0);
    const discount = Number(data.discount) || 0;
    const taxableAmount = Math.max(0, subtotal - discount);

    const taxPercentage = Number(data.taxPercentage) || 0;
    const taxAmount = Math.round((taxableAmount * taxPercentage) / 100);
    const totalAmount = taxableAmount + taxAmount;

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + (data.validDays || 7));
    const validUntil = validUntilDate.toISOString().slice(0, 10);

    const quote: Quotation = {
      id: `qt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      quotationNumber,
      jobCardId: data.jobCardId,
      jobCardNumber: data.jobCardNumber,
      customerId: data.customerId,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      bikeBrand: data.bikeBrand,
      bikeModel: data.bikeModel,
      registrationNumber: data.registrationNumber?.trim().toUpperCase(),
      labourItems: labour,
      partsItems: parts,
      labourTotal,
      partsTotal,
      discount,
      additionalCharges: Number(data.additionalCharges) || 0,
      additionalChargesDescription: data.additionalChargesDescription,
      taxPercentage,
      taxAmount,
      totalAmount,
      status: 'Draft',
      validUntil,
      notes: data.notes?.trim() || 'Genuine parts & 30-day workmanship warranty included.',
      createdAt: now,
      updatedAt: now
    };

    await putInStore(STORES.QUOTATIONS, quote);
    return quote;
  },

  async updateStatus(id: string, status: QuotationStatus): Promise<Quotation | null> {
    const quote = await this.getById(id);
    if (!quote) return null;
    quote.status = status;
    quote.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    await putInStore(STORES.QUOTATIONS, quote);
    return quote;
  },

  async update(quote: Quotation): Promise<Quotation> {
    quote.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    await putInStore(STORES.QUOTATIONS, quote);
    return quote;
  },

  async delete(id: string): Promise<void> {
    await deleteFromStore(STORES.QUOTATIONS, id);
  }
};
