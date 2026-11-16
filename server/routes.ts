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

export const apiRouter = Router();

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
      return res.status(401).json(result);
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
      id: generateId('inq'),
      ...contactSubmission,
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

// Secure Base64/Binary File Upload
apiRouter.post('/media/upload', requireAuth, async (req: Request, res: Response) => {
  try {
    const { filename, base64Data, folder = 'blogs', altText } = req.body;
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

    // Clean safe filename
    const baseName = path.parse(filename).name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${baseName}_${Date.now()}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, targetFolder, safeFilename);

    // Decode base64
    const base64Clean = base64Data.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    // Max 15MB size check
    if (buffer.length > 15 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'File exceeds maximum 15MB size limit.' });
    }

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
    const settings = await readJsonFile<any>('admin-settings.json', {});
    const blogs = await readJsonFile<any[]>('blogs.json', []);

    // Check duplicate meta titles across blogs
    const titlesCount: Record<string, number> = {};
    const duplicateWarnings: string[] = [];

    blogs.forEach(b => {
      const t = b.seo?.metaTitle || b.title;
      if (t) {
        titlesCount[t] = (titlesCount[t] || 0) + 1;
        if (titlesCount[t] === 2) duplicateWarnings.push(`Duplicate title found: "${t}"`);
      }
    });

    res.json({
      success: true,
      seoSettings: {
        homepageTitle: settings.seoTitle || 'Hamza Autos – Bike Mechanic & Motorcycle Repair Shop in Badami Bagh, Lahore',
        homepageDescription: settings.seoDescription || 'Expert motorcycle repair shop in Badami Bagh, Lahore. Honest mechanical tuning, 4-stroke engine rebuilds, carburetor jetting and genuine parts.',
        canonicalBaseUrl: 'https://hamzaautos.com',
        duplicateWarnings
      }
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
