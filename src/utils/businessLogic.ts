import { 
  BUSINESS_INFO, 
  SERVICES_LIST, 
  BLOG_POSTS, 
  GALLERY_ITEMS, 
  FAQS, 
  CUSTOMER_REVIEWS 
} from '../data/businessData';
import { 
  InquiryLead, 
  AnalyticsSummary, 
  ServiceItem, 
  BlogPost, 
  GalleryItem, 
  FAQItem, 
  CustomerReview, 
  SiteSettings 
} from '../types';

export function buildWhatsAppLink(options?: {
  name?: string;
  brand?: string;
  model?: string;
  service?: string;
  problem?: string;
}): string {
  const currentSettings = getStoredSettings();
  const rawNumber = currentSettings.whatsappNumber.replace(/[^0-9]/g, '');
  const base = `https://wa.me/${rawNumber || BUSINESS_INFO.whatsappRaw}`;

  if (!options || (!options.name && !options.service && !options.brand && !options.problem)) {
    const defaultMsg = "Hello Hamza Autos, I need assistance with my motorcycle repair. Please share the details.";
    return `${base}?text=${encodeURIComponent(defaultMsg)}`;
  }

  let text = "Hello Hamza Autos, I would like to enquire about motorcycle repair in Badami Bagh:\n";
  if (options.name) text += `• Name: ${options.name.trim()}\n`;
  if (options.brand) text += `• Bike Brand: ${options.brand.trim()}\n`;
  if (options.model) text += `• Model: ${options.model.trim()}\n`;
  if (options.service) text += `• Service Needed: ${options.service.trim()}\n`;
  if (options.problem) text += `• Issue / Details: ${options.problem.trim()}\n`;
  text += "\nPlease let me know availability and estimated time. Thank you!";

  return `${base}?text=${encodeURIComponent(text)}`;
}

export function validatePakistaniPhone(phone: string): { isValid: boolean; normalized: string; error?: string } {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Format 1: 03001234567 (11 digits starting with 03)
  // Format 2: +923001234567 (13 chars starting with +923)
  // Format 3: 923001234567 (12 digits starting with 923)
  const regex = /^((\+92|92)|0)?3[0-9]{9}$/;

  if (!cleaned) {
    return { isValid: false, normalized: '', error: 'Phone number is required' };
  }

  if (!regex.test(cleaned)) {
    return { 
      isValid: false, 
      normalized: cleaned, 
      error: 'Please enter a valid Pakistani mobile number (e.g. 0325 1814548)' 
    };
  }

  let normalized = cleaned;
  if (cleaned.startsWith('0')) {
    normalized = '+92' + cleaned.slice(1);
  } else if (cleaned.startsWith('92')) {
    normalized = '+' + cleaned;
  } else if (!cleaned.startsWith('+92')) {
    normalized = '+92' + cleaned;
  }

  return { isValid: true, normalized };
}

let lastSubmissionTimestamp = 0;

export function validateLeadSubmission(data: {
  customerName: string;
  phoneNumber: string;
  serviceRequested: string;
  honeypot?: string;
  bypassCooldown?: boolean;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Spam protection 1: Honeypot trap check
  if (data.honeypot && data.honeypot.trim().length > 0) {
    errors.honeypot = 'Automated submission detected';
    return { isValid: false, errors };
  }

  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your full name';
  }

  const phoneCheck = validatePakistaniPhone(data.phoneNumber);
  if (!phoneCheck.isValid) {
    errors.phoneNumber = phoneCheck.error || 'Invalid phone number';
  }

  if (!data.serviceRequested || data.serviceRequested.trim().length === 0) {
    errors.serviceRequested = 'Please select a repair service';
  }

  // Rate limiting cooldown check if fields are otherwise valid
  const now = Date.now();
  if (Object.keys(errors).length === 0 && !data.bypassCooldown) {
    if (now - lastSubmissionTimestamp < 3000) {
      errors.cooldown = 'Please wait a moment before submitting another request.';
      return { isValid: false, errors };
    }
    lastSubmissionTimestamp = now;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function generateServiceJsonLd(service: ServiceItem) {
  const settings = getStoredSettings();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.shortDescription,
    "provider": {
      "@type": "AutoRepair",
      "name": settings.businessName || BUSINESS_INFO.name,
      "telephone": settings.phone || BUSINESS_INFO.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": settings.fullAddress || BUSINESS_INFO.fullAddress,
        "addressLocality": "Badami Bagh, Lahore",
        "addressRegion": "Punjab",
        "addressCountry": "PK"
      }
    },
    "areaServed": "Badami Bagh, Lahore",
    "serviceType": service.category
  };
}

// STORAGE KEYS
const ANALYTICS_STORAGE_KEY = 'hamza_autos_analytics';
const LEADS_STORAGE_KEY = 'hamza_autos_leads';
const SETTINGS_STORAGE_KEY = 'hamza_autos_settings';
const SERVICES_STORAGE_KEY = 'hamza_autos_services';
const BLOGS_STORAGE_KEY = 'hamza_autos_blogs';
const GALLERY_STORAGE_KEY = 'hamza_autos_gallery';
const FAQS_STORAGE_KEY = 'hamza_autos_faqs';
const REVIEWS_STORAGE_KEY = 'hamza_autos_reviews';
const ADMIN_SESSION_KEY = 'hamza_autos_admin_session';

// ANALYTICS
export function getStoredAnalytics(): AnalyticsSummary {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return {
    whatsappClicks: 142,
    phoneCallClicks: 89,
    mapDirectionsClicks: 64,
    enquiriesSubmitted: 37,
    totalPageViews: 940
  };
}

export function trackEvent(eventType: keyof AnalyticsSummary): void {
  try {
    const current = getStoredAnalytics();
    current[eventType] = (current[eventType] || 0) + 1;
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    // ignore
  }
}

// LEADS
export function getStoredLeads(): InquiryLead[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return [
    {
      id: "lead-1",
      customerName: "Imran Farooq",
      phoneNumber: "+923014589211",
      area: "Badami Bagh",
      bikeBrand: "Honda",
      bikeModel: "CG 125 (2021)",
      serviceRequested: "Motorcycle Engine Repair & Overhaul",
      problemDetails: "White smoke coming from silencer and excessive engine vibration at high RPM.",
      preferredTime: "Morning 10:00 AM",
      createdAt: "2026-11-09 14:30",
      status: "new"
    },
    {
      id: "lead-2",
      customerName: "Salman Tariq",
      phoneNumber: "+923218765432",
      area: "Shadbagh",
      bikeBrand: "Yamaha",
      bikeModel: "YBR 125G",
      serviceRequested: "Motorcycle Brake Repair",
      problemDetails: "Front disc brake lever is spongy and squealing. Needs new pads.",
      preferredTime: "Afternoon 3:00 PM",
      createdAt: "2026-11-08 17:15",
      status: "contacted"
    },
    {
      id: "lead-3",
      customerName: "Naveed Akram",
      phoneNumber: "+923334912098",
      area: "Misri Shah",
      bikeBrand: "United",
      bikeModel: "US 70",
      serviceRequested: "Bike Tuning & Fuel Economy",
      problemDetails: "Petrol average dropped to 35 km/l. Needs complete carburetor ultrasonic tuning.",
      preferredTime: "Anytime today",
      createdAt: "2026-11-07 11:00",
      status: "completed"
    }
  ];
}

export function saveLead(leadData: Omit<InquiryLead, 'id' | 'createdAt' | 'status'>): InquiryLead {
  const currentLeads = getStoredLeads();
  const newLead: InquiryLead = {
    ...leadData,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    status: 'new'
  };
  
  const updated = [newLead, ...currentLeads];
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    trackEvent('enquiriesSubmitted');
  } catch (e) {
    // ignore
  }
  return newLead;
}

export function updateLeadStatus(id: string, status: InquiryLead['status']): void {
  const currentLeads = getStoredLeads();
  const updated = currentLeads.map(l => l.id === id ? { ...l, status } : l);
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
}

export function deleteLead(id: string): void {
  const currentLeads = getStoredLeads();
  const updated = currentLeads.filter(l => l.id !== id);
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
}

// SITE SETTINGS
export function getStoredSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return {
    businessName: BUSINESS_INFO.name,
    phone: BUSINESS_INFO.phone,
    phoneRaw: BUSINESS_INFO.phoneRaw,
    whatsappNumber: BUSINESS_INFO.whatsappNumber,
    operatingHours: BUSINESS_INFO.operatingHours,
    operatingDays: BUSINESS_INFO.operatingDays,
    fullAddress: BUSINESS_INFO.fullAddress,
    seoTitle: "Hamza Autos – Bike Mechanic & Motorcycle Repair Shop in Badami Bagh, Lahore",
    seoMetaDescription: "Trusted motorcycle mechanic & repair shop in Badami Bagh, Lahore. Professional bike engine repair, tuning, oil change, electrical wiring, brakes & maintenance. Call +92 325 1814548."
  };
}

export function saveStoredSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    document.title = settings.seoTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', settings.seoMetaDescription);
    }
  } catch (e) {
    // ignore
  }
}

// SERVICES CRUD
export function getStoredServices(): ServiceItem[] {
  try {
    const raw = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return SERVICES_LIST;
}

export function saveStoredServices(services: ServiceItem[]): void {
  try {
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
  } catch (e) {
    // ignore
  }
}

// BLOGS CRUD
export function getStoredBlogs(): BlogPost[] {
  try {
    const raw = localStorage.getItem(BLOGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return BLOG_POSTS;
}

export function saveStoredBlogs(blogs: BlogPost[]): void {
  try {
    localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs));
  } catch (e) {
    // ignore
  }
}

// GALLERY CRUD
export function getStoredGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return GALLERY_ITEMS;
}

export function saveStoredGallery(items: GalleryItem[]): void {
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // ignore
  }
}

// FAQS CRUD
export function getStoredFAQs(): FAQItem[] {
  try {
    const raw = localStorage.getItem(FAQS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return FAQS.map((f, i) => ({ id: `faq-${i + 1}`, ...f }));
}

export function saveStoredFAQs(faqs: FAQItem[]): void {
  try {
    localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(faqs));
  } catch (e) {
    // ignore
  }
}

// REVIEWS CRUD
export function getStoredReviews(): CustomerReview[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return CUSTOMER_REVIEWS;
}

export function saveStoredReviews(reviews: CustomerReview[]): void {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    // ignore
  }
}

// ADMIN AUTHENTICATION
const DEFAULT_ADMIN_PASSWORD = "HamzaAutos2026!";

export function isAdminLoggedIn(): boolean {
  try {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    return session === "authenticated";
  } catch (e) {
    return false;
  }
}

export function loginAdmin(password: string): { success: boolean; error?: string } {
  if (password === DEFAULT_ADMIN_PASSWORD) {
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
    } catch (e) {
      // ignore
    }
    return { success: true };
  }
  return { success: false, error: "Incorrect password. Please verify credentials." };
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (e) {
    // ignore
  }
}
