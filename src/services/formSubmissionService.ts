/**
 * Hamza Autos - Unified Public Form Submission Client Service
 * Bridges public website forms directly to Central Server File Storage
 * with offline resilience and local synchronization.
 * Abu Bakar Road, Badami Bagh, Lahore | +92 325 1814548
 */

import { bookingService } from './bookingService';
import { customerService } from './customerService';
import { feedbackService } from './feedbackService';

export interface BookingSubmissionPayload {
  customerName: string;
  phone: string;
  alternatePhone?: string;
  serviceType: string;
  preferredDate: string;
  preferredTime?: string;
  bikeMake?: string;
  bikeModel?: string;
  registrationNumber?: string;
  notes?: string;
  source?: string;
}

export interface ContactSubmissionPayload {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  source?: string;
}

export interface FeedbackSubmissionPayload {
  customerName: string;
  customerPhone?: string;
  bikeModel?: string;
  serviceType?: string;
  rating: number;
  comment: string;
  recommendToFriend?: boolean;
}

export class FormSubmissionService {
  /**
   * Submit a Booking Request
   * Posts to /api/bookings and mirrors to IndexedDB for local offline support
   */
  static async submitBooking(payload: BookingSubmissionPayload): Promise<{ success: boolean; referenceNumber: string; message?: string }> {
    let referenceNumber = `BK-${Date.now().toString(36).toUpperCase()}`;

    // 1. Post to Server API (writes to storage/booking-submissions.json & storage/inquiries.json)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.booking) {
          referenceNumber = data.booking.referenceNumber || data.booking.id || referenceNumber;
        }
      }
    } catch (err) {
      console.warn('[FormSubmissionService] Server submission failed, falling back to local storage:', err);
    }

    // 2. Also record in local IndexedDB for immediate offline access
    try {
      await bookingService.create({
        customerName: payload.customerName,
        customerPhone: payload.phone,
        bikeModel: `${payload.bikeMake || ''} ${payload.bikeModel || ''}`.trim() || 'Motorcycle',
        serviceType: payload.serviceType,
        preferredDate: payload.preferredDate,
        preferredTimeSlot: payload.preferredTime || 'Morning (9 AM - 1 PM)',
        notes: payload.notes || '',
        status: 'pending',
        source: payload.source || 'website-booking-modal'
      });
    } catch (e) {
      console.warn('[FormSubmissionService] Local IndexedDB mirror skipped:', e);
    }

    return {
      success: true,
      referenceNumber,
      message: 'Booking request submitted successfully! Master Mechanic Hamza will contact you shortly.'
    };
  }

  /**
   * Submit Contact Form
   * Posts to /api/contact and mirrors to central inquiries inbox
   */
  static async submitContact(payload: ContactSubmissionPayload): Promise<{ success: boolean; id: string; message: string }> {
    let id = `CNT-${Date.now().toString(36).toUpperCase()}`;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.submission) {
          id = data.submission.id || id;
        }
      }
    } catch (err) {
      console.warn('[FormSubmissionService] Server contact submission failed:', err);
    }

    // Also mirror to customer service in IndexedDB
    try {
      await customerService.createOrUpdateFromBooking({
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        notes: `Contact form inquiry: ${payload.subject || 'General'} - ${payload.message}`
      });
    } catch (e) {
      // ignore
    }

    return {
      success: true,
      id,
      message: 'Thank you for reaching out! We have received your message.'
    };
  }

  /**
   * Submit Customer Feedback / Review
   */
  static async submitFeedback(payload: FeedbackSubmissionPayload): Promise<{ success: boolean; id: string; message: string }> {
    let id = `FB-${Date.now().toString(36).toUpperCase()}`;

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.feedback) {
          id = data.feedback.id || id;
        }
      }
    } catch (err) {
      console.warn('[FormSubmissionService] Server feedback submission failed:', err);
    }

    // Mirror to IndexedDB
    try {
      await feedbackService.submitFeedback({
        customerName: payload.customerName,
        customerPhone: payload.customerPhone || '',
        bikeModel: payload.bikeModel || 'Motorcycle',
        serviceType: payload.serviceType || 'General Service',
        rating: payload.rating,
        feedbackText: payload.comment,
        isPublic: false // Pending admin moderation
      });
    } catch (e) {
      // ignore
    }

    return {
      success: true,
      id,
      message: 'Thank you for your feedback! It will appear on our website after review.'
    };
  }
}
