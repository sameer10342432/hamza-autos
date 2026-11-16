/**
 * Payment Service - Feature 5 & 8: Payment Records & Transaction History
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  STORES
} from './storageService';
import { PaymentRecord, PaymentMethod } from '../types';
import { customerService } from './customerService';

export const paymentService = {
  async getAll(): Promise<PaymentRecord[]> {
    const list = await getAllFromStore<PaymentRecord>(STORES.PAYMENTS);
    return list.sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));
  },

  async getById(id: string): Promise<PaymentRecord | null> {
    return getByIdFromStore<PaymentRecord>(STORES.PAYMENTS, id);
  },

  async getByInvoiceId(invoiceId: string): Promise<PaymentRecord[]> {
    const all = await this.getAll();
    return all.filter(p => p.invoiceId === invoiceId);
  },

  async getByCustomerId(customerId: string): Promise<PaymentRecord[]> {
    const all = await this.getAll();
    return all.filter(p => p.customerId === customerId);
  },

  async recordPayment(data: {
    invoiceId: string;
    invoiceNumber: string;
    customerId?: string;
    customerName: string;
    amount: number;
    method: PaymentMethod;
    transactionReference?: string;
    receivedBy?: string;
    notes?: string;
  }): Promise<PaymentRecord> {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const rec: PaymentRecord = {
      id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      invoiceId: data.invoiceId,
      invoiceNumber: data.invoiceNumber,
      customerId: data.customerId,
      customerName: data.customerName,
      amount: Number(data.amount) || 0,
      paymentDate: now,
      method: data.method,
      transactionReference: data.transactionReference || `REC-${Date.now().toString().slice(-6)}`,
      receivedBy: data.receivedBy || 'Hamza Autos Counter',
      notes: data.notes || '',
      createdAt: now
    };

    await putInStore(STORES.PAYMENTS, rec);

    // Update customer totalSpent
    if (data.customerId) {
      const cust = await customerService.getById(data.customerId);
      if (cust) {
        cust.totalSpent = (cust.totalSpent || 0) + rec.amount;
        await customerService.update(cust);
      }
    }

    return rec;
  },

  async delete(id: string): Promise<void> {
    await deleteFromStore(STORES.PAYMENTS, id);
  }
};
