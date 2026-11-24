/**
 * Hamza Autos - Central API Configuration
 * Supports Android Emulator (10.0.2.2), iOS Simulator (localhost),
 * Physical Device LAN IP, and Production URL.
 * 
 * IMPORTANT:
 * - Localhost works only for iOS simulator or web.
 * - Android emulator maps host machine port 3000 to 10.0.2.2:3000.
 * - Physical devices require host LAN IP (e.g. 192.168.x.x:3000).
 * - Production domain must be provided when deploying live.
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

export interface ApiEnvironmentConfig {
  baseUrl: string;
  timeoutMs: number;
  environment: 'development' | 'production' | 'staging';
}

// Current machine Wi-Fi / LAN IP address for physical mobile testing
export const DEV_LAN_HOST = '192.168.1.90';

// Placeholder for verified production deployment
// When live production domain is provisioned, replace this URL:
export const PRODUCTION_API_URL = 'https://api.hamzaautos.com'; // [PRODUCTION PLACEHOLDER]

function getDevBaseUrl(): string {
  // Dynamically resolve host machine IP from Expo bundler connection (Expo Go on mobile)
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any)?.manifest?.debuggerHost;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:3000`;
    }
  }

  // Fallback to detected Wi-Fi IP for physical mobile testing
  if (DEV_LAN_HOST) {
    return `http://${DEV_LAN_HOST}:3000`;
  }

  if (Platform.OS === 'android') {
    // Android emulator special alias to host loopback
    return 'http://10.0.2.2:3000';
  }
  if (Platform.OS === 'ios') {
    // iOS simulator runs on Mac host loopback
    return 'http://localhost:3000';
  }
  // Web or fallback
  return 'http://localhost:3000';
}

// Current runtime environment determination
const IS_DEV = __DEV__;

export const API_CONFIG: ApiEnvironmentConfig = {
  baseUrl: IS_DEV ? getDevBaseUrl() : PRODUCTION_API_URL,
  timeoutMs: 15000,
  environment: IS_DEV ? 'development' : 'production',
};

export const API_ENDPOINTS = {
  // Public Workshop & Inquiry
  settings: '/api/settings',
  blogs: '/api/blogs',
  categories: '/api/categories',
  bookings: '/api/bookings',
  contact: '/api/contact',
  inquiries: '/api/inquiries',
  feedback: '/api/feedback',

  // Spare Parts & Inventory (Server-synced)
  inventory: '/api/inventory',
  products: '/api/products',

  // Orders
  orders: '/api/orders',
  orderTracking: '/api/orders/track',

  // Repair Tracking
  repairTracking: '/api/repairs/track',

  // Customer Management
  customers: '/api/customers',
  customerLookup: '/api/customers/lookup',

  // Admin Auth (if admin tools accessed)
  authLogin: '/api/auth/login',
  authMe: '/api/auth/me',
} as const;

/**
 * Build complete URL for an API endpoint
 */
export function getApiUrl(endpoint: string): string {
  const base = API_CONFIG.baseUrl.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}
