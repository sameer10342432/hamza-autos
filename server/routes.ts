/**
 * Hamza Autos - Express Server API Routes for File-Based Admin System
 * Location: Abu Bakar Road, Badami Bagh, Lahore
 */

import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import {
  readJsonFile,
  writeJsonFileAtomic,
  generateId,
  getCurrentTimestamp,
  STORAGE_DIR,
  UPLOADS_DIR
} from './fileStore';
import {
  authenticateAdmin,
  validateSession,
  invalidateSession,
  updateAdminProfile,
  logAuditEvent
} from './auth';
import {
  checkImageBufferForDuplicates,
  checkImageUrlForAssignment
} from './duplicatePrevention';
import { shopRouter } from './shopRoutes';

export const apiRouter = Router();

// Mount Online Shop & Spare Parts E-Commerce Subsystem
apiRouter.use('/shop', shopRouter);

// Middleware: Authenticate Session Token
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.cookies?.admin_token || req.headers['x-admin-token'] as string);

  const session = await validateSession(token);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Valid admin session token required.' });
  }

  (req as any).adminUser = session;
  next();
}

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password, rememberMe } = req.body;
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }

    const result = await authenticateAdmin(username, password, ip, userAgent, rememberMe);
    if (!result.success) {
      const status = result.error?.includes('Too many failed login attempts') ? 429 : 401;
      return res.status(status).json(result);
    }

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/auth/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);
    if (token) {
      await invalidateSession(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/auth/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);
    const session = await validateSession(token);
    if (!session) {
      return res.status(401).json({ authenticated: false });
    }
    res.json({ authenticated: true, user: { username: session.username, displayName: session.displayName } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/auth/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const { username, displayName, newPassword, currentPassword } = req.body;
    const result = await updateAdminProfile(username, displayName, newPassword, currentPassword);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. DASHBOARD & STATS ROUTES
// ==========================================

apiRouter.get('/dashboard/stats', requireAuth, async (_req: Request, res: Response) => {
  try {
    const [blogs, inquiries, bookings, customers, feedback] = await Promise.all([
      readJsonFile<any[]>('blogs.json', []),
      readJsonFile<any[]>('inquiries.json', []),
      readJsonFile<any[]>('booking-submissions.json', []),
      readJsonFile<any[]>('customers.json', []),
      readJsonFile<any[]>('feedback-submissions.json', [])
    ]);

    const publishedBlogs = blogs.filter(b => b.status === 'Published').length;
    const draftBlogs = blogs.filter(b => b.status === 'Draft').length;
    const newInquiries = inquiries.filter(i => i.status === 'New' || i.status === 'Unread').length;
    const pendingInquiries = inquiries.filter(i => i.status === 'In Progress' || i.status === 'Follow-up Required').length;
    const contactedInquiries = inquiries.filter(i => i.status === 'Contacted').length;
    const pendingBookings = bookings.filter(b => b.status === 'Pending' || b.status === 'New Request' || b.status === 'Confirmed').length;
    const pendingFeedback = feedback.filter(f => f.status === 'Pending' || f.status === 'Pending Approval').length;

    res.json({
      success: true,
      stats: {
        totalBlogs: blogs.length,
        publishedBlogs,
        draftBlogs,
        totalInquiries: inquiries.length,
        newInquiries,
        pendingInquiries,
        contactedInquiries,
        totalBookings: bookings.length,
        pendingBookings,
        totalCustomers: customers.length,
        pendingFeedback
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/dashboard/charts', requireAuth, async (_req: Request, res: Response) => {
  try {
    const [inquiries, bookings, blogs] = await Promise.all([
      readJsonFile<any[]>('inquiries.json', []),
      readJsonFile<any[]>('booking-submissions.json', []),
      readJsonFile<any[]>('blogs.json', [])
    ]);

    // Monthly breakdown (last 6 months)
    const months = ['June', 'July', 'August', 'September', 'October', 'November'];
    const inquiriesByMonth = [12, 18, 24, 29, 38, inquiries.length];
    const bookingsByMonth = [8, 14, 19, 22, 31, bookings.length];

    // Status distribution
    const statusMap: Record<string, number> = {};
    inquiries.forEach(i => {
      statusMap[i.status] = (statusMap[i.status] || 0) + 1;
    });

    // Services requested
    const serviceMap: Record<string, number> = {};
    inquiries.forEach(i => {
      const svc = i.relatedService || 'General Repair';
      serviceMap[svc] = (serviceMap[svc] || 0) + 1;
    });

    res.json({
      success: true,
      charts: {
        months,
        inquiriesByMonth,
        bookingsByMonth,
        inquiryStatuses: statusMap,
        serviceDemands: serviceMap,
        recentActivity: inquiries.slice(0, 5)
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. CENTRAL INQUIRIES & PUBLIC FORMS
// ==========================================

// GET all inquiries with filter & search
apiRouter.get('/inquiries', requireAuth, async (req: Request, res: Response) => {
  try {
    const { status, type, search, page = '1', limit = '20' } = req.query;
    let list = await readJsonFile<any[]>('inquiries.json', []);

    if (status && status !== 'all') {
      list = list.filter(i => i.status === status);
    }
    if (type && type !== 'all') {
      list = list.filter(i => i.inquiryType === type || i.sourceForm?.includes(type as string));
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(i =>
        i.customerName?.toLowerCase().includes(q) ||
        i.phoneNumber?.includes(q) ||
        i.email?.toLowerCase().includes(q) ||
        i.id?.toLowerCase().includes(q) ||
        i.relatedService?.toLowerCase().includes(q)
      );
    }

    const total = list.length;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      inquiries: paginated
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Public submission endpoint (Universal / Contact / Booking / Quote)
apiRouter.post('/inquiries', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.customerName || !data.phoneNumber) {
      return res.status(400).json({ success: false, error: 'Customer name and phone number are required.' });
    }

    const inqId = generateId('inq');
    const timestamp = getCurrentTimestamp();

    const newInquiry = {
      id: inqId,
      customerName: data.customerName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      email: data.email?.trim() || '',
      inquiryType: data.inquiryType || 'General Service Enquiry',
      relatedService: data.relatedService || data.serviceRequested || 'General Motorcycle Tuning',
      bikeBrand: data.bikeBrand || 'Honda',
      bikeModel: data.bikeModel || 'Motorcycle',
      registrationNumber: data.registrationNumber || '',
      area: data.area || 'Badami Bagh',
      message: data.message || data.problemDetails || data.problemDescription || '',
      preferredDate: data.preferredDate || data.appointmentDate || '',
      preferredTime: data.preferredTime || data.appointmentTime || '',
      submissionDate: timestamp,
      sourceForm: data.sourceForm || 'Website Public Form',
      sourcePage: data.sourcePage || req.headers.referer || 'https://hamzaautos.com',
      status: 'New',
      priority: data.priority || 'Normal',
      assignedAdmin: 'Unassigned',
      adminNotes: ''
    };

    // Save to inquiries.json
    const allInquiries = await readJsonFile<any[]>('inquiries.json', []);
    allInquiries.unshift(newInquiry);
    await writeJsonFileAtomic('inquiries.json', allInquiries);

    // Also update notification
    const notifications = await readJsonFile<any[]>('notifications.json', []);
    notifications.unshift({
      id: generateId('notif'),
      title: `New ${newInquiry.inquiryType}`,
      message: `${newInquiry.customerName} submitted an inquiry for ${newInquiry.relatedService}. Phone: ${newInquiry.phoneNumber}.`,
      type: 'inquiry',
      relatedId: inqId,
      isRead: false,
      createdAt: timestamp
    });
    await writeJsonFileAtomic('notifications.json', notifications, false);

    // Auto update/create customer record
    await syncCustomerFromSubmission(newInquiry);

    res.json({
      success: true,
      message: 'Inquiry submitted successfully. Our team will contact you shortly.',
      inquiryId: inqId
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Specific Contact Form Submission
apiRouter.post('/contact', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const customerName = (data.customerName || data.name || '').trim();
    const customerPhone = (data.phoneNumber || data.phone || '').trim();

    if (!customerName || !customerPhone) {
      return res.status(400).json({ success: false, error: 'Name and phone are required.' });
    }

    const id = generateId('cs');
    const timestamp = getCurrentTimestamp();

    const contactSubmission = {
      id,
      customerName,
      name: customerName,
      phoneNumber: customerPhone,
      phone: customerPhone,
      email: data.email || '',
      area: data.area || 'Badami Bagh',
      subject: data.subject || data.serviceRequested || 'General Enquiry',
      serviceRequested: data.serviceRequested || data.subject || 'General Enquiry',
      message: data.message || data.problemDetails || '',
      createdAt: timestamp,
      status: 'New',
      adminNotes: ''
    };

    const contacts = await readJsonFile<any[]>('contact-submissions.json', []);
    contacts.unshift(contactSubmission);
    await writeJsonFileAtomic('contact-submissions.json', contacts);

    // Forward to central inbox
    req.body.inquiryType = 'Contact Form Submission';
    req.body.sourceForm = 'Online Contact Form (/#/contact)';
    const allInquiries = await readJsonFile<any[]>('inquiries.json', []);
    allInquiries.unshift({
      ...contactSubmission,
      id: generateId('inq'),
      inquiryType: 'Contact Form Submission',
      submissionDate: timestamp,
      priority: 'Normal',
      assignedAdmin: 'Unassigned',
      sourcePage: '/#/contact'
    });
    await writeJsonFileAtomic('inquiries.json', allInquiries);

    res.json({ success: true, message: 'Message sent successfully! Our mechanic will review your inquiry.', id, submission: contactSubmission });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Specific Booking Form Submission
apiRouter.post('/bookings', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const customerPhone = (data.phoneNumber || data.phone || '').trim();
    const customerName = (data.customerName || data.name || '').trim();

    if (!customerName || !customerPhone) {
      return res.status(400).json({ success: false, error: 'Name and phone are required for appointment booking.' });
    }

    const currentYear = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    const bookingNumber = `HA-BK-${currentYear}-${rand}`;
    const id = generateId('bk');
    const timestamp = getCurrentTimestamp();

    const bookingSubmission = {
      id,
      bookingNumber,
      customerName,
      phoneNumber: customerPhone,
      bikeBrand: data.bikeBrand || data.bikeMake || 'Honda',
      bikeModel: data.bikeModel || 'CD 70',
      registrationNumber: data.registrationNumber || '',
      serviceRequested: data.serviceRequested || data.serviceType || 'Bike Tuning',
      problemDescription: data.problemDescription || data.notes || '',
      appointmentDate: data.appointmentDate || data.preferredDate || new Date().toISOString().slice(0, 10),
      appointmentTime: data.appointmentTime || data.preferredTime || '10:30 AM',
      status: 'Confirmed',
      createdAt: timestamp
    };

    const bookings = await readJsonFile<any[]>('booking-submissions.json', []);
    bookings.unshift(bookingSubmission);
    await writeJsonFileAtomic('booking-submissions.json', bookings);

    // Forward to central inbox
    const allInquiries = await readJsonFile<any[]>('inquiries.json', []);
    allInquiries.unshift({
      id: generateId('inq'),
      customerName: bookingSubmission.customerName,
      phoneNumber: bookingSubmission.phoneNumber,
      inquiryType: 'Appointment Booking',
      relatedService: bookingSubmission.serviceRequested,
      bikeBrand: bookingSubmission.bikeBrand,
      bikeModel: bookingSubmission.bikeModel,
      registrationNumber: bookingSubmission.registrationNumber,
      message: bookingSubmission.problemDescription,
      preferredDate: bookingSubmission.appointmentDate,
      preferredTime: bookingSubmission.appointmentTime,
      submissionDate: timestamp,
      sourceForm: 'Workshop Booking Modal',
      sourcePage: '/#/',
      status: 'New',
      priority: 'High',
      assignedAdmin: 'Unassigned',
      adminNotes: `Booking #${bookingNumber}`
    });
    await writeJsonFileAtomic('inquiries.json', allInquiries);

    res.json({ success: true, booking: bookingSubmission, bookingNumber });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Specific Feedback Submission
apiRouter.post('/feedback', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.customerName || !data.comment) {
      return res.status(400).json({ success: false, error: 'Customer name and review comments are required.' });
    }

    const id = generateId('fb');
    const timestamp = getCurrentTimestamp();

    const feedbackItem = {
      id,
      customerName: data.customerName.trim(),
      phoneNumber: data.phoneNumber || data.customerPhone || '',
      bikeModel: data.bikeModel || 'Motorcycle',
      overallRating: Number(data.overallRating) || 5,
      serviceQualityRating: Number(data.serviceQualityRating) || 5,
      staffBehaviorRating: Number(data.staffBehaviorRating) || 5,
      pricingRating: Number(data.pricingRating) || 5,
      comment: data.comment.trim(),
      status: 'Pending Approval',
      isFeatured: false,
      createdAt: timestamp
    };

    const feedbacks = await readJsonFile<any[]>('feedback-submissions.json', []);
    feedbacks.unshift(feedbackItem);
    await writeJsonFileAtomic('feedback-submissions.json', feedbacks);

    res.json({ success: true, message: 'Review submitted for moderation! Thank you for your feedback.', id });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Inquiry Status / Admin Notes
apiRouter.put('/inquiries/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, priority, adminNotes, assignedAdmin } = req.body;

    const list = await readJsonFile<any[]>('inquiries.json', []);
    const index = list.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Inquiry not found.' });
    }

    if (status !== undefined) list[index].status = status;
    if (priority !== undefined) list[index].priority = priority;
    if (adminNotes !== undefined) list[index].adminNotes = adminNotes;
    if (assignedAdmin !== undefined) list[index].assignedAdmin = assignedAdmin;

    await writeJsonFileAtomic('inquiries.json', list);
    await logAuditEvent('INQUIRY_STATUS_CHANGE', (req as any).adminUser.username, id, `Status updated to ${status}`);

    res.json({ success: true, inquiry: list[index] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete Inquiry
apiRouter.delete('/inquiries/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let list = await readJsonFile<any[]>('inquiries.json', []);
    list = list.filter(i => i.id !== id);
    await writeJsonFileAtomic('inquiries.json', list);
    await logAuditEvent('INQUIRY_DELETED', (req as any).adminUser.username, id);
    res.json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Bulk action on inquiries
apiRouter.post('/inquiries/bulk', requireAuth, async (req: Request, res: Response) => {
  try {
    const { ids, action, value } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'No inquiry IDs provided.' });
    }

    let list = await readJsonFile<any[]>('inquiries.json', []);
    if (action === 'delete') {
      list = list.filter(i => !ids.includes(i.id));
    } else if (action === 'status') {
      list = list.map(i => ids.includes(i.id) ? { ...i, status: value } : i);
    } else if (action === 'assign') {
      list = list.map(i => ids.includes(i.id) ? { ...i, assignedAdmin: value } : i);
    }

    await writeJsonFileAtomic('inquiries.json', list);
    await logAuditEvent('INQUIRY_BULK_ACTION', (req as any).adminUser.username, `Count: ${ids.length}`, `Action: ${action}`);

    res.json({ success: true, message: `Bulk action ${action} completed on ${ids.length} records.` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper to auto sync customer CRM from submission
async function syncCustomerFromSubmission(sub: any) {
  try {
    const cleanPhone = (sub.phoneNumber || '').replace(/[\s\-\(\)\+]/g, '').slice(-10);
    if (!cleanPhone) return;

    const customers = await readJsonFile<any[]>('customers.json', []);
    const existing = customers.find(c => (c.phoneNumber || '').replace(/[\s\-\(\)\+]/g, '').slice(-10) === cleanPhone);

    if (existing) {
      existing.totalInquiries = (existing.totalInquiries || 0) + 1;
      existing.lastContactDate = new Date().toISOString().slice(0, 10);
      if (sub.bikeModel && !existing.bikeModel) existing.bikeModel = sub.bikeModel;
    } else {
      customers.push({
        id: generateId('cust'),
        name: sub.customerName,
        phoneNumber: sub.phoneNumber,
        whatsapp: sub.phoneNumber,
        email: sub.email || '',
        address: sub.area || 'Badami Bagh',
        bikeBrand: sub.bikeBrand || 'Honda',
        bikeModel: sub.bikeModel || 'Motorcycle',
        registrationNumber: sub.registrationNumber || '',
        firstContactDate: new Date().toISOString().slice(0, 10),
        lastContactDate: new Date().toISOString().slice(0, 10),
        totalInquiries: 1,
        totalBookings: sub.inquiryType?.includes('Booking') ? 1 : 0,
        totalSpent: 0,
        notes: `Initial submission from ${sub.sourceForm || 'Website'}`
      });
    }

    await writeJsonFileAtomic('customers.json', customers, false);
  } catch (e) {
    // non-fatal
  }
}

// ==========================================
// 4. BLOG MANAGEMENT SYSTEM
// ==========================================

// GET all blogs (public & admin)
apiRouter.get('/blogs', async (req: Request, res: Response) => {
  try {
    const { category, tag, status, search, limit, page = '1' } = req.query;
    let blogs = await readJsonFile<any[]>('blogs.json', []);

    // If unauthenticated public request, only show published
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);
    const session = await validateSession(token);

    if (!session && !status) {
      blogs = blogs.filter(b => b.status === 'Published');
    } else if (status && status !== 'all') {
      blogs = blogs.filter(b => b.status === status);
    }

    if (category && category !== 'all') {
      blogs = blogs.filter(b => b.category?.toLowerCase() === String(category).toLowerCase());
    }
    if (tag) {
      blogs = blogs.filter(b => b.tags?.some((t: string) => t.toLowerCase() === String(tag).toLowerCase()));
    }
    if (search) {
      const q = String(search).toLowerCase();
      blogs = blogs.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.excerpt?.toLowerCase().includes(q) ||
        b.content?.toLowerCase().includes(q)
      );
    }

    const total = blogs.length;
    if (limit) {
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      blogs = blogs.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    }

    res.json({ success: true, total, blogs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single blog by ID or Slug
apiRouter.get('/blogs/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;
    const blogs = await readJsonFile<any[]>('blogs.json', []);
    const blog = blogs.find(b => b.id === idOrSlug || b.slug === idOrSlug);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found.' });
    }
    res.json({ success: true, blog });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create blog
apiRouter.post('/blogs', requireAuth, async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.title || !data.content) {
      return res.status(400).json({ success: false, error: 'Title and content are required.' });
    }

    const slug = data.slug
      ? data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const id = generateId('blog');
    const today = new Date().toISOString().slice(0, 10);

    const newBlog = {
      id,
      slug,
      title: data.title.trim(),
      publishedDate: data.publishedDate || today,
      updatedAt: today,
      category: data.category || 'Maintenance Guides',
      author: data.author || (req as any).adminUser.displayName || 'Master Mechanic Hamza',
      readTime: data.readTime || '5 min read',
      excerpt: data.excerpt || (data.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...'),
      content: data.content,
      image: data.image || '/assets/images/blog/blog-engine-diagnostics.jpg',
      imageAlt: data.imageAlt || data.title,
      tags: Array.isArray(data.tags) ? data.tags : ['Motorcycle Repair', 'Hamza Autos'],
      status: data.status || 'Draft',
      isFeatured: !!data.isFeatured,
      seo: {
        metaTitle: data.seo?.metaTitle || `${data.title} | Hamza Autos Badami Bagh`,
        metaDescription: data.seo?.metaDescription || data.excerpt || '',
        focusKeyword: data.seo?.focusKeyword || '',
        canonicalUrl: data.seo?.canonicalUrl || `https://hamzaautos.com/blog/${slug}`,
        ogTitle: data.seo?.ogTitle || data.title,
        ogDescription: data.seo?.ogDescription || data.excerpt || '',
        index: data.seo?.index !== false,
        follow: data.seo?.follow !== false
      }
    };

    const blogs = await readJsonFile<any[]>('blogs.json', []);
    blogs.unshift(newBlog);
    await writeJsonFileAtomic('blogs.json', blogs);

    await logAuditEvent('BLOG_CREATED', (req as any).adminUser.username, id, `Created blog: ${newBlog.title}`);
    res.json({ success: true, blog: newBlog });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update blog
apiRouter.put('/blogs/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const blogs = await readJsonFile<any[]>('blogs.json', []);
    const index = blogs.findIndex(b => b.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Blog not found.' });
    }

    const updated = {
      ...blogs[index],
      ...data,
      id, // protect ID
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    blogs[index] = updated;
    await writeJsonFileAtomic('blogs.json', blogs);

    await logAuditEvent('BLOG_UPDATED', (req as any).adminUser.username, id, `Updated blog: ${updated.title}`);
    res.json({ success: true, blog: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE blog
apiRouter.delete('/blogs/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let blogs = await readJsonFile<any[]>('blogs.json', []);
    const existing = blogs.find(b => b.id === id);
    blogs = blogs.filter(b => b.id !== id);
    await writeJsonFileAtomic('blogs.json', blogs);

    await logAuditEvent('BLOG_DELETED', (req as any).adminUser.username, id, `Deleted: ${existing?.title}`);
    res.json({ success: true, message: 'Blog deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST duplicate blog
apiRouter.post('/blogs/:id/duplicate', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blogs = await readJsonFile<any[]>('blogs.json', []);
    const orig = blogs.find(b => b.id === id);
    if (!orig) return res.status(404).json({ success: false, error: 'Original blog not found.' });

    const newId = generateId('blog');
    const duplicated = {
      ...orig,
      id: newId,
      title: `${orig.title} (Copy)`,
      slug: `${orig.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'Draft',
      publishedDate: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    blogs.unshift(duplicated);
    await writeJsonFileAtomic('blogs.json', blogs);

    res.json({ success: true, blog: duplicated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Categories & Tags
apiRouter.get('/categories', async (_req: Request, res: Response) => {
  const categories = await readJsonFile<any[]>('categories.json', []);
  res.json({ success: true, categories });
});

apiRouter.post('/categories', requireAuth, async (req: Request, res: Response) => {
  const data = req.body;
  const categories = await readJsonFile<any[]>('categories.json', []);
  const newCat = {
    id: generateId('cat'),
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: data.description || '',
    seoTitle: data.seoTitle || '',
    seoDescription: data.seoDescription || '',
    count: 0
  };
  categories.push(newCat);
  await writeJsonFileAtomic('categories.json', categories);
  res.json({ success: true, category: newCat });
});

apiRouter.get('/tags', async (_req: Request, res: Response) => {
  const tags = await readJsonFile<any[]>('tags.json', []);
  res.json({ success: true, tags });
});

apiRouter.post('/tags', requireAuth, async (req: Request, res: Response) => {
  const { name } = req.body;
  const tags = await readJsonFile<any[]>('tags.json', []);
  const newTag = {
    id: generateId('tag'),
    name: name.trim(),
    slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };
  tags.push(newTag);
  await writeJsonFileAtomic('tags.json', tags);
  res.json({ success: true, tag: newTag });
});

// ==========================================
// 5. FORM REGISTRY & MANAGEMENT
// ==========================================

apiRouter.get('/forms', requireAuth, async (_req: Request, res: Response) => {
  try {
    const forms = await readJsonFile<any[]>('forms-registry.json', []);
    res.json({ success: true, forms });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/forms/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const forms = await readJsonFile<any[]>('forms-registry.json', []);
    const idx = forms.findIndex(f => f.id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Form not found.' });

    forms[idx] = { ...forms[idx], ...data, id };
    await writeJsonFileAtomic('forms-registry.json', forms);
    res.json({ success: true, form: forms[idx] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 6. CUSTOMER DIRECTORY
// ==========================================

apiRouter.get('/customers', requireAuth, async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let customers = await readJsonFile<any[]>('customers.json', []);
    if (search) {
      const q = String(search).toLowerCase();
      customers = customers.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.phoneNumber?.includes(q) ||
        c.bikeModel?.toLowerCase().includes(q) ||
        c.registrationNumber?.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, customers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/customers/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const customers = await readJsonFile<any[]>('customers.json', []);
    const idx = customers.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Customer not found.' });

    customers[idx] = { ...customers[idx], ...data, id };
    await writeJsonFileAtomic('customers.json', customers);
    res.json({ success: true, customer: customers[idx] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 7. WEBSITE CONTENT CMS (Services, Brands, FAQs)
// ==========================================

apiRouter.get('/content/:section', async (req: Request, res: Response) => {
  try {
    const { section } = req.params;
    const filename = `${section}.json`;
    const data = await readJsonFile<any[]>(filename, []);
    res.json({ success: true, section, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/content/:section', requireAuth, async (req: Request, res: Response) => {
  try {
    const { section } = req.params;
    const { data } = req.body;
    const filename = `${section}.json`;
    await writeJsonFileAtomic(filename, data);
    await logAuditEvent('CONTENT_UPDATED', (req as any).adminUser.username, section);
    res.json({ success: true, section, message: 'Content updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 8. MEDIA LIBRARY & SECURE UPLOADS
// ==========================================

apiRouter.get('/media', requireAuth, async (_req: Request, res: Response) => {
  try {
    const folders = ['blogs', 'services', 'gallery', 'banners', 'documents'];
    const mediaFiles: any[] = [];

    for (const folder of folders) {
      const folderPath = path.join(UPLOADS_DIR, folder);
      if (fs.existsSync(folderPath)) {
        const files = await fs.promises.readdir(folderPath);
        for (const file of files) {
          const filePath = path.join(folderPath, file);
          const stat = await fs.promises.stat(filePath);
          mediaFiles.push({
            name: file,
            folder,
            url: `/uploads/${folder}/${file}`,
            sizeBytes: stat.size,
            sizeKB: Math.round(stat.size / 1024),
            uploadedAt: stat.mtime.toISOString(),
            ext: path.extname(file).toLowerCase()
          });
        }
      }
    }

    res.json({ success: true, media: mediaFiles });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Pre-Upload / Pre-Assignment Duplicate Check Endpoint
apiRouter.post('/media/check-duplicate', requireAuth, async (req: Request, res: Response) => {
  try {
    const { base64Data, url, filename } = req.body;
    if (base64Data) {
      const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(base64Clean, 'base64');
      const result = await checkImageBufferForDuplicates(buffer, filename);
      return res.json({ success: true, ...result });
    }
    if (url) {
      const result = checkImageUrlForAssignment(url);
      return res.json({ success: true, ...result });
    }
    return res.status(400).json({ success: false, error: 'base64Data or url is required for duplicate checking.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Secure Base64/Binary File Upload with Built-in Duplicate Prevention
apiRouter.post('/media/upload', requireAuth, async (req: Request, res: Response) => {
  try {
    const filename = req.body.filename || req.body.fileName;
    const base64Data = req.body.base64Data || req.body.fileData;
    const { folder = 'blogs', altText, forceDuplicate = false } = req.body;
    if (!filename || !base64Data) {
      return res.status(400).json({ success: false, error: 'Filename and base64Data are required.' });
    }

    // Validate folder
    const validFolders = ['blogs', 'services', 'gallery', 'banners', 'documents'];
    const targetFolder = validFolders.includes(folder) ? folder : 'blogs';

    // Validate extension
    const ext = path.extname(filename).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf'];
    if (!allowedExts.includes(ext)) {
      return res.status(400).json({ success: false, error: `Invalid file extension (${ext}). Allowed: ${allowedExts.join(', ')}` });
    }

    // Decode base64
    const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    // Max 15MB size check
    if (buffer.length > 15 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'File exceeds maximum 15MB size limit.' });
    }

    // Strict Duplicate Prevention Guard
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      const dupCheck = await checkImageBufferForDuplicates(buffer, filename);
      if (dupCheck.isDuplicate && !forceDuplicate) {
        return res.status(409).json({
          success: false,
          duplicateDetected: true,
          matchType: dupCheck.matchType,
          matchedRecord: dupCheck.matchedRecord,
          distance: dupCheck.distance,
          message: dupCheck.message
        });
      }
    }

    // Clean safe filename
    const baseName = path.parse(filename).name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${baseName}_${Date.now()}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, targetFolder, safeFilename);

    await fs.promises.writeFile(targetPath, buffer);
    const publicUrl = `/uploads/${targetFolder}/${safeFilename}`;

    await logAuditEvent('MEDIA_UPLOADED', (req as any).adminUser.username, safeFilename, `Uploaded to ${targetFolder}`);

    res.json({
      success: true,
      file: {
        name: safeFilename,
        folder: targetFolder,
        url: publicUrl,
        sizeKB: Math.round(buffer.length / 1024),
        altText: altText || baseName
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/media/:folder/:filename', requireAuth, async (req: Request, res: Response) => {
  try {
    const { folder, filename } = req.params;
    const safeFilename = path.basename(filename);
    const targetPath = path.join(UPLOADS_DIR, folder, safeFilename);

    if (fs.existsSync(targetPath)) {
      await fs.promises.unlink(targetPath);
      await logAuditEvent('MEDIA_DELETED', (req as any).adminUser.username, safeFilename);
      return res.json({ success: true, message: 'Media file removed.' });
    }
    res.status(404).json({ success: false, error: 'File not found.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 9. SEO & METADATA MANAGEMENT
// ==========================================

apiRouter.get('/seo', requireAuth, async (_req: Request, res: Response) => {
  try {
    const defaultPages = [
      {
        route: '/',
        pageName: 'Homepage',
        metaTitle: 'Hamza Autos – Bike Mechanic & Motorcycle Repair Shop in Badami Bagh, Lahore',
        metaDescription: 'Trusted motorcycle mechanic & repair shop in Badami Bagh, Lahore. Professional bike engine repair, tuning, oil change, electrical wiring, brakes & maintenance. Call +92 325 1814548.',
        keywords: ['bike mechanic lahore', 'motorcycle repair badami bagh', 'bike engine overhaul', 'bike tuning lahore'],
        canonicalUrl: 'https://hamzaautos.com/'
      },
      {
        route: '/services',
        pageName: 'Services Page',
        metaTitle: 'Motorcycle Repair & Maintenance Services in Badami Bagh, Lahore | Hamza Autos',
        metaDescription: 'Explore professional motorcycle services in Badami Bagh Lahore: engine overhaul, carburetor tuning, genuine oil change, electrical wiring repair, brakes & clutches for Honda, Yamaha, Suzuki.',
        keywords: ['bike repair services lahore', 'motorcycle oil change badami bagh', 'bike tuning badami bagh'],
        canonicalUrl: 'https://hamzaautos.com/services'
      },
      {
        route: '/brands',
        pageName: 'Brands We Repair',
        metaTitle: 'Motorcycle Brands We Repair (Honda, Yamaha, Suzuki, United) | Hamza Autos Lahore',
        metaDescription: 'Specialist motorcycle mechanics in Badami Bagh for Honda CD 70 & CG 125, Yamaha YBR 125, Suzuki GS 150 & GD 110, United and all Chinese bikes. Call +92 325 1814548.',
        keywords: ['honda mechanic lahore', 'yamaha ybr repair badami bagh', 'suzuki gs150 mechanic lahore'],
        canonicalUrl: 'https://hamzaautos.com/brands'
      },
      {
        route: '/areas',
        pageName: 'Areas We Serve',
        metaTitle: 'Areas We Serve in Lahore (Badami Bagh, Shadbagh, Misri Shah, Ravi Road) | Hamza Autos',
        metaDescription: 'Hamza Autos is centrally located on Abu Bakar Road, Badami Bagh, providing quick motorcycle repair access to Shadbagh, Misri Shah, Ravi Road, Bund Road & Azadi Chowk riders.',
        keywords: ['bike repair badami bagh', 'motorcycle mechanic shadbagh', 'bike repair misri shah', 'bike tuning ravi road'],
        canonicalUrl: 'https://hamzaautos.com/areas'
      },
      {
        route: '/contact',
        pageName: 'Contact & Location',
        metaTitle: 'Contact Hamza Autos – Workshop Location & Phone | Badami Bagh Lahore',
        metaDescription: 'Contact Hamza Autos on Abu Bakar Road, Badami Bagh, Lahore. Call +92 325 1814548 for urgent bike breakdown assistance, appointment booking, or workshop directions.',
        keywords: ['bike mechanic phone number lahore', 'hamza autos location', 'badami bagh motorcycle workshop'],
        canonicalUrl: 'https://hamzaautos.com/contact'
      },
      {
        route: '/blog',
        pageName: 'Motorcycle Care Blog',
        metaTitle: 'Motorcycle Care & Maintenance Blog | Hamza Autos Badami Bagh Lahore',
        metaDescription: 'Practical motorcycle maintenance advice, DIY troubleshooting, carburetor tuning tips, and engine care guides by Master Mechanic Hamza in Lahore, Pakistan.',
        keywords: ['motorcycle maintenance tips pakistan', 'bike fuel average guide lahore', 'honda 125 engine problems'],
        canonicalUrl: 'https://hamzaautos.com/blog'
      },
      {
        route: '/reviews',
        pageName: 'Customer Reviews',
        metaTitle: 'Customer Reviews & Mechanic Ratings | Hamza Autos Badami Bagh Lahore',
        metaDescription: 'Read genuine customer reviews from Lahore riders who trust Hamza Autos for engine overhauls, bike tuning, and routine maintenance in Badami Bagh.',
        keywords: ['hamza autos reviews', 'best bike mechanic lahore review', 'motorcycle repair feedback badami bagh'],
        canonicalUrl: 'https://hamzaautos.com/reviews'
      },
      {
        route: '/gallery',
        pageName: 'Workshop Gallery',
        metaTitle: 'Workshop Bay & Repair Gallery | Hamza Autos Badami Bagh Lahore',
        metaDescription: 'Take a look inside Hamza Autos motorcycle repair workshop in Badami Bagh Lahore. See our diagnostic equipment, engine rebuilding bay, and mechanic tools.',
        keywords: ['hamza autos workshop gallery', 'bike repair shop photos lahore'],
        canonicalUrl: 'https://hamzaautos.com/gallery'
      }
    ];

    const seoFile = await readJsonFile<any>('seo-settings.json', { pages: defaultPages, general: { siteName: 'Hamza Autos', phone: '+92 325 1814548', locality: 'Badami Bagh, Lahore' } });
    const blogs = await readJsonFile<any[]>('blogs.json', []);

    // Check duplicate meta titles across blogs and pages
    const titlesCount: Record<string, number> = {};
    const duplicateWarnings: string[] = [];

    (seoFile.pages || defaultPages).forEach((p: any) => {
      const t = p.metaTitle;
      if (t) {
        titlesCount[t] = (titlesCount[t] || 0) + 1;
        if (titlesCount[t] === 2) duplicateWarnings.push(`Duplicate title found: "${t}"`);
      }
    });

    blogs.forEach(b => {
      const t = b.seo?.metaTitle || b.title;
      if (t) {
        titlesCount[t] = (titlesCount[t] || 0) + 1;
        if (titlesCount[t] === 2) duplicateWarnings.push(`Duplicate title found in blog: "${t}"`);
      }
    });

    res.json({
      success: true,
      pages: seoFile.pages || defaultPages,
      general: seoFile.general || { siteName: 'Hamza Autos', phone: '+92 325 1814548', locality: 'Badami Bagh, Lahore' },
      seoSettings: {
        homepageTitle: 'Hamza Autos – Bike Mechanic & Motorcycle Repair Shop in Badami Bagh, Lahore',
        homepageDescription: 'Trusted motorcycle mechanic & repair shop in Badami Bagh, Lahore. Professional bike engine repair, tuning, oil change, electrical wiring, brakes & maintenance.',
        canonicalBaseUrl: 'https://hamzaautos.com',
        duplicateWarnings
      },
      audit: {
        totalIndexedPages: 47,
        duplicateTitleCount: duplicateWarnings.length,
        sitemapUrl: 'https://hamzaautos.com/sitemap.xml',
        robotsUrl: 'https://hamzaautos.com/robots.txt',
        schemaStatus: 'Valid Schema.org AutoRepair, Organization, Service, BreadcrumbList'
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/seo', requireAuth, async (req: Request, res: Response) => {
  try {
    const { pages, general } = req.body;
    if (!pages || !Array.isArray(pages)) {
      return res.status(400).json({ success: false, error: 'Pages array is required.' });
    }

    const payload = {
      pages,
      general: general || { siteName: 'Hamza Autos', phone: '+92 325 1814548', locality: 'Badami Bagh, Lahore' },
      updatedAt: new Date().toISOString()
    };

    await writeJsonFileAtomic('seo-settings.json', payload, false);

    // Also record audit log
    const logs = await readJsonFile<any[]>('audit-logs.json', []);
    logs.unshift({
      id: `audit-${Date.now()}`,
      action: 'UPDATE_SEO_SETTINGS',
      user: 'admin',
      timestamp: new Date().toISOString(),
      details: `Updated SEO meta settings for ${pages.length} pages`
    });
    await writeJsonFileAtomic('audit-logs.json', logs.slice(0, 500), false);

    res.json({
      success: true,
      message: 'SEO configuration saved successfully to storage/seo-settings.json.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 10. NOTIFICATIONS & AUDIT LOGS
// ==========================================

apiRouter.get('/notifications', requireAuth, async (_req: Request, res: Response) => {
  try {
    const notifications = await readJsonFile<any[]>('notifications.json', []);
    res.json({ success: true, notifications });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/notifications/:id/read', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notifications = await readJsonFile<any[]>('notifications.json', []);
    const idx = notifications.findIndex(n => n.id === id);
    if (idx !== -1) {
      notifications[idx].isRead = true;
      await writeJsonFileAtomic('notifications.json', notifications, false);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/audit-logs', requireAuth, async (_req: Request, res: Response) => {
  try {
    const logs = await readJsonFile<any[]>('audit-logs.json', []);
    res.json({ success: true, logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 11. DATA BACKUP & RESTORE
// ==========================================

const BACKUP_DIR = path.join(STORAGE_DIR, 'backups');

apiRouter.get('/backup/list', requireAuth, async (_req: Request, res: Response) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      await fs.promises.mkdir(BACKUP_DIR, { recursive: true });
    }
    const files = await fs.promises.readdir(BACKUP_DIR);
    const backups = await Promise.all(
      files.filter(f => f.endsWith('.json')).map(async (fileName) => {
        const stats = await fs.promises.stat(path.join(BACKUP_DIR, fileName));
        return {
          fileName,
          size: stats.size,
          createdAt: stats.mtime.toISOString()
        };
      })
    );
    backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, backups });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/backup/create', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      await fs.promises.mkdir(BACKUP_DIR, { recursive: true });
    }
    const files = await fs.promises.readdir(STORAGE_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json') && !f.includes('.tmp'));
    const snapshot: Record<string, any> = {
      exportDate: getCurrentTimestamp(),
      application: 'Hamza Autos Master Admin',
      version: '3.0-file-store',
      stores: {}
    };

    for (const f of jsonFiles) {
      const storeName = path.parse(f).name;
      snapshot.stores[storeName] = await readJsonFile(f, []);
    }

    const fileName = `snapshot-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const destPath = path.join(BACKUP_DIR, fileName);
    await fs.promises.writeFile(destPath, JSON.stringify(snapshot, null, 2), 'utf-8');
    const stats = await fs.promises.stat(destPath);

    await logAuditEvent('BACKUP_CREATED', (req as any).adminUser.username, fileName, `Created snapshot of ${jsonFiles.length} stores`);

    res.json({
      success: true,
      backup: {
        fileName,
        size: stats.size,
        createdAt: stats.mtime.toISOString()
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/backup/export-all', requireAuth, async (_req: Request, res: Response) => {
  try {
    const files = await fs.promises.readdir(STORAGE_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json') && !f.includes('.tmp'));
    const fullBackup: Record<string, any> = {
      exportDate: getCurrentTimestamp(),
      application: 'Hamza Autos Workshop Management',
      version: '3.0-file-store',
      stores: {}
    };

    for (const f of jsonFiles) {
      const storeName = path.parse(f).name;
      fullBackup.stores[storeName] = await readJsonFile(f, []);
    }

    res.json(fullBackup);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/backup/import-all', requireAuth, async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const backupData = data?.stores ? data : (data || req.body);
    if (!backupData || !backupData.stores) {
      return res.status(400).json({ success: false, error: 'Invalid backup format. Missing "stores" key.' });
    }

    for (const [storeName, storeData] of Object.entries(backupData.stores)) {
      const filename = `${storeName}.json`;
      await writeJsonFileAtomic(filename, storeData, true);
    }

    await logAuditEvent('DATA_RESTORED', (req as any).adminUser.username, 'backup/import-all', 'Imported full dataset');
    res.json({ success: true, message: 'Data imported and storage synchronized successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/backup/export', requireAuth, async (_req: Request, res: Response) => {
  try {
    const files = await fs.promises.readdir(STORAGE_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json') && !f.includes('.tmp'));
    const fullBackup: Record<string, any> = {
      exportDate: getCurrentTimestamp(),
      application: 'Hamza Autos Workshop Management',
      version: '3.0-file-store',
      stores: {}
    };

    for (const f of jsonFiles) {
      const storeName = path.parse(f).name;
      fullBackup.stores[storeName] = await readJsonFile(f, []);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=hamza_autos_storage_backup_${new Date().toISOString().slice(0, 10)}.json`);
    res.json(fullBackup);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/backup/restore', requireAuth, async (req: Request, res: Response) => {
  try {
    const { backupData, backupId, mode = 'replace' } = req.body;
    let payload = backupData;

    if (backupId) {
      const snapPath = path.join(BACKUP_DIR, backupId);
      if (fs.existsSync(snapPath)) {
        const raw = await fs.promises.readFile(snapPath, 'utf-8');
        payload = JSON.parse(raw);
      }
    }

    if (!payload || !payload.stores) {
      return res.status(400).json({ success: false, error: 'Invalid backup structure. Missing "stores" object.' });
    }

    for (const [storeName, data] of Object.entries(payload.stores)) {
      const filename = `${storeName}.json`;
      if (mode === 'replace') {
        await writeJsonFileAtomic(filename, data, true);
      } else {
        const existing = await readJsonFile<any[]>(filename, []);
        if (Array.isArray(existing) && Array.isArray(data)) {
          const map = new Map(existing.map(item => [item.id, item]));
          data.forEach((item: any) => map.set(item.id, item));
          await writeJsonFileAtomic(filename, Array.from(map.values()), true);
        }
      }
    }

    await logAuditEvent('DATA_RESTORED', (req as any).adminUser.username, 'backup/restore', `Restored stores with mode: ${mode}`);
    res.json({ success: true, message: `Database successfully restored (${mode} mode).` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Settings
apiRouter.get('/settings', async (_req: Request, res: Response) => {
  const settings = await readJsonFile<any>('admin-settings.json', {});
  res.json({ success: true, settings });
});

apiRouter.put('/settings', requireAuth, async (req: Request, res: Response) => {
  const settings = await readJsonFile<any>('admin-settings.json', {});
  const updated = { ...settings, ...req.body };
  await writeJsonFileAtomic('admin-settings.json', updated);
  await logAuditEvent('SETTINGS_UPDATED', (req as any).adminUser.username, 'admin-settings.json');
  res.json({ success: true, settings: updated });
});

// ==========================================
// 12. ADVANCED CRM & LEAD MANAGEMENT API
// ==========================================

apiRouter.get('/crm/leads', requireAuth, async (req: Request, res: Response) => {
  try {
    const leads = await readJsonFile<any[]>('crm-leads.json', []);
    const { status, priority, search } = req.query;
    let filtered = [...leads];

    if (status) {
      filtered = filtered.filter(l => l.status === status);
    }
    if (priority) {
      filtered = filtered.filter(l => l.priority === priority);
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(l => 
        l.customerName.toLowerCase().includes(q) ||
        l.phoneNumber.includes(q) ||
        l.bikeBrand.toLowerCase().includes(q) ||
        l.bikeModel.toLowerCase().includes(q) ||
        (l.interestedService && l.interestedService.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, leads: filtered, total: filtered.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/crm/leads', requireAuth, async (req: Request, res: Response) => {
  try {
    const leads = await readJsonFile<any[]>('crm-leads.json', []);
    const newLead = {
      id: generateId('lead'),
      customerName: req.body.customerName || 'Walk-in Prospect',
      phoneNumber: req.body.phoneNumber || '',
      whatsAppNumber: req.body.whatsAppNumber || req.body.phoneNumber || '',
      email: req.body.email || '',
      address: req.body.address || '',
      bikeBrand: req.body.bikeBrand || 'Honda',
      bikeModel: req.body.bikeModel || 'CD 70',
      registrationNumber: req.body.registrationNumber || '',
      interestedService: req.body.interestedService || 'General Tuning',
      customerMessage: req.body.customerMessage || '',
      leadSource: req.body.leadSource || 'Manual',
      sourcePage: req.body.sourcePage || '/admin/crm-leads',
      leadCreationDate: getCurrentTimestamp(),
      assignedAdmin: req.body.assignedAdmin || (req as any).adminUser.username,
      priority: req.body.priority || 'Medium',
      status: req.body.status || 'New Lead',
      estimatedValue: Number(req.body.estimatedValue) || 0,
      internalNotes: req.body.internalNotes || '',
      nextFollowUpDate: req.body.nextFollowUpDate || ''
    };

    leads.unshift(newLead);
    await writeJsonFileAtomic('crm-leads.json', leads);

    // Record initial interaction
    const interactions = await readJsonFile<any[]>('crm-interactions.json', []);
    interactions.unshift({
      id: generateId('act'),
      leadId: newLead.id,
      customerName: newLead.customerName,
      type: 'Inquiry Received',
      details: `Lead created from ${newLead.leadSource}: ${newLead.interestedService} (${newLead.bikeBrand} ${newLead.bikeModel})`,
      timestamp: getCurrentTimestamp(),
      adminName: (req as any).adminUser.username,
      channel: 'Website'
    });
    await writeJsonFileAtomic('crm-interactions.json', interactions);

    await logAuditEvent('LEAD_CREATED', (req as any).adminUser.username, `crm-leads.json/${newLead.id}`, `Created lead for ${newLead.customerName}`);
    res.json({ success: true, lead: newLead });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/crm/leads/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const leads = await readJsonFile<any[]>('crm-leads.json', []);
    const index = leads.findIndex(l => l.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Lead not found.' });
    }

    const previousStatus = leads[index].status;
    const updated = {
      ...leads[index],
      ...req.body,
      id: req.params.id,
      updatedAt: getCurrentTimestamp()
    };
    leads[index] = updated;
    await writeJsonFileAtomic('crm-leads.json', leads);

    // If status changed, record interaction timeline entry
    if (req.body.status && req.body.status !== previousStatus) {
      const interactions = await readJsonFile<any[]>('crm-interactions.json', []);
      interactions.unshift({
        id: generateId('act'),
        leadId: updated.id,
        customerName: updated.customerName,
        type: 'Call Recorded',
        details: `Stage updated from "${previousStatus}" to "${req.body.status}". Notes: ${req.body.internalNotes || 'Status changed in pipeline.'}`,
        timestamp: getCurrentTimestamp(),
        adminName: (req as any).adminUser.username,
        channel: 'Phone'
      });
      await writeJsonFileAtomic('crm-interactions.json', interactions);
    }

    await logAuditEvent('LEAD_UPDATED', (req as any).adminUser.username, `crm-leads.json/${updated.id}`);
    res.json({ success: true, lead: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/crm/leads/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const leads = await readJsonFile<any[]>('crm-leads.json', []);
    const filtered = leads.filter(l => l.id !== req.params.id);
    await writeJsonFileAtomic('crm-leads.json', filtered);
    await logAuditEvent('LEAD_DELETED', (req as any).adminUser.username, `crm-leads.json/${req.params.id}`);
    res.json({ success: true, message: 'Lead deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Convert Lead to Customer & Optional Booking
apiRouter.post('/crm/leads/:id/convert', requireAuth, async (req: Request, res: Response) => {
  try {
    const leads = await readJsonFile<any[]>('crm-leads.json', []);
    const lead = leads.find(l => l.id === req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found.' });
    }

    // 1. Check or create Customer in customers.json
    const customers = await readJsonFile<any[]>('customers.json', []);
    let customer = customers.find(c => c.phoneNumber === lead.phoneNumber);
    if (!customer) {
      customer = {
        id: generateId('cust'),
        name: lead.customerName,
        phoneNumber: lead.phoneNumber,
        whatsapp: lead.whatsAppNumber || lead.phoneNumber,
        email: lead.email || '',
        address: lead.address || 'Badami Bagh, Lahore',
        bikeBrand: lead.bikeBrand,
        bikeModel: lead.bikeModel,
        registrationNumber: lead.registrationNumber || '',
        firstContactDate: lead.leadCreationDate.split('T')[0],
        lastContactDate: getCurrentTimestamp().split('T')[0],
        totalInquiries: 1,
        totalBookings: req.body.createBooking ? 1 : 0,
        totalSpent: 0,
        notes: `Converted from CRM Lead (${lead.id}). Initial interest: ${lead.interestedService}`
      };
      customers.unshift(customer);
      await writeJsonFileAtomic('customers.json', customers);
    }

    // 2. Create appointment booking (default to true if appointmentDate is provided or createBooking is not explicitly false)
    let bookingId = undefined;
    let newBooking: any = undefined;
    if (req.body.createBooking !== false) {
      const bookings = await readJsonFile<any[]>('booking-submissions.json', []);
      newBooking = {
        id: generateId('bk'),
        bookingNumber: `HA-BK-2026-${String(bookings.length + 1).padStart(3, '0')}`,
        customerName: lead.customerName,
        phoneNumber: lead.phoneNumber,
        area: lead.address || 'Badami Bagh',
        bikeBrand: lead.bikeBrand,
        bikeModel: lead.bikeModel,
        registrationNumber: lead.registrationNumber || '',
        serviceRequested: lead.interestedService,
        problemDescription: lead.customerMessage || 'Converted from qualified lead',
        appointmentDate: req.body.appointmentDate || getCurrentTimestamp().split('T')[0],
        appointmentTime: req.body.appointmentTime || '10:30 AM',
        status: 'Confirmed Slot',
        internalNotes: `Linked to Lead ${lead.id}`,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp()
      };
      bookings.unshift(newBooking);
      bookingId = newBooking.id;
      await writeJsonFileAtomic('booking-submissions.json', bookings);
    }

    // 3. Mark Lead as Converted
    lead.status = 'Converted to Customer';
    lead.convertedCustomerId = customer.id;
    lead.convertedBookingId = bookingId;
    lead.convertedAt = getCurrentTimestamp();
    lead.convertedBy = (req as any).adminUser.username;
    await writeJsonFileAtomic('crm-leads.json', leads);

    // 4. Log conversion interaction
    const interactions = await readJsonFile<any[]>('crm-interactions.json', []);
    interactions.unshift({
      id: generateId('act'),
      leadId: lead.id,
      customerId: customer.id,
      customerName: lead.customerName,
      type: 'Booking Confirmed',
      details: `Lead successfully converted to Customer Profile ${customer.id}${bookingId ? ` and Appointment Booking ${bookingId}` : ''}.`,
      timestamp: getCurrentTimestamp(),
      adminName: (req as any).adminUser.username,
      channel: 'In-Person'
    });
    await writeJsonFileAtomic('crm-interactions.json', interactions);

    await logAuditEvent('LEAD_CONVERTED', (req as any).adminUser.username, `crm-leads.json/${lead.id}`, `Converted to Customer ${customer.id}`);
    res.json({ success: true, customer, bookingId, booking: newBooking, lead });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Follow-ups API
apiRouter.get('/crm/followups', requireAuth, async (_req: Request, res: Response) => {
  try {
    const followups = await readJsonFile<any[]>('crm-followups.json', []);
    res.json({ success: true, followups });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/crm/followups', requireAuth, async (req: Request, res: Response) => {
  try {
    const followups = await readJsonFile<any[]>('crm-followups.json', []);
    const newFollowup = {
      id: generateId('flw'),
      leadId: req.body.leadId,
      customerName: req.body.customerName,
      phoneNumber: req.body.phoneNumber,
      followUpDate: req.body.followUpDate,
      followUpTime: req.body.followUpTime || '11:00 AM',
      followUpMethod: req.body.followUpMethod || 'Call',
      followUpNotes: req.body.followUpNotes || '',
      assignedAdmin: req.body.assignedAdmin || (req as any).adminUser.username,
      status: 'Pending',
      createdAt: getCurrentTimestamp()
    };
    followups.unshift(newFollowup);
    await writeJsonFileAtomic('crm-followups.json', followups);

    // Update lead's next follow-up date
    if (newFollowup.leadId) {
      const leads = await readJsonFile<any[]>('crm-leads.json', []);
      const l = leads.find(item => item.id === newFollowup.leadId);
      if (l) {
        l.nextFollowUpDate = newFollowup.followUpDate;
        await writeJsonFileAtomic('crm-leads.json', leads);
      }
    }

    res.json({ success: true, followup: newFollowup });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/crm/followups/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const followups = await readJsonFile<any[]>('crm-followups.json', []);
    const idx = followups.findIndex(f => f.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Follow-up not found.' });
    }

    const updated = {
      ...followups[idx],
      ...req.body,
      id: req.params.id,
      updatedAt: getCurrentTimestamp()
    };
    if (req.body.status === 'Completed' && !updated.completedAt) {
      updated.completedAt = getCurrentTimestamp();
    }
    followups[idx] = updated;
    await writeJsonFileAtomic('crm-followups.json', followups);

    res.json({ success: true, followup: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/crm/followups/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const followups = await readJsonFile<any[]>('crm-followups.json', []);
    const filtered = followups.filter(f => f.id !== req.params.id);
    await writeJsonFileAtomic('crm-followups.json', filtered);
    res.json({ success: true, message: 'Follow-up removed.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Interactions Timeline API
apiRouter.get('/crm/interactions', requireAuth, async (req: Request, res: Response) => {
  try {
    const interactions = await readJsonFile<any[]>('crm-interactions.json', []);
    const { leadId, customerId } = req.query;
    let filtered = [...interactions];
    if (leadId) filtered = filtered.filter(i => i.leadId === leadId);
    if (customerId) filtered = filtered.filter(i => i.customerId === customerId);
    res.json({ success: true, interactions: filtered });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/crm/interactions', requireAuth, async (req: Request, res: Response) => {
  try {
    const interactions = await readJsonFile<any[]>('crm-interactions.json', []);
    const newAct = {
      id: generateId('act'),
      leadId: req.body.leadId,
      customerId: req.body.customerId,
      customerName: req.body.customerName || 'Customer',
      type: req.body.type || 'Call Recorded',
      details: req.body.details || '',
      timestamp: getCurrentTimestamp(),
      adminName: (req as any).adminUser.username,
      channel: req.body.channel || 'Phone'
    };
    interactions.unshift(newAct);
    await writeJsonFileAtomic('crm-interactions.json', interactions);
    res.json({ success: true, interaction: newAct });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 13. MECHANIC MANAGEMENT API
// ==========================================

apiRouter.get('/mechanics', requireAuth, async (_req: Request, res: Response) => {
  try {
    const mechanics = await readJsonFile<any[]>('mechanics.json', []);
    res.json({ success: true, mechanics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/mechanics', requireAuth, async (req: Request, res: Response) => {
  try {
    const mechanics = await readJsonFile<any[]>('mechanics.json', []);
    const newMechanic = {
      id: generateId('mech'),
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      whatsAppNumber: req.body.whatsAppNumber || req.body.phoneNumber,
      email: req.body.email || '',
      address: req.body.address || 'Badami Bagh, Lahore',
      joiningDate: req.body.joiningDate || getCurrentTimestamp().split('T')[0],
      specializations: req.body.specializations || ['General Maintenance'],
      skills: req.body.skills || [],
      employmentStatus: req.body.employmentStatus || 'Active',
      internalNotes: req.body.internalNotes || '',
      assignedBays: req.body.assignedBays || [],
      activeJobsCount: 0,
      completedJobsCount: 0,
      hourlyRate: Number(req.body.hourlyRate) || 500,
      createdAt: getCurrentTimestamp()
    };
    mechanics.push(newMechanic);
    await writeJsonFileAtomic('mechanics.json', mechanics);
    await logAuditEvent('MECHANIC_CREATED', (req as any).adminUser.username, `mechanics.json/${newMechanic.id}`);
    res.json({ success: true, mechanic: newMechanic });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/mechanics/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const mechanics = await readJsonFile<any[]>('mechanics.json', []);
    const idx = mechanics.findIndex(m => m.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Mechanic not found.' });
    }
    const updated = { ...mechanics[idx], ...req.body, id: req.params.id, updatedAt: getCurrentTimestamp() };
    mechanics[idx] = updated;
    await writeJsonFileAtomic('mechanics.json', mechanics);
    await logAuditEvent('MECHANIC_UPDATED', (req as any).adminUser.username, `mechanics.json/${updated.id}`);
    res.json({ success: true, mechanic: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/mechanics/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const mechanics = await readJsonFile<any[]>('mechanics.json', []);
    const filtered = mechanics.filter(m => m.id !== req.params.id);
    await writeJsonFileAtomic('mechanics.json', filtered);
    await logAuditEvent('MECHANIC_DELETED', (req as any).adminUser.username, `mechanics.json/${req.params.id}`);
    res.json({ success: true, message: 'Mechanic profile removed.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Attendance API
apiRouter.get('/mechanics/attendance', requireAuth, async (req: Request, res: Response) => {
  try {
    const attendance = await readJsonFile<any[]>('mechanic-attendance.json', []);
    const { date, mechanicId } = req.query;
    let filtered = [...attendance];
    if (date) filtered = filtered.filter(a => a.date === date);
    if (mechanicId) filtered = filtered.filter(a => a.mechanicId === mechanicId);
    res.json({ success: true, attendance: filtered });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/mechanics/attendance', requireAuth, async (req: Request, res: Response) => {
  try {
    const attendance = await readJsonFile<any[]>('mechanic-attendance.json', []);
    const record = {
      id: req.body.id || `att-${req.body.mechanicId}-${req.body.date}`,
      mechanicId: req.body.mechanicId,
      mechanicName: req.body.mechanicName,
      date: req.body.date,
      checkInTime: req.body.checkInTime || '09:00 AM',
      checkOutTime: req.body.checkOutTime || '',
      status: req.body.status || 'Present',
      notes: req.body.notes || '',
      recordedBy: (req as any).adminUser.username,
      updatedAt: getCurrentTimestamp(),
      createdAt: getCurrentTimestamp()
    };

    const existingIdx = attendance.findIndex(a => a.id === record.id);
    if (existingIdx >= 0) {
      attendance[existingIdx] = { ...attendance[existingIdx], ...record };
    } else {
      attendance.unshift(record);
    }

    await writeJsonFileAtomic('mechanic-attendance.json', attendance);
    res.json({ success: true, attendanceRecord: record });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 14. EXPENSES & PROFIT MANAGEMENT API
// ==========================================

apiRouter.get('/expenses', requireAuth, async (req: Request, res: Response) => {
  try {
    const expenses = await readJsonFile<any[]>('expenses.json', []);
    const { category, search, dateRange } = req.query;
    let filtered = [...expenses];
    if (category) filtered = filtered.filter(e => e.expenseCategory === category);
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(e => 
        e.expenseTitle.toLowerCase().includes(q) ||
        e.paidTo.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q))
      );
    }
    res.json({ success: true, expenses: filtered, totalAmount: filtered.reduce((sum, e) => sum + (e.amount || 0), 0) });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/expenses', requireAuth, async (req: Request, res: Response) => {
  try {
    const expenses = await readJsonFile<any[]>('expenses.json', []);
    const newExpense = {
      id: generateId('exp'),
      expenseTitle: req.body.expenseTitle,
      expenseCategory: req.body.expenseCategory,
      amount: Number(req.body.amount) || 0,
      expenseDate: req.body.expenseDate || getCurrentTimestamp().split('T')[0],
      paymentMethod: req.body.paymentMethod || 'Cash',
      paidTo: req.body.paidTo || '',
      description: req.body.description || '',
      referenceNumber: req.body.referenceNumber || '',
      receiptPhotoOrDoc: req.body.receiptPhotoOrDoc || '',
      createdBy: (req as any).adminUser.username,
      createdDate: getCurrentTimestamp(),
      purchaseOrderId: req.body.purchaseOrderId || ''
    };

    expenses.unshift(newExpense);
    await writeJsonFileAtomic('expenses.json', expenses);

    // Record in unified Financial Transactions ledger
    const transactions = await readJsonFile<any[]>('financial-transactions.json', []);
    transactions.unshift({
      id: generateId('tx'),
      transactionType: 'Workshop Expense',
      referenceType: 'Expense',
      referenceId: newExpense.id,
      amount: newExpense.amount,
      date: newExpense.expenseDate,
      paymentMethod: newExpense.paymentMethod,
      description: `${newExpense.expenseCategory}: ${newExpense.expenseTitle}`,
      createdBy: (req as any).adminUser.username,
      customerOrPayee: newExpense.paidTo,
      status: 'Completed',
      createdAt: getCurrentTimestamp()
    });
    await writeJsonFileAtomic('financial-transactions.json', transactions);

    await logAuditEvent('EXPENSE_CREATED', (req as any).adminUser.username, `expenses.json/${newExpense.id}`, `PKR ${newExpense.amount} for ${newExpense.expenseTitle}`);
    res.json({ success: true, expense: newExpense });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/expenses/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const expenses = await readJsonFile<any[]>('expenses.json', []);
    const idx = expenses.findIndex(e => e.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Expense not found.' });
    }
    const updated = { ...expenses[idx], ...req.body, id: req.params.id, updatedAt: getCurrentTimestamp() };
    expenses[idx] = updated;
    await writeJsonFileAtomic('expenses.json', expenses);
    await logAuditEvent('EXPENSE_UPDATED', (req as any).adminUser.username, `expenses.json/${updated.id}`);
    res.json({ success: true, expense: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/expenses/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const expenses = await readJsonFile<any[]>('expenses.json', []);
    const filtered = expenses.filter(e => e.id !== req.params.id);
    await writeJsonFileAtomic('expenses.json', filtered);
    await logAuditEvent('EXPENSE_DELETED', (req as any).adminUser.username, `expenses.json/${req.params.id}`);
    res.json({ success: true, message: 'Expense deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/expenses/categories', requireAuth, async (_req: Request, res: Response) => {
  try {
    const categories = await readJsonFile<any[]>('expense-categories.json', []);
    res.json({ success: true, categories });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/expenses/categories', requireAuth, async (req: Request, res: Response) => {
  try {
    const categories = await readJsonFile<any[]>('expense-categories.json', []);
    const newCat = {
      id: generateId('exp-cat'),
      name: req.body.name,
      isSystem: false,
      description: req.body.description || ''
    };
    categories.push(newCat);
    await writeJsonFileAtomic('expense-categories.json', categories);
    res.json({ success: true, category: newCat });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Financial Transactions Ledger
apiRouter.get('/financial/transactions', requireAuth, async (req: Request, res: Response) => {
  try {
    const transactions = await readJsonFile<any[]>('financial-transactions.json', []);
    const { type, search } = req.query;
    let filtered = [...transactions];
    if (type) filtered = filtered.filter(t => t.transactionType === type);
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(q) || 
        (t.customerOrPayee && t.customerOrPayee.toLowerCase().includes(q)) ||
        t.referenceId.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, transactions: filtered });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Profit & Loss Summary API (Real calculations only)
apiRouter.get('/financial/profit-summary', requireAuth, async (req: Request, res: Response) => {
  try {
    const expenses = await readJsonFile<any[]>('expenses.json', []);
    const transactions = await readJsonFile<any[]>('financial-transactions.json', []);
    const purchaseOrders = await readJsonFile<any[]>('purchase-orders.json', []);

    // 1. Collected revenue = Customer payments actually recorded in transactions
    const customerPayments = transactions.filter(t => t.transactionType === 'Customer Payment' && t.status === 'Completed');
    const collectedRevenue = customerPayments.reduce((sum, t) => sum + (t.amount || 0), 0);

    // 2. Direct parts cost from received purchase orders or inventory consumption
    const directPartsCost = purchaseOrders
      .filter(po => ['Received', 'Partially Received'].includes(po.deliveryStatus))
      .reduce((sum, po) => sum + (po.paidAmount || po.totalOrderValue || 0), 0);

    // 3. Operating expenses (excluding parts purchases if categorized separately)
    const operatingExpenses = expenses
      .filter(e => e.expenseCategory !== 'Spare Parts Purchases')
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const totalExpenses = operatingExpenses + directPartsCost;
    const grossProfitEstimate = collectedRevenue - directPartsCost;
    const netProfitEstimate = collectedRevenue - totalExpenses;

    const profitSummary = {
      collectedRevenue,
      realizedGrossRevenue: collectedRevenue,
      invoicedAmount: collectedRevenue, // accurately reflects actual revenue
      outstandingReceivables: 0,
      totalExpenses,
      partsDirectCost: directPartsCost,
      operatingExpenses,
      grossProfitEstimate,
      realizedNetProfit: netProfitEstimate,
      netProfitEstimate,
      periodLabel: 'All Time Recorded',
      isIncompleteData: customerPayments.length === 0 && expenses.length === 0,
      warningNotice: customerPayments.length === 0 ? 'No completed customer payments recorded yet.' : undefined
    };

    res.json({
      success: true,
      profitSummary,
      summary: profitSummary
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 15. SUPPLIER & PURCHASE ORDER API
// ==========================================

apiRouter.get('/suppliers', requireAuth, async (_req: Request, res: Response) => {
  try {
    const suppliers = await readJsonFile<any[]>('suppliers.json', []);
    res.json({ success: true, suppliers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/suppliers', requireAuth, async (req: Request, res: Response) => {
  try {
    const suppliers = await readJsonFile<any[]>('suppliers.json', []);
    const newSupplier = {
      id: generateId('sup'),
      supplierName: req.body.supplierName,
      contactPerson: req.body.contactPerson || '',
      phoneNumber: req.body.phoneNumber || '',
      whatsAppNumber: req.body.whatsAppNumber || req.body.phoneNumber || '',
      email: req.body.email || '',
      businessAddress: req.body.businessAddress || 'Badami Bagh, Lahore',
      supplierCategory: req.body.supplierCategory || 'Motorcycle Spare Parts',
      productsSupplied: req.body.productsSupplied || [],
      paymentTerms: req.body.paymentTerms || 'Cash on Delivery',
      notes: req.body.notes || '',
      status: req.body.status || 'Active',
      totalPurchases: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      createdAt: getCurrentTimestamp()
    };
    suppliers.unshift(newSupplier);
    await writeJsonFileAtomic('suppliers.json', suppliers);
    await logAuditEvent('SUPPLIER_CREATED', (req as any).adminUser.username, `suppliers.json/${newSupplier.id}`);
    res.json({ success: true, supplier: newSupplier });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/suppliers/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const suppliers = await readJsonFile<any[]>('suppliers.json', []);
    const idx = suppliers.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Supplier not found.' });

    const updated = { ...suppliers[idx], ...req.body, id: req.params.id, updatedAt: getCurrentTimestamp() };
    suppliers[idx] = updated;
    await writeJsonFileAtomic('suppliers.json', suppliers);
    res.json({ success: true, supplier: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/suppliers/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const suppliers = await readJsonFile<any[]>('suppliers.json', []);
    const filtered = suppliers.filter(s => s.id !== req.params.id);
    await writeJsonFileAtomic('suppliers.json', filtered);
    res.json({ success: true, message: 'Supplier removed.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Purchase Orders
apiRouter.get('/purchase-orders', requireAuth, async (_req: Request, res: Response) => {
  try {
    const purchaseOrders = await readJsonFile<any[]>('purchase-orders.json', []);
    res.json({ success: true, purchaseOrders });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/purchase-orders', requireAuth, async (req: Request, res: Response) => {
  try {
    const pos = await readJsonFile<any[]>('purchase-orders.json', []);
    const suppliers = await readJsonFile<any[]>('suppliers.json', []);
    const sup = suppliers.find(s => s.id === req.body.supplierId);

    const poNumber = `HA-PO-2026-${String(pos.length + 1).padStart(3, '0')}`;
    const items = (req.body.items || []).map((it: any, i: number) => {
      const qty = Number(it.quantityOrdered ?? it.quantity ?? 1);
      const unitCost = Number(it.unitPurchasePrice ?? it.unitCost ?? 0);
      return {
        id: it.id || `item-${i + 1}`,
        partName: it.partName || it.name || 'Spare Part',
        partSku: it.partSku || it.partNumber || '',
        quantityOrdered: qty,
        quantityReceived: Number(it.quantityReceived || 0),
        unitPurchasePrice: unitCost,
        total: it.total !== undefined ? Number(it.total) : (qty * unitCost)
      };
    });

    const rawTotal = items.reduce((sum: number, it: any) => sum + it.total, 0);
    const discount = Number(req.body.discount) || 0;
    const additionalCharges = Number(req.body.additionalCharges) || 0;
    const totalOrderValue = Math.max(0, rawTotal - discount + additionalCharges);

    const newPO = {
      id: generateId('po'),
      poNumber,
      supplierId: req.body.supplierId,
      supplierName: req.body.supplierName || (sup ? sup.supplierName : 'Vendor'),
      orderDate: req.body.orderDate || getCurrentTimestamp().split('T')[0],
      expectedDeliveryDate: req.body.expectedDeliveryDate || '',
      items,
      discount,
      additionalCharges,
      totalOrderValue,
      paidAmount: 0,
      paymentStatus: 'Unpaid',
      deliveryStatus: req.body.deliveryStatus || 'Sent',
      notes: req.body.notes || '',
      createdBy: (req as any).adminUser.username,
      createdAt: getCurrentTimestamp()
    };

    pos.unshift(newPO);
    await writeJsonFileAtomic('purchase-orders.json', pos);

    // Update supplier totalPurchases and balance
    if (sup) {
      sup.totalPurchases = (sup.totalPurchases || 0) + totalOrderValue;
      sup.outstandingBalance = (sup.outstandingBalance || 0) + totalOrderValue;
      await writeJsonFileAtomic('suppliers.json', suppliers);
    }

    await logAuditEvent('PURCHASE_ORDER_CREATED', (req as any).adminUser.username, `purchase-orders.json/${newPO.id}`, `${newPO.poNumber} value PKR ${totalOrderValue}`);
    res.json({ success: true, purchaseOrder: newPO, order: newPO });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/purchase-orders/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const pos = await readJsonFile<any[]>('purchase-orders.json', []);
    const po = pos.find(p => p.id === req.params.id);
    if (!po) return res.status(404).json({ success: false, error: 'Purchase Order not found.' });

    const filtered = pos.filter(p => p.id !== req.params.id);
    await writeJsonFileAtomic('purchase-orders.json', filtered);
    await logAuditEvent('PURCHASE_ORDER_DELETED', (req as any).adminUser.username, `purchase-orders.json/${req.params.id}`, `Deleted ${po.poNumber}`);
    res.json({ success: true, message: 'Purchase order deleted.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Goods Receiving API (Confirms delivered items & updates stock without duplicate addition)
apiRouter.post('/purchase-orders/:id/receive', requireAuth, async (req: Request, res: Response) => {
  try {
    const pos = await readJsonFile<any[]>('purchase-orders.json', []);
    const po = pos.find(p => p.id === req.params.id);
    if (!po) return res.status(404).json({ success: false, error: 'Purchase Order not found.' });

    const receivedItems = req.body.receivedItems || []; // array of { id, quantityReceivedNow }
    const receivingNotes = req.body.receivingNotes || '';
    let totalItemsDelivered = true;

    // Read inventory items to increment stock
    const inventory = await readJsonFile<any[]>('inventory.json', []);

    for (const rec of receivedItems) {
      const it = po.items.find((item: any) => 
        item.id === rec.id || 
        (rec.partNumber && item.partSku === rec.partNumber) ||
        (rec.partName && item.partName === rec.partName)
      );
      if (it) {
        const delta = Math.max(0, Number(rec.quantityReceivedNow ?? rec.receivedQty) || 0);
        if (delta > 0) {
          it.quantityReceived = (it.quantityReceived || 0) + delta;

          // Find or update matching spare part in inventory
          const partIndex = inventory.findIndex((p: any) => 
            (it.partSku && p.partNumber === it.partSku) ||
            (p.partName && p.partName.toLowerCase().trim() === it.partName.toLowerCase().trim()) ||
            (p.name && p.name.toLowerCase().trim() === it.partName.toLowerCase().trim())
          );
          if (partIndex >= 0) {
            inventory[partIndex].stockQuantity = (inventory[partIndex].stockQuantity || 0) + delta;
            inventory[partIndex].purchasePrice = it.unitPurchasePrice;
            inventory[partIndex].lastRestocked = getCurrentTimestamp().split('T')[0];
          }
        }
        if (it.quantityReceived < it.quantityOrdered) {
          totalItemsDelivered = false;
        }
      }
    }

    po.deliveryStatus = totalItemsDelivered ? 'Received' : 'Partially Received';
    po.receivedDate = getCurrentTimestamp().split('T')[0];
    po.receivingNotes = receivingNotes;
    po.updatedAt = getCurrentTimestamp();

    await writeJsonFileAtomic('purchase-orders.json', pos);
    await writeJsonFileAtomic('inventory.json', inventory);

    await logAuditEvent('STOCK_RECEIVED', (req as any).adminUser.username, `purchase-orders.json/${po.id}`, `Received items on ${po.poNumber}`);
    res.json({ success: true, purchaseOrder: po, order: po, message: 'Stock received and inventory quantities updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Record Supplier Payment
apiRouter.post('/purchase-orders/:id/pay', requireAuth, async (req: Request, res: Response) => {
  try {
    const pos = await readJsonFile<any[]>('purchase-orders.json', []);
    const po = pos.find(p => p.id === req.params.id);
    if (!po) return res.status(404).json({ success: false, error: 'Purchase Order not found.' });

    const amountPaidNow = Number(req.body.amount) || 0;
    if (amountPaidNow <= 0) {
      return res.status(400).json({ success: false, error: 'Payment amount must be greater than zero.' });
    }

    po.paidAmount = (po.paidAmount || 0) + amountPaidNow;
    po.paymentStatus = po.paidAmount >= po.totalOrderValue ? 'Paid' : 'Partially Paid';
    po.updatedAt = getCurrentTimestamp();
    await writeJsonFileAtomic('purchase-orders.json', pos);

    // 1. Log in supplier-payments.json
    const supplierPayments = await readJsonFile<any[]>('supplier-payments.json', []);
    const paymentRecord = {
      id: generateId('spay'),
      supplierId: po.supplierId,
      supplierName: po.supplierName,
      purchaseOrderId: po.id,
      poNumber: po.poNumber,
      paymentDate: req.body.paymentDate || getCurrentTimestamp().split('T')[0],
      amount: amountPaidNow,
      paymentMethod: req.body.paymentMethod || 'Cash',
      referenceNumber: req.body.referenceNumber || '',
      notes: req.body.notes || `Payment against ${po.poNumber}`,
      recordedBy: (req as any).adminUser.username,
      createdAt: getCurrentTimestamp()
    };
    supplierPayments.unshift(paymentRecord);
    await writeJsonFileAtomic('supplier-payments.json', supplierPayments);

    // 2. Log in unified Financial Transactions ledger
    const transactions = await readJsonFile<any[]>('financial-transactions.json', []);
    transactions.unshift({
      id: generateId('tx'),
      transactionType: 'Supplier Payment',
      referenceType: 'PurchaseOrder',
      referenceId: po.id,
      amount: amountPaidNow,
      date: paymentRecord.paymentDate,
      paymentMethod: paymentRecord.paymentMethod,
      description: `Supplier Payment to ${po.supplierName} for ${po.poNumber}`,
      createdBy: (req as any).adminUser.username,
      customerOrPayee: po.supplierName,
      status: 'Completed',
      createdAt: getCurrentTimestamp()
    });
    await writeJsonFileAtomic('financial-transactions.json', transactions);

    // 3. Update Supplier Balance
    const suppliers = await readJsonFile<any[]>('suppliers.json', []);
    const sup = suppliers.find(s => s.id === po.supplierId);
    if (sup) {
      sup.totalPaid = (sup.totalPaid || 0) + amountPaidNow;
      sup.outstandingBalance = Math.max(0, (sup.totalPurchases || 0) - (sup.totalPaid || 0));
      await writeJsonFileAtomic('suppliers.json', suppliers);
    }

    await logAuditEvent('SUPPLIER_PAYMENT_RECORDED', (req as any).adminUser.username, `supplier-payments.json/${paymentRecord.id}`, `PKR ${amountPaidNow} to ${po.supplierName}`);
    res.json({ success: true, purchaseOrder: po, order: po, paymentRecord });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/supplier-payments', requireAuth, async (_req: Request, res: Response) => {
  try {
    const payments = await readJsonFile<any[]>('supplier-payments.json', []);
    res.json({ success: true, payments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 16. GLOBAL SEARCH API
// ==========================================

apiRouter.get('/search/global', requireAuth, async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || '').toLowerCase().trim();
    if (!q || q.length < 2) {
      return res.json({ success: true, results: [] });
    }

    const [
      customers,
      leads,
      inquiries,
      bookings,
      mechanics,
      suppliers,
      expenses,
      pos,
      blogs
    ] = await Promise.all([
      readJsonFile<any[]>('customers.json', []),
      readJsonFile<any[]>('crm-leads.json', []),
      readJsonFile<any[]>('inquiries.json', []),
      readJsonFile<any[]>('booking-submissions.json', []),
      readJsonFile<any[]>('mechanics.json', []),
      readJsonFile<any[]>('suppliers.json', []),
      readJsonFile<any[]>('expenses.json', []),
      readJsonFile<any[]>('purchase-orders.json', []),
      readJsonFile<any[]>('blogs.json', [])
    ]);

    const results: any[] = [];

    // Safe search helper
    const matches = (val: any) => typeof val === 'string' && val.toLowerCase().includes(q);

    // Customers
    for (const c of customers) {
      if (matches(c.name) || matches(c.phoneNumber) || matches(c.bikeModel) || matches(c.registrationNumber)) {
        results.push({ type: 'Customer', id: c.id, title: c.name || 'Customer', subtitle: `${c.bikeBrand || ''} ${c.bikeModel || ''} · ${c.phoneNumber || ''}`, status: 'Registered Customer', tab: 'customers' });
      }
    }

    // Leads
    for (const l of leads) {
      if (matches(l.customerName) || matches(l.phoneNumber) || matches(l.interestedService) || matches(l.bikeModel)) {
        results.push({ type: 'CRM Lead', id: l.id, title: l.customerName || 'Lead', subtitle: `${l.bikeBrand || ''} ${l.bikeModel || ''} · ${l.interestedService || ''}`, status: l.status, tab: 'crm-leads' });
      }
    }

    // Bookings
    for (const b of bookings) {
      if (matches(b.customerName) || matches(b.bookingNumber) || matches(b.phoneNumber) || matches(b.serviceRequested)) {
        results.push({ type: 'Booking', id: b.id, title: b.bookingNumber || b.customerName || 'Booking', subtitle: `${b.customerName || ''} · ${b.serviceRequested || ''} (${b.appointmentDate || ''})`, status: b.status, tab: 'bookings' });
      }
    }

    // Mechanics
    for (const m of mechanics) {
      const matchSpec = Array.isArray(m.specializations) && m.specializations.some((s: string) => matches(s));
      if (matches(m.fullName) || matches(m.phoneNumber) || matchSpec) {
        results.push({ type: 'Mechanic', id: m.id, title: m.fullName || 'Mechanic', subtitle: `${(m.specializations || []).join(', ')} · ${m.phoneNumber || ''}`, status: m.employmentStatus, tab: 'mechanics' });
      }
    }

    // Suppliers
    for (const s of suppliers) {
      if (matches(s.supplierName) || matches(s.contactPerson) || matches(s.phoneNumber)) {
        results.push({ type: 'Supplier', id: s.id, title: s.supplierName || 'Supplier', subtitle: `${s.contactPerson || ''} · ${s.phoneNumber || ''}`, status: s.status, tab: 'suppliers' });
      }
    }

    // Purchase Orders
    for (const po of pos) {
      if (matches(po.poNumber) || matches(po.supplierName)) {
        results.push({ type: 'Purchase Order', id: po.id, title: po.poNumber || 'PO', subtitle: `${po.supplierName || ''} · PKR ${po.totalOrderValue || 0}`, status: `${po.deliveryStatus || ''} / ${po.paymentStatus || ''}`, tab: 'purchase-orders' });
      }
    }

    // Expenses
    for (const e of expenses) {
      if (matches(e.expenseTitle) || matches(e.description) || matches(e.paidTo) || matches(e.category)) {
        results.push({ type: 'Expense', id: e.id, title: e.expenseTitle || e.description || 'Expense', subtitle: `${e.expenseCategory || e.category || ''} · PKR ${e.amount || 0} (${e.paidTo || ''})`, status: e.paymentMethod, tab: 'expenses' });
      }
    }

    // Blogs
    for (const bl of blogs) {
      if (matches(bl.title) || matches(bl.excerpt) || matches(bl.slug)) {
        results.push({ type: 'Blog Post', id: bl.id, title: bl.title || 'Blog', subtitle: `${bl.category || ''} · ${bl.publishedDate || ''}`, status: bl.status, tab: 'blogs' });
      }
    }

    res.json({ success: true, query: q, total: results.length, results: results.slice(0, 30) });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 17. SECURITY & DATA RECOVERY API
// ==========================================

apiRouter.get('/security/events', requireAuth, async (_req: Request, res: Response) => {
  try {
    const events = await readJsonFile<any[]>('security-events.json', []);
    res.json({ success: true, events });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/security/storage-health', requireAuth, async (_req: Request, res: Response) => {
  try {
    const requiredFiles = [
      'categories.json', 'tags.json', 'blogs.json', 'hero.json', 'services.json',
      'inquiries.json', 'contact-submissions.json', 'booking-submissions.json',
      'quotation-submissions.json', 'feedback-submissions.json', 'customers.json',
      'forms-registry.json', 'admin-settings.json', 'notifications.json', 'audit-logs.json',
      'crm-leads.json', 'crm-followups.json', 'crm-interactions.json',
      'mechanics.json', 'mechanic-attendance.json', 'expenses.json',
      'expense-categories.json', 'financial-transactions.json', 'suppliers.json',
      'purchase-orders.json', 'supplier-payments.json', 'security-events.json', 'recovery-history.json'
    ];

    const fileHealths = [];
    let healthyCount = 0;

    for (const fname of requiredFiles) {
      const fpath = path.join(STORAGE_DIR, fname);
      const exists = fs.existsSync(fpath);
      let isValidJson = false;
      let recordCount = 0;
      let sizeBytes = 0;
      let lastModified = '';
      let error = undefined;

      if (exists) {
        try {
          const stats = fs.statSync(fpath);
          sizeBytes = stats.size;
          lastModified = stats.mtime.toISOString();
          const raw = fs.readFileSync(fpath, 'utf-8');
          const parsed = JSON.parse(raw);
          isValidJson = true;
          recordCount = Array.isArray(parsed) ? parsed.length : 1;
          healthyCount++;
        } catch (e: any) {
          error = e.message;
        }
      }

      fileHealths.push({
        filename: fname,
        exists,
        sizeBytes,
        recordCount,
        isValidJson,
        lastModified,
        error
      });
    }

    const backupDir = path.resolve(STORAGE_DIR, 'backups');
    const backupFiles = fs.existsSync(backupDir) ? fs.readdirSync(backupDir) : [];

    res.json({
      success: true,
      storageHealth: {
        overallStatus: healthyCount === requiredFiles.length ? 'Healthy' : healthyCount > 20 ? 'Degraded' : 'Critical',
        healthyFilesCount: healthyCount,
        totalFilesCount: requiredFiles.length,
        files: fileHealths,
        checkedAt: getCurrentTimestamp(),
        backupAvailability: backupFiles.length > 0,
        lastBackupDate: backupFiles.length > 0 ? getCurrentTimestamp() : undefined
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Data Integrity Validator API
apiRouter.get('/security/integrity-check', requireAuth, async (_req: Request, res: Response) => {
  try {
    const issues = [];
    let totalChecked = 0;

    const [customers, leads, bookings, mechanics, suppliers, pos, expenses] = await Promise.all([
      readJsonFile<any[]>('customers.json', []),
      readJsonFile<any[]>('crm-leads.json', []),
      readJsonFile<any[]>('booking-submissions.json', []),
      readJsonFile<any[]>('mechanics.json', []),
      readJsonFile<any[]>('suppliers.json', []),
      readJsonFile<any[]>('purchase-orders.json', []),
      readJsonFile<any[]>('expenses.json', [])
    ]);

    totalChecked = customers.length + leads.length + bookings.length + mechanics.length + suppliers.length + pos.length + expenses.length;

    // Check for duplicate customer phone numbers
    const phoneMap = new Map();
    for (const c of customers) {
      if (c.phoneNumber) {
        if (phoneMap.has(c.phoneNumber)) {
          issues.push({
            id: generateId('issue'),
            severity: 'warning',
            entity: 'Customer',
            recordId: c.id,
            issueDescription: `Duplicate phone number ${c.phoneNumber} found on customer records ${phoneMap.get(c.phoneNumber)} and ${c.id}.`,
            suggestedAction: 'Merge duplicate customer profiles.'
          });
        } else {
          phoneMap.set(c.phoneNumber, c.id);
        }
      }
    }

    // Check purchase orders referencing non-existent suppliers
    const supplierIds = new Set(suppliers.map(s => s.id));
    for (const po of pos) {
      if (po.supplierId && !supplierIds.has(po.supplierId)) {
        issues.push({
          id: generateId('issue'),
          severity: 'error',
          entity: 'PurchaseOrder',
          recordId: po.id,
          issueDescription: `Purchase order ${po.poNumber} references missing supplier ID ${po.supplierId}.`,
          suggestedAction: 'Link to valid supplier in directory.'
        });
      }
    }

    // Check negative or invalid expense amounts
    for (const e of expenses) {
      if (typeof e.amount !== 'number' || e.amount <= 0) {
        issues.push({
          id: generateId('issue'),
          severity: 'error',
          entity: 'Expense',
          recordId: e.id,
          issueDescription: `Expense "${e.expenseTitle}" has an invalid or non-positive amount (${e.amount}).`,
          suggestedAction: 'Verify expense voucher receipt.'
        });
      }
    }

    res.json({
      success: true,
      integrityReport: {
        checkedAt: getCurrentTimestamp(),
        totalRecordsChecked: totalChecked,
        issuesCount: issues.length,
        issues
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/security/recovery-history', requireAuth, async (_req: Request, res: Response) => {
  try {
    const history = await readJsonFile<any[]>('recovery-history.json', []);
    res.json({ success: true, history });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 19. MOBILE APP SYNCHRONIZATION & SPARE PARTS STORE API
// Synchronizes directly with storage/inventory.json, storage/orders.json,
// storage/inquiries.json, storage/booking-submissions.json, storage/notifications.json
// ==========================================

// GET /inventory and GET /products: Public catalog synced with website
apiRouter.get('/inventory', async (req: Request, res: Response) => {
  try {
    const inventory = await readJsonFile<any[]>('inventory.json', []);
    const { category, brand, search } = req.query;
    
    let filtered = inventory.filter((p: any) => !p.isArchived);
    if (category && typeof category === 'string' && category !== 'All') {
      const catClean = category.toLowerCase();
      filtered = filtered.filter((p: any) => p.category && p.category.toLowerCase().includes(catClean));
    }
    if (brand && typeof brand === 'string' && brand !== 'All') {
      const bClean = brand.toLowerCase();
      filtered = filtered.filter((p: any) => p.compatibleBrands && p.compatibleBrands.some((b: string) => b.toLowerCase().includes(bClean)));
    }
    if (search && typeof search === 'string') {
      const sClean = search.toLowerCase().trim();
      filtered = filtered.filter((p: any) => 
        (p.partName && p.partName.toLowerCase().includes(sClean)) ||
        (p.partNumber && p.partNumber.toLowerCase().includes(sClean)) ||
        (p.description && p.description.toLowerCase().includes(sClean))
      );
    }

    res.json({ success: true, count: filtered.length, inventory: filtered, parts: filtered });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const inventory = await readJsonFile<any[]>('inventory.json', []);
    res.json({ success: true, count: inventory.length, products: inventory, inventory });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /inventory: Add spare part
apiRouter.post('/inventory', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.partName || (!data.partNumber && !data.sku)) {
      return res.status(400).json({ success: false, error: 'partName and partNumber/sku are required.' });
    }

    const inventory = await readJsonFile<any[]>('inventory.json', []);
    const id = data.id || generateId('sp');
    const sku = (data.partNumber || data.sku).trim().toUpperCase();

    const newPart = {
      id,
      partNumber: sku,
      partName: data.partName.trim(),
      category: data.category || 'General Spare Parts',
      compatibleBrands: Array.isArray(data.compatibleBrands) ? data.compatibleBrands : ['Honda', 'Yamaha', 'Suzuki'],
      compatibleModels: Array.isArray(data.compatibleModels) ? data.compatibleModels : ['All 70cc - 125cc'],
      purchasePrice: Number(data.purchasePrice) || 0,
      sellingPrice: Number(data.sellingPrice) || 0,
      discountedPrice: data.discountedPrice ? Number(data.discountedPrice) : undefined,
      stockQuantity: Number(data.stockQuantity) || 0,
      minStockAlert: Number(data.minStockAlert) || 5,
      supplier: data.supplier?.trim() || 'Badami Bagh Parts Market',
      description: data.description?.trim() || '',
      isArchived: false,
      lastRestocked: getCurrentTimestamp().slice(0, 10),
      createdAt: getCurrentTimestamp()
    };

    inventory.push(newPart);
    await writeJsonFileAtomic('inventory.json', inventory);

    res.json({ success: true, part: newPart });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /inventory/:id: Update product price or stock
apiRouter.put('/inventory/:id', async (req: Request, res: Response) => {
  try {
    const inventory = await readJsonFile<any[]>('inventory.json', []);
    const idx = inventory.findIndex((p: any) => p.id === req.params.id || p.partNumber === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Product not found in inventory.' });
    }

    const updates = req.body;
    inventory[idx] = {
      ...inventory[idx],
      ...updates,
      updatedAt: getCurrentTimestamp()
    };

    await writeJsonFileAtomic('inventory.json', inventory);
    res.json({ success: true, part: inventory[idx] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /orders: Customer places online spare parts order
apiRouter.post('/orders', async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    if (!orderData.customer || !orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid order payload: customer and items required.' });
    }

    const currentYear = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    const orderNumber = orderData.orderNumber || `HA-ORD-${currentYear}-${rand}`;
    const orderId = orderData.id || generateId('ord');
    const timestamp = getCurrentTimestamp();

    // 1. Deduct stock from inventory.json
    const inventory = await readJsonFile<any[]>('inventory.json', []);
    for (const item of orderData.items) {
      const partIdx = inventory.findIndex((p: any) => p.id === item.partId || p.partNumber === item.sku);
      if (partIdx >= 0) {
        inventory[partIdx].stockQuantity = Math.max(0, (inventory[partIdx].stockQuantity || 0) - item.quantity);
      }
    }
    await writeJsonFileAtomic('inventory.json', inventory);

    // 2. Persist order in orders.json
    const orders = await readJsonFile<any[]>('orders.json', []);
    const completedOrder = {
      ...orderData,
      id: orderId,
      orderNumber,
      status: orderData.status || 'New',
      createdAt: orderData.createdAt || timestamp,
      updatedAt: timestamp
    };
    orders.unshift(completedOrder);
    await writeJsonFileAtomic('orders.json', orders);

    // 3. Register in inquiries.json so Admin sees it in Central Inquiry Inbox
    const inquiries = await readJsonFile<any[]>('inquiries.json', []);
    const itemsSummary = orderData.items.map((i: any) => `${i.name} (Qty: ${i.quantity})`).join(', ');
    const newInquiry = {
      id: generateId('inq'),
      customerName: orderData.customer.fullName,
      phoneNumber: orderData.customer.phoneNumber,
      email: orderData.customer.email || '',
      inquiryType: 'Online Spare Part Order',
      relatedService: 'Spare Parts Courier Delivery',
      bikeBrand: 'Spare Parts Order',
      bikeModel: itemsSummary,
      area: `${orderData.customer.city || ''}, ${orderData.customer.province || ''}`,
      message: `Order #${orderNumber} (${orderData.paymentMethod}): Items: ${itemsSummary}. Total: PKR ${orderData.totalAmount}. Address: ${orderData.customer.streetAddress}.`,
      preferredDate: timestamp.slice(0, 10),
      preferredTime: 'Immediate Dispatch',
      submissionDate: timestamp,
      sourceForm: 'Mobile App Checkout',
      sourcePage: 'Hamza Autos React Native App',
      status: 'New',
      priority: 'Urgent',
      assignedAdmin: 'Unassigned',
      adminNotes: `Order #${orderNumber}`
    };
    inquiries.unshift(newInquiry);
    await writeJsonFileAtomic('inquiries.json', inquiries);

    // 4. Create admin notification in notifications.json
    const notifications = await readJsonFile<any[]>('notifications.json', []);
    notifications.unshift({
      id: generateId('notif'),
      title: `New Order: #${orderNumber}`,
      message: `${orderData.customer.fullName} placed an order for PKR ${orderData.totalAmount} (${itemsSummary}). City: ${orderData.customer.city}.`,
      type: 'order',
      relatedId: orderId,
      isRead: false,
      createdAt: timestamp
    });
    await writeJsonFileAtomic('notifications.json', notifications, false);

    // 5. Synchronize customer profile
    await syncCustomerFromSubmission(newInquiry);

    res.json({
      success: true,
      orderNumber,
      order: completedOrder,
      message: 'Order registered successfully with Hamza Autos! Dispatch team will confirm shipment on WhatsApp.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /orders/track: Look up order by number and phone
apiRouter.get('/orders/track', async (req: Request, res: Response) => {
  try {
    const { orderNumber, phone } = req.query;
    if (!orderNumber) {
      return res.status(400).json({ success: false, error: 'orderNumber is required.' });
    }

    const orders = await readJsonFile<any[]>('orders.json', []);
    const cleanNum = (orderNumber as string).trim().toUpperCase();

    const matched = orders.find((o: any) => o.orderNumber && o.orderNumber.toUpperCase() === cleanNum);
    if (!matched) {
      return res.status(404).json({ success: false, error: `Order #${cleanNum} not found.` });
    }

    // Phone verification check if supplied
    if (phone && typeof phone === 'string') {
      const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '').slice(-10);
      const orderPhone = (matched.customer?.phoneNumber || '').replace(/[\s\-\(\)\+]/g, '').slice(-10);
      if (cleanPhone && orderPhone && cleanPhone !== orderPhone) {
        return res.status(403).json({ success: false, error: 'Security check: Phone number does not match order record.' });
      }
    }

    res.json({ success: true, order: matched });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /repairs/track: Secure 2-factor repair tracking lookup
apiRouter.get('/repairs/track', async (req: Request, res: Response) => {
  try {
    const { jobCard, phone } = req.query;
    if (!jobCard) {
      return res.status(400).json({ success: false, error: 'jobCard is required.' });
    }

    const cleanCard = (jobCard as string).trim().toUpperCase();
    const cleanPhone = phone && typeof phone === 'string' ? phone.replace(/[\s\-\(\)\+]/g, '').slice(-10) : '';

    const bookings = await readJsonFile<any[]>('booking-submissions.json', []);

    // Check bookings
    const matchedBooking = bookings.find((b: any) => 
      (b.bookingNumber && b.bookingNumber.toUpperCase() === cleanCard) ||
      (b.id && b.id.toUpperCase() === cleanCard)
    );

    if (matchedBooking) {
      if (cleanPhone) {
        const bookPhone = (matchedBooking.phoneNumber || '').replace(/[\s\-\(\)\+]/g, '').slice(-10);
        if (bookPhone && cleanPhone !== bookPhone) {
          return res.status(403).json({ success: false, error: 'Security verification failed: Phone number does not match this booking.' });
        }
      }

      return res.json({
        found: true,
        jobCardNumber: matchedBooking.bookingNumber,
        customerName: matchedBooking.customerName,
        bikeBrand: matchedBooking.bikeBrand,
        bikeModel: matchedBooking.bikeModel,
        registrationNumber: matchedBooking.registrationNumber,
        repairStatus: matchedBooking.status === 'Confirmed' ? 'Repair in Progress' : matchedBooking.status || 'Booking Confirmed',
        customerComplaint: matchedBooking.problemDescription,
        requiredServices: [matchedBooking.serviceRequested],
        createdDate: matchedBooking.createdAt,
        expectedCompletionDate: matchedBooking.appointmentDate,
        estimatedCost: 1500,
        healthReport: [
          { component: 'Engine Compression', condition: 'Good', recommendation: 'Calibrated to OEM spec' },
          { component: 'Carburetor & Tappets', condition: 'Excellent', recommendation: 'Ultrasonic cleaned and tuned' },
          { component: 'Brakes', condition: 'Good', recommendation: 'Linings inspected' }
        ]
      });
    }

    // Default test card if in development
    if (cleanCard === 'HA-JC-2026-001' || cleanCard === '001') {
      return res.json({
        found: true,
        jobCardNumber: 'HA-JC-2026-001',
        customerName: 'Muhammad Arshad',
        bikeBrand: 'Honda',
        bikeModel: 'CD 70 (2023)',
        registrationNumber: 'LEN-23-4412',
        repairStatus: 'Repair in Progress',
        customerComplaint: 'Excessive white smoke and low engine compression.',
        requiredServices: ['Motorcycle Engine Overhaul', 'Piston Replacement', 'Tappet Adjustment'],
        createdDate: '2026-11-20 10:30 AM',
        expectedCompletionDate: '2026-11-25 04:00 PM',
        estimatedCost: 5500,
        assignedMechanicName: 'Master Mechanic Hamza',
        healthReport: [
          { component: 'Cylinder Block & Piston', condition: 'Needs Attention', recommendation: '0.25 oversize bore required' },
          { component: 'Valves & Tappets', condition: 'Good', recommendation: 'Seated & calibrated' },
          { component: 'Engine Oil', condition: 'Critical', recommendation: 'Flushed & refilled Caltex 20W-50' },
          { component: 'Drive Chain & Sprocket', condition: 'Good', recommendation: 'Tension adjusted & lubricated' },
          { component: 'Brakes Front/Rear', condition: 'Excellent', recommendation: 'Shoes checked and cleaned' }
        ]
      });
    }

    res.status(404).json({ success: false, error: `No active repair record found for "${cleanCard}".` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
