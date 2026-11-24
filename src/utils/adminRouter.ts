/**
 * Hamza Autos - Admin & Public Routing System
 * Provides clean HTML5 browser history routing for /admin and subroutes
 * Ensures zero hash-based URLs for the admin panel and handles legacy fallback
 */

import { AdminTab } from '../views/AdminView';

export interface RouteInfo {
  isAdmin: boolean;
  adminTab: AdminTab;
  isLogin: boolean;
  publicView: string;
  publicSlug?: string;
}

// Map between AdminTab and URL slug
export const TAB_ROUTE_MAP: Record<AdminTab, string> = {
  // 1. Overview
  'dashboard': 'dashboard',
  'analytics': 'reports',
  'global-search': 'search',
  'notifications': 'notifications',

  // 2. Customer Management
  'inquiries': 'inquiries',
  'crm-leads': 'crm-leads',
  'crm-followups': 'followups',
  'customers': 'customers',

  // 3. Workshop Operations
  'bookings': 'bookings',
  'jobcards': 'jobcards',
  'mechanics': 'mechanics',
  'attendance': 'attendance',
  'inventory': 'inventory',
  'reminders': 'reminders',
  'inspections': 'inspections',
  'staff': 'staff',
  'whatsapp': 'whatsapp',

  // 4. Financial Management
  'expenses': 'expenses',
  'transactions': 'transactions',
  'profit-reports': 'profit-reports',
  'quotations': 'repair-quotations',
  'invoices': 'invoices',

  // 5. Purchasing
  'suppliers': 'suppliers',
  'purchase-orders': 'purchase-orders',
  'goods-receiving': 'goods-receiving',
  'supplier-payments': 'supplier-payments',

  // 6. Website Management
  'blogs': 'blogs',
  'blog-categories': 'blog-categories',
  'blog-tags': 'blog-tags',
  'contact-submissions': 'contact-submissions',
  'quotation-submissions': 'quotations',
  'feedback': 'feedback',
  'form-management': 'form-management',
  'website-content': 'website-content',
  'services': 'services',
  'brands': 'brands',
  'areas': 'areas',
  'faqs': 'faqs',
  'testimonials': 'testimonials',
  'media-library': 'media',
  'seo': 'seo',

  // 7. System Management
  'security-centre': 'security',
  'storage-health': 'storage-health',
  'backup-restore': 'backup',
  'audit-logs': 'activity-logs',
  'settings': 'settings',

  // 8. Online Shop & Spare Parts E-Commerce Management
  'shop-dashboard': 'shop-dashboard',
  'shop-products': 'shop-products',
  'shop-categories': 'shop-categories',
  'shop-brands': 'shop-brands',
  'shop-inventory': 'shop-inventory',
  'shop-orders': 'shop-orders',
  'shop-payments': 'shop-payments',
  'shop-shipping': 'shop-shipping',
  'shop-settings': 'shop-settings'
};

// Reverse map: URL slug / alias to AdminTab
export const ROUTE_TAB_MAP: Record<string, AdminTab> = {
  '': 'dashboard',
  'dashboard': 'dashboard',
  'reports': 'analytics',
  'analytics': 'analytics',
  'search': 'global-search',
  'global-search': 'global-search',
  'notifications': 'notifications',

  // Customer Management
  'inquiries': 'inquiries',
  'inbox': 'inquiries',
  'crm-leads': 'crm-leads',
  'crm': 'crm-leads',
  'leads': 'crm-leads',
  'followups': 'crm-followups',
  'crm-followups': 'crm-followups',
  'customers': 'customers',

  // Workshop Operations
  'bookings': 'bookings',
  'jobcards': 'jobcards',
  'mechanics': 'mechanics',
  'attendance': 'attendance',
  'inventory': 'inventory',
  'reminders': 'reminders',
  'inspections': 'inspections',
  'staff': 'staff',
  'whatsapp': 'whatsapp',

  // Financial Management
  'expenses': 'expenses',
  'transactions': 'transactions',
  'income-payments': 'transactions',
  'profit-reports': 'profit-reports',
  'profit': 'profit-reports',
  'financial-reports': 'profit-reports',
  'repair-quotations': 'quotations',
  'workshop-quotations': 'quotations',
  'invoices': 'invoices',

  // Purchasing
  'suppliers': 'suppliers',
  'purchase-orders': 'purchase-orders',
  'po': 'purchase-orders',
  'goods-receiving': 'goods-receiving',
  'receiving': 'goods-receiving',
  'supplier-payments': 'supplier-payments',

  // Website Management
  'blogs': 'blogs',
  'blog-categories': 'blog-categories',
  'blog-tags': 'blog-tags',
  'contact-submissions': 'contact-submissions',
  'quotations': 'quotation-submissions',
  'quotation-submissions': 'quotation-submissions',
  'feedback': 'feedback',
  'form-management': 'form-management',
  'website-content': 'website-content',
  'services': 'services',
  'brands': 'brands',
  'areas': 'areas',
  'faqs': 'faqs',
  'testimonials': 'testimonials',
  'media': 'media-library',
  'media-library': 'media-library',
  'seo': 'seo',

  // System Management
  'security': 'security-centre',
  'security-centre': 'security-centre',
  'storage-health': 'storage-health',
  'health': 'storage-health',
  'backup': 'backup-restore',
  'backup-restore': 'backup-restore',
  'activity-logs': 'audit-logs',
  'audit-logs': 'audit-logs',
  'settings': 'settings',

  // Shop Management
  'shop': 'shop-dashboard',
  'shop-dashboard': 'shop-dashboard',
  'shop/products': 'shop-products',
  'shop-products': 'shop-products',
  'shop/categories': 'shop-categories',
  'shop-categories': 'shop-categories',
  'shop/brands': 'shop-brands',
  'shop-brands': 'shop-brands',
  'shop/inventory': 'shop-inventory',
  'shop-inventory': 'shop-inventory',
  'shop/orders': 'shop-orders',
  'shop-orders': 'shop-orders',
  'shop/payments': 'shop-payments',
  'shop-payments': 'shop-payments',
  'shop/shipping': 'shop-shipping',
  'shop-shipping': 'shop-shipping',
  'shop/settings': 'shop-settings',
  'shop-settings': 'shop-settings'
};

/**
 * Returns the base path of the application (e.g. '/hamza-autos' for GitHub Pages, '' for root)
 */
export function getAppBasePath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname.startsWith('/hamza-autos') ? '/hamza-autos' : '';
}

/**
 * Normalizes pathname by removing the repository base if present
 */
export function getNormalizedPathname(): string {
  if (typeof window === 'undefined') return '/';
  const base = getAppBasePath();
  let path = window.location.pathname;
  if (base && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  return path;
}

/**
 * Parses the current window location to determine whether it's an Admin or Public route
 */
export function parseCurrentRoute(): RouteInfo {
  if (typeof window === 'undefined') {
    return {
      isAdmin: false,
      adminTab: 'dashboard',
      isLogin: false,
      publicView: 'home'
    };
  }

  const pathname = getNormalizedPathname();
  const hash = window.location.hash.replace(/^#\/?/, '');

  // 1. Check if URL is an Admin route via clean pathname (e.g. /admin, /admin/dashboard, /admin/login)
  if (pathname.startsWith('/admin')) {
    const subpath = pathname.replace(/^\/admin\/?/, '').split('/')[0] || '';
    const isLogin = subpath === 'login';
    const tab: AdminTab = ROUTE_TAB_MAP[subpath] || 'dashboard';

    // If there is an awkward legacy hash attached like /admin#/admin, clean it up!
    if (window.location.hash) {
      const cleanPath = `${getAppBasePath()}/admin${subpath ? `/${subpath}` : ''}`;
      window.history.replaceState(null, '', cleanPath);
    }

    return {
      isAdmin: true,
      adminTab: tab,
      isLogin,
      publicView: 'admin'
    };
  }

  // 2. Check if legacy hash points to admin (e.g. #admin, #/admin, #/admin/inquiries)
  if (hash.startsWith('admin')) {
    const parts = hash.split('/');
    const subpath = parts[1] || '';
    const isLogin = subpath === 'login';
    const tab: AdminTab = ROUTE_TAB_MAP[subpath] || 'dashboard';

    // Convert legacy hash to clean URL /admin or /admin/[subroute]
    const cleanUrl = `${getAppBasePath()}/admin${subpath ? `/${subpath}` : ''}`;
    window.history.replaceState(null, '', cleanUrl);

    return {
      isAdmin: true,
      adminTab: tab,
      isLogin,
      publicView: 'admin'
    };
  }

  // 3. Otherwise, it is a public website route
  // Check if legacy hash is present (e.g. #/services/bike-tuning or #services)
  if (hash) {
    const parts = hash.split('/');
    const view = parts[0] || 'home';
    const slug = parts[1];
    return {
      isAdmin: false,
      adminTab: 'dashboard',
      isLogin: false,
      publicView: view,
      publicSlug: slug
    };
  }

  // Direct clean pathname (e.g. /services, /services/bike-tuning, /areas, /blog, /contact, /shop)
  const cleanPath = pathname.replace(/^\/+/, '');
  const pathParts = cleanPath.split('/');

  // Shop clean route parsing: /shop, /shop/products, /shop/product/:slug, /shop/cart, etc.
  if (pathParts[0] === 'shop') {
    const sub = pathParts[1];
    if (!sub) {
      return { isAdmin: false, adminTab: 'dashboard', isLogin: false, publicView: 'shop' };
    }
    if (sub === 'products') {
      return { isAdmin: false, adminTab: 'dashboard', isLogin: false, publicView: 'shop-products' };
    }
    if (sub === 'categories') {
      return { isAdmin: false, adminTab: 'dashboard', isLogin: false, publicView: 'shop-categories' };
    }
    if (sub === 'product') {
      return { isAdmin: false, adminTab: 'dashboard', isLogin: false, publicView: 'shop-product', publicSlug: pathParts[2] || '' };
    }
    if (sub === 'cart') {
      return { isAdmin: false, adminTab: 'dashboard', isLogin: false, publicView: 'shop-cart' };
    }
    if (sub === 'checkout') {
      return { isAdmin: false, adminTab: 'dashboard', isLogin: false, publicView: 'shop-checkout' };
    }
    if (sub === 'order-confirmation') {
      return { isAdmin: false, adminTab: 'dashboard', isLogin: false, publicView: 'shop-order-confirmation', publicSlug: pathParts[2] || '' };
    }
    if (sub === 'track-order') {
      return { isAdmin: false, adminTab: 'dashboard', isLogin: false, publicView: 'shop-track-order' };
    }
  }

  const view = pathParts[0] || 'home';
  const slug = pathParts[1];

  return {
    isAdmin: false,
    adminTab: 'dashboard',
    isLogin: false,
    publicView: view || 'home',
    publicSlug: slug
  };
}

/**
 * Navigate to an admin route using clean HTML5 History API without hash
 */
export function navigateAdmin(tabOrSubroute: string | AdminTab, replace = false): void {
  if (typeof window === 'undefined') return;

  const base = getAppBasePath();
  let subroute = '';

  if (tabOrSubroute === 'login') {
    subroute = 'login';
  } else if (tabOrSubroute in TAB_ROUTE_MAP) {
    const mapped = TAB_ROUTE_MAP[tabOrSubroute as AdminTab];
    subroute = mapped === 'dashboard' ? '' : mapped;
  } else if (tabOrSubroute.startsWith('/admin')) {
    subroute = tabOrSubroute.replace(/^\/admin\/?/, '');
  } else {
    subroute = tabOrSubroute.replace(/^\//, '');
  }

  const targetPath = subroute ? `${base}/admin/${subroute}` : `${base}/admin`;

  if (window.location.pathname !== targetPath || window.location.hash) {
    if (replace) {
      window.history.replaceState(null, '', targetPath);
    } else {
      window.history.pushState(null, '', targetPath);
    }
  }

  // Dispatch popstate event to trigger re-renders
  window.dispatchEvent(new PopStateEvent('popstate'));
}

/**
 * Navigate to a public website route using clean HTML5 URLs
 */
export function navigatePublic(view: string, slug?: string): void {
  if (typeof window === 'undefined') return;

  const base = getAppBasePath();
  let cleanPath = '';

  // Handle specialized Shop URLs
  if (view === 'shop') {
    cleanPath = `${base}/shop`;
  } else if (view === 'shop-products') {
    cleanPath = `${base}/shop/products`;
  } else if (view === 'shop-categories') {
    cleanPath = `${base}/shop/categories`;
  } else if (view === 'shop-product') {
    cleanPath = `${base}/shop/product${slug ? `/${slug}` : ''}`;
  } else if (view === 'shop-cart') {
    cleanPath = `${base}/shop/cart`;
  } else if (view === 'shop-checkout') {
    cleanPath = `${base}/shop/checkout`;
  } else if (view === 'shop-order-confirmation') {
    cleanPath = `${base}/shop/order-confirmation${slug ? `/${slug}` : ''}`;
  } else if (view === 'shop-track-order') {
    cleanPath = `${base}/shop/track-order`;
  } else {
    cleanPath = `${base}/${view === 'home' ? '' : view}${slug ? `/${slug}` : ''}`.replace(/\/+/g, '/');
  }

  // Push clean path and clear hash
  window.history.pushState(null, '', cleanPath || '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
}
