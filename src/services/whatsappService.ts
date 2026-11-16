/**
 * WhatsApp Service - Feature 4: WhatsApp Automation & Click-to-Chat Generation
 * Official Number: +92 325 1814548 (wa.me/923251814548)
 * Explicit user-triggered click-to-chat links with template interpolation
 */
import {
  getAllFromStore,
  getByIdFromStore,
  putInStore,
  STORES
} from './storageService';
import { WhatsAppTemplate } from '../types';

export const OFFICIAL_WHATSAPP_NUMBER = '923251814548';
export const OFFICIAL_WHATSAPP_DISPLAY = '+92 325 1814548';

export const whatsappService = {
  async getAllTemplates(): Promise<WhatsAppTemplate[]> {
    return getAllFromStore<WhatsAppTemplate>(STORES.WHATSAPP_TEMPLATES);
  },

  async getTemplateByKey(key: WhatsAppTemplate['key']): Promise<WhatsAppTemplate | null> {
    const all = await this.getAllTemplates();
    return all.find(t => t.key === key) || null;
  },

  async updateTemplate(template: WhatsAppTemplate): Promise<WhatsAppTemplate> {
    template.updatedAt = new Date().toISOString().slice(0, 10);
    await putInStore(STORES.WHATSAPP_TEMPLATES, template);
    return template;
  },

  /**
   * Interpolate template string with variables
   */
  interpolate(templateStr: string, variables: Record<string, string | number | undefined>): string {
    let result = templateStr;
    for (const [key, val] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      result = result.split(placeholder).join(String(val || ''));
    }
    return result;
  },

  /**
   * Build universal WhatsApp click-to-chat link
   */
  buildLink(message: string, targetPhone?: string): string {
    const phone = targetPhone ? targetPhone.replace(/[\s\-\(\)\+]/g, '') : OFFICIAL_WHATSAPP_NUMBER;
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
  },

  buildChatLink(message: string, targetPhone?: string): string {
    return this.buildLink(message, targetPhone);
  },

  /**
   * Contextual Message Builders
   */
  async buildBookingMessage(booking: {
    bookingNumber: string;
    customerName: string;
    bikeBrand: string;
    bikeModel: string;
    appointmentDate: string;
    appointmentTime: string;
    serviceRequested: string;
  }): Promise<string> {
    const tpl = await this.getTemplateByKey('new_booking');
    if (tpl) {
      return this.interpolate(tpl.template, booking);
    }
    return `Salam Hamza Autos! I have recorded booking #${booking.bookingNumber} for my ${booking.bikeBrand} ${booking.bikeModel} on ${booking.appointmentDate} at ${booking.appointmentTime} for ${booking.serviceRequested}. Please confirm receipt.`;
  },

  async buildRepairStatusMessage(job: {
    jobCardNumber: string;
    customerName: string;
    bikeBrand: string;
    bikeModel: string;
    repairStatus: string;
    expectedCompletionDate?: string;
  }): Promise<string> {
    const tpl = await this.getTemplateByKey('repair_status');
    if (tpl) {
      return this.interpolate(tpl.template, {
        ...job,
        completionDate: job.expectedCompletionDate || 'Same-day'
      });
    }
    return `Salam ${job.customerName}! Status update for Job Card #${job.jobCardNumber} (${job.bikeBrand} ${job.bikeModel}): Current status is "${job.repairStatus}". Contact Hamza Autos: +923251814548.`;
  },

  async buildQuotationMessage(quote: {
    quotationNumber: string;
    customerName: string;
    bikeBrand: string;
    bikeModel: string;
    labourTotal: number;
    partsTotal: number;
    totalAmount: number;
  }): Promise<string> {
    const tpl = await this.getTemplateByKey('quotation');
    if (tpl) {
      return this.interpolate(tpl.template, quote);
    }
    return `Salam ${quote.customerName}! Your repair quotation #${quote.quotationNumber} for ${quote.bikeBrand} ${quote.bikeModel} is ready: Labour: PKR ${quote.labourTotal}, Parts: PKR ${quote.partsTotal}. Total: PKR ${quote.totalAmount}. Please reply to approve.`;
  },

  async buildReadyForCollectionMessage(job: {
    jobCardNumber: string;
    customerName: string;
    bikeBrand: string;
    bikeModel: string;
    totalAmount: number;
  }): Promise<string> {
    const tpl = await this.getTemplateByKey('ready_for_collection');
    if (tpl) {
      return this.interpolate(tpl.template, job);
    }
    return `Salam ${job.customerName}! Your ${job.bikeBrand} ${job.bikeModel} (Job Card #${job.jobCardNumber}) is READY for collection at Hamza Autos Badami Bagh. Final bill: PKR ${job.totalAmount}. Location: Abu Bakar Road.`;
  },

  async buildInvoiceMessage(inv: {
    invoiceNumber: string;
    customerName: string;
    bikeBrand: string;
    bikeModel: string;
    totalAmount: number;
    amountPaid: number;
    remainingBalance: number;
  }): Promise<string> {
    const tpl = await this.getTemplateByKey('invoice');
    if (tpl) {
      return this.interpolate(tpl.template, inv);
    }
    return `Salam ${inv.customerName}! Thank you for visiting Hamza Autos. Invoice #${inv.invoiceNumber} for ${inv.bikeBrand} ${inv.bikeModel}: Total PKR ${inv.totalAmount}, Paid: PKR ${inv.amountPaid}, Balance: PKR ${inv.remainingBalance}. Abu Bakar Road, Badami Bagh.`;
  },

  async buildReminderMessage(rem: {
    customerName: string;
    bikeBrand: string;
    bikeModel: string;
    reminderType: string;
  }): Promise<string> {
    const tpl = await this.getTemplateByKey('maintenance_reminder');
    if (tpl) {
      return this.interpolate(tpl.template, rem);
    }
    return `Salam ${rem.customerName}! Friendly maintenance reminder for your ${rem.bikeBrand} ${rem.bikeModel}: Periodic service (${rem.reminderType}) is due. Protect your engine with genuine 4T lubricant at Hamza Autos Badami Bagh.`;
  },

  buildInspectionLink(inspectionNumber: string, condition: string, phone?: string): string {
    const msg = `Salam Hamza Autos! Inquiring about 16-Point Inspection Report #${inspectionNumber} (Condition: ${condition}). Please advise on next steps.`;
    return this.buildChatLink(msg, phone);
  },

  buildBookingLink(bookingNumber: string, customerName: string, service: string, date: string, time: string): string {
    const msg = `Salam Hamza Autos! Regarding appointment booking #${bookingNumber} for ${service} on ${date} at ${time}. Customer: ${customerName}.`;
    return this.buildChatLink(msg);
  },

  buildQuotationLink(quotationNumber: string, customerName: string, netTotal: number, phone?: string): string {
    const msg = `Salam Hamza Autos! Regarding Quotation #${quotationNumber} for PKR ${(netTotal || 0).toLocaleString()}. Customer: ${customerName}.`;
    return this.buildChatLink(msg, phone);
  },

  buildReminderLink(customerName: string, reminderType: string, dueDate: string, phone?: string): string {
    const msg = `Salam Hamza Autos! I received a reminder for ${reminderType} due on ${dueDate}. I would like to reserve a bay for my bike. Name: ${customerName}.`;
    return this.buildChatLink(msg, phone);
  }
};
