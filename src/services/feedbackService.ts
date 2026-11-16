/**
 * Feedback Service - Feature 10: Customer Feedback & Review System
 * Local-First IndexedDB persistence with admin moderation pipeline
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  deleteFromStore,
  STORES
} from './storageService';
import { CustomerFeedbackRecord } from '../types';

export const feedbackService = {
  async getAll(): Promise<CustomerFeedbackRecord[]> {
    const list = await getAllFromStore<CustomerFeedbackRecord>(STORES.FEEDBACK);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getPublicApproved(): Promise<CustomerFeedbackRecord[]> {
    const all = await this.getAll();
    return all.filter(f => f.status === 'Approved');
  },

  async getById(id: string): Promise<CustomerFeedbackRecord | null> {
    return getByIdFromStore<CustomerFeedbackRecord>(STORES.FEEDBACK, id);
  },

  async getByCustomerId(customerId: string): Promise<CustomerFeedbackRecord[]> {
    const all = await this.getAll();
    return all.filter(f => (f as any).customerId === customerId || (f as any).phoneNumber === customerId);
  },

  async submit(data: {
    customerName: string;
    phoneNumber?: string;
    bookingOrJobCardRef?: string;
    overallRating: number;
    serviceQualityRating?: number;
    staffBehaviourRating?: number;
    workQualityRating?: number;
    comment: string;
    photoUrl?: string;
  }): Promise<CustomerFeedbackRecord> {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const feedback: CustomerFeedbackRecord = {
      id: `fb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerName: data.customerName.trim(),
      phoneNumber: data.phoneNumber?.trim(),
      bookingOrJobCardRef: data.bookingOrJobCardRef?.trim().toUpperCase(),
      overallRating: Math.max(1, Math.min(5, Number(data.overallRating) || 5)),
      serviceQualityRating: Math.max(1, Math.min(5, Number(data.serviceQualityRating) || 5)),
      staffBehaviourRating: Math.max(1, Math.min(5, Number(data.staffBehaviourRating) || 5)),
      workQualityRating: Math.max(1, Math.min(5, Number(data.workQualityRating) || 5)),
      comment: data.comment.trim(),
      photoUrl: data.photoUrl,
      status: 'Pending Approval', // Requires admin moderation
      isFeatured: false,
      createdAt: now
    };

    await putInStore(STORES.FEEDBACK, feedback);
    return feedback;
  },

  async updateStatus(id: string, status: CustomerFeedbackRecord['status'], approvedBy = 'Admin'): Promise<CustomerFeedbackRecord | null> {
    const feedback = await this.getById(id);
    if (!feedback) return null;

    feedback.status = status;
    if (status === 'Approved') {
      feedback.approvedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
      feedback.approvedBy = approvedBy;
    }

    await putInStore(STORES.FEEDBACK, feedback);
    return feedback;
  },

  async toggleFeatured(id: string): Promise<CustomerFeedbackRecord | null> {
    const feedback = await this.getById(id);
    if (!feedback) return null;
    feedback.isFeatured = !feedback.isFeatured;
    await putInStore(STORES.FEEDBACK, feedback);
    return feedback;
  },

  async delete(id: string): Promise<void> {
    await deleteFromStore(STORES.FEEDBACK, id);
  }
};
