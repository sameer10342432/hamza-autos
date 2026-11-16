/**
 * Invoice Service - Feature 5: Digital Invoicing & Billing
 * Local-First IndexedDB persistence in PKR currency with payment balance tracking
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  STORES
} from './storageService';
import { WorkshopInvoice, PaymentStatus, PaymentMethod, InvoiceLabourItem, InvoicePartItem } from '../types';
import { customerService } from './customerService';
import { paymentService } from './paymentService';

export const invoiceService = {
  async getAll(): Promise<WorkshopInvoice[]> {
    const list = await getAllFromStore<WorkshopInvoice>(STORES.INVOICES);
    return list.sort((a, b) => b.invoiceDate.localeCompare(a.invoiceDate));
  },

  async getById(id: string): Promise<WorkshopInvoice | null> {
    return getByIdFromStore<WorkshopInvoice>(STORES.INVOICES, id);
  },

  async getByNumber(invoiceNumber: string): Promise<WorkshopInvoice | null> {
    const clean = invoiceNumber.trim().toUpperCase();
    const all = await this.getAll();
    return all.find(inv => inv.invoiceNumber.toUpperCase() === clean) || null;
  },

  async getByCustomerId(customerId: string): Promise<WorkshopInvoice[]> {
    const all = await this.getAll();
    return all.filter(inv => inv.customerId === customerId);
  },

  async getByPhone(phone: string): Promise<WorkshopInvoice[]> {
    const clean = phone.replace(/[\s\-\(\)\+]/g, '').slice(-10);
    const all = await this.getAll();
    return all.filter(inv => inv.phoneNumber.replace(/[\s\-\(\)\+]/g, '').slice(-10) === clean);
  },

  async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const all = await this.getAll();
    const prefix = `HA-INV-${year}-`;
    const nums = all
      .filter(i => i.invoiceNumber.startsWith(prefix))
      .map(i => parseInt(i.invoiceNumber.replace(prefix, ''), 10))
      .filter(n => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `${prefix}${String(nextSeq).padStart(3, '0')}`;
  },

  async create(data: {
    jobCardNumber?: string;
    quotationNumber?: string;
    customerId?: string;
    customerName: string;
    phoneNumber: string;
    customerAddress?: string;
    bikeBrand: string;
    bikeModel: string;
    registrationNumber?: string;
    labourItems: InvoiceLabourItem[];
    partsItems: InvoicePartItem[];
    additionalCharges?: number;
    additionalChargesDescription?: string;
    discount?: number;
    amountPaid?: number;
    paymentMethod?: PaymentMethod;
    notes?: string;
  }): Promise<WorkshopInvoice> {
    const invoiceNumber = await this.generateInvoiceNumber();
    const now = new Date().toISOString().slice(0, 10);

    const labour = data.labourItems || [];
    const parts = data.partsItems || [];

    const labourTotal = labour.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const partsTotal = parts.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const subtotal = labourTotal + partsTotal + (Number(data.additionalCharges) || 0);
    const discount = Number(data.discount) || 0;
    const totalAmount = Math.max(0, subtotal - discount);

    const amountPaid = Math.min(totalAmount, Math.max(0, Number(data.amountPaid) || 0));
    const remainingBalance = Math.max(0, totalAmount - amountPaid);

    let paymentStatus: PaymentStatus = 'Unpaid';
    if (amountPaid >= totalAmount && totalAmount > 0) {
      paymentStatus = 'Paid';
    } else if (amountPaid > 0) {
      paymentStatus = 'Partially Paid';
    }

    const invoice: WorkshopInvoice = {
      id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      invoiceNumber,
      jobCardNumber: data.jobCardNumber,
      quotationNumber: data.quotationNumber,
      customerId: data.customerId,
      invoiceDate: now,
      customerName: data.customerName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      customerAddress: data.customerAddress || 'Abu Bakar Road, Badami Bagh',
      bikeBrand: data.bikeBrand,
      bikeModel: data.bikeModel,
      registrationNumber: data.registrationNumber?.trim().toUpperCase(),
      labourItems: labour,
      partsItems: parts,
      additionalCharges: Number(data.additionalCharges) || 0,
      additionalChargesDescription: data.additionalChargesDescription,
      discount,
      totalAmount,
      amountPaid,
      remainingBalance,
      paymentStatus,
      paymentMethod: data.paymentMethod || 'Cash',
      notes: data.notes?.trim() || '30-day workmanship warranty included on overhauled components.'
    };

    await putInStore(STORES.INVOICES, invoice);

    // If an initial payment was made, record payment entry
    if (amountPaid > 0) {
      await paymentService.recordPayment({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerId: invoice.customerId,
        customerName: invoice.customerName,
        amount: amountPaid,
        method: invoice.paymentMethod,
        notes: `Initial payment on invoice creation`
      });
    }

    return invoice;
  },

  async recordPaymentOnInvoice(invoiceId: string, amount: number, method: PaymentMethod, notes?: string): Promise<WorkshopInvoice | null> {
    const invoice = await this.getById(invoiceId);
    if (!invoice) return null;

    const validAmount = Math.max(0, Number(amount) || 0);
    invoice.amountPaid = Math.min(invoice.totalAmount, invoice.amountPaid + validAmount);
    invoice.remainingBalance = Math.max(0, invoice.totalAmount - invoice.amountPaid);

    if (invoice.amountPaid >= invoice.totalAmount) {
      invoice.paymentStatus = 'Paid';
    } else if (invoice.amountPaid > 0) {
      invoice.paymentStatus = 'Partially Paid';
    }

    invoice.paymentMethod = method;

    await putInStore(STORES.INVOICES, invoice);

    // Record payment receipt
    await paymentService.recordPayment({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      amount: validAmount,
      method,
      notes: notes || 'Invoice balance payment'
    });

    return invoice;
  },

  async update(invoice: WorkshopInvoice): Promise<WorkshopInvoice> {
    await putInStore(STORES.INVOICES, invoice);
    return invoice;
  },

  async delete(id: string): Promise<void> {
    await deleteFromStore(STORES.INVOICES, id);
  }
};
