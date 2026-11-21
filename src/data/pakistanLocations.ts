/**
 * Hamza Autos - Comprehensive Pakistan Cities & Provinces Data
 * For Accurate Spare Parts Nationwide Delivery & Courier Logistics
 */

import { PakistaniProvince } from '../types/shop';

export interface PakistanCityInfo {
  name: string;
  province: PakistaniProvince;
  majorHub: boolean;
  transitDays: string; // e.g. "1 - 2 Days" or "2 - 3 Days"
}

export const PAKISTAN_PROVINCES: PakistaniProvince[] = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu & Kashmir'
];

export const PAKISTAN_CITIES: PakistanCityInfo[] = [
  // Islamabad Capital Territory
  { name: 'Islamabad', province: 'Islamabad Capital Territory', majorHub: true, transitDays: '1 - 2 Days' },

  // Punjab (Major Cities & Commuter Hubs)
  { name: 'Lahore', province: 'Punjab', majorHub: true, transitDays: 'Same Day / Next Day' },
  { name: 'Faisalabad', province: 'Punjab', majorHub: true, transitDays: '1 - 2 Days' },
  { name: 'Rawalpindi', province: 'Punjab', majorHub: true, transitDays: '1 - 2 Days' },
  { name: 'Multan', province: 'Punjab', majorHub: true, transitDays: '1 - 2 Days' },
  { name: 'Gujranwala', province: 'Punjab', majorHub: true, transitDays: '1 - 2 Days' },
  { name: 'Sialkot', province: 'Punjab', majorHub: true, transitDays: '1 - 2 Days' },
  { name: 'Sargodha', province: 'Punjab', majorHub: true, transitDays: '1 - 2 Days' },
  { name: 'Bahawalpur', province: 'Punjab', majorHub: true, transitDays: '2 - 3 Days' },
  { name: 'Sheikhupura', province: 'Punjab', majorHub: false, transitDays: '1 - 2 Days' },
  { name: 'Jhang', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Rahim Yar Khan', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Gujrat', province: 'Punjab', majorHub: true, transitDays: '1 - 2 Days' },
  { name: 'Kasur', province: 'Punjab', majorHub: false, transitDays: '1 - 2 Days' },
  { name: 'Sahiwal', province: 'Punjab', majorHub: true, transitDays: '1 - 2 Days' },
  { name: 'Okara', province: 'Punjab', majorHub: false, transitDays: '1 - 2 Days' },
  { name: 'Wah Cantt', province: 'Punjab', majorHub: false, transitDays: '1 - 2 Days' },
  { name: 'Dera Ghazi Khan', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Mirpur Khas', province: 'Sindh', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Chiniot', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Kamoke', province: 'Punjab', majorHub: false, transitDays: '1 - 2 Days' },
  { name: 'Hafizabad', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Attock', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Burewala', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Jhelum', province: 'Punjab', majorHub: false, transitDays: '1 - 2 Days' },
  { name: 'Khanewal', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Muzaffargarh', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Mandi Bahauddin', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Vehari', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Chakwal', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Mianwali', province: 'Punjab', majorHub: false, transitDays: '2 - 3 Days' },

  // Sindh
  { name: 'Karachi', province: 'Sindh', majorHub: true, transitDays: '2 - 3 Days' },
  { name: 'Hyderabad', province: 'Sindh', majorHub: true, transitDays: '2 - 3 Days' },
  { name: 'Sukkur', province: 'Sindh', majorHub: true, transitDays: '2 - 3 Days' },
  { name: 'Larkana', province: 'Sindh', majorHub: false, transitDays: '2 - 4 Days' },
  { name: 'Nawabshah (Shaheed Benazirabad)', province: 'Sindh', majorHub: false, transitDays: '2 - 4 Days' },
  { name: 'Kotri', province: 'Sindh', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Shikarpur', province: 'Sindh', majorHub: false, transitDays: '3 - 4 Days' },
  { name: 'Jacobabad', province: 'Sindh', majorHub: false, transitDays: '3 - 4 Days' },
  { name: 'Khairpur', province: 'Sindh', majorHub: false, transitDays: '3 - 4 Days' },
  { name: 'Dadu', province: 'Sindh', majorHub: false, transitDays: '3 - 4 Days' },
  { name: 'Tando Adam', province: 'Sindh', majorHub: false, transitDays: '3 - 4 Days' },
  { name: 'Thatta', province: 'Sindh', majorHub: false, transitDays: '3 - 4 Days' },

  // Khyber Pakhtunkhwa (KPK)
  { name: 'Peshawar', province: 'Khyber Pakhtunkhwa', majorHub: true, transitDays: '1 - 2 Days' },
  { name: 'Mardan', province: 'Khyber Pakhtunkhwa', majorHub: true, transitDays: '2 - 3 Days' },
  { name: 'Abbottabad', province: 'Khyber Pakhtunkhwa', majorHub: true, transitDays: '2 - 3 Days' },
  { name: 'Mingora (Swat)', province: 'Khyber Pakhtunkhwa', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Kohat', province: 'Khyber Pakhtunkhwa', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Dera Ismail Khan', province: 'Khyber Pakhtunkhwa', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Haripur', province: 'Khyber Pakhtunkhwa', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Mansehra', province: 'Khyber Pakhtunkhwa', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Nowshera', province: 'Khyber Pakhtunkhwa', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Swabi', province: 'Khyber Pakhtunkhwa', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Bannu', province: 'Khyber Pakhtunkhwa', majorHub: false, transitDays: '3 - 4 Days' },
  { name: 'Charsadda', province: 'Khyber Pakhtunkhwa', majorHub: false, transitDays: '2 - 3 Days' },

  // Balochistan
  { name: 'Quetta', province: 'Balochistan', majorHub: true, transitDays: '2 - 3 Days' },
  { name: 'Gwadar', province: 'Balochistan', majorHub: false, transitDays: '3 - 5 Days' },
  { name: 'Turbat', province: 'Balochistan', majorHub: false, transitDays: '3 - 5 Days' },
  { name: 'Khuzdar', province: 'Balochistan', majorHub: false, transitDays: '3 - 5 Days' },
  { name: 'Hub', province: 'Balochistan', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Chaman', province: 'Balochistan', majorHub: false, transitDays: '3 - 5 Days' },
  { name: 'Sibi', province: 'Balochistan', majorHub: false, transitDays: '3 - 4 Days' },
  { name: 'Zhob', province: 'Balochistan', majorHub: false, transitDays: '3 - 5 Days' },
  { name: 'Loralai', province: 'Balochistan', majorHub: false, transitDays: '3 - 5 Days' },

  // Azad Jammu & Kashmir (AJK)
  { name: 'Muzaffarabad', province: 'Azad Jammu & Kashmir', majorHub: true, transitDays: '2 - 3 Days' },
  { name: 'Mirpur (AJK)', province: 'Azad Jammu & Kashmir', majorHub: true, transitDays: '1 - 2 Days' },
  { name: 'Rawalakot', province: 'Azad Jammu & Kashmir', majorHub: false, transitDays: '2 - 4 Days' },
  { name: 'Kotli', province: 'Azad Jammu & Kashmir', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Bhimber', province: 'Azad Jammu & Kashmir', majorHub: false, transitDays: '2 - 3 Days' },
  { name: 'Bagh', province: 'Azad Jammu & Kashmir', majorHub: false, transitDays: '2 - 4 Days' },

  // Gilgit-Baltistan
  { name: 'Gilgit', province: 'Gilgit-Baltistan', majorHub: true, transitDays: '3 - 5 Days' },
  { name: 'Skardu', province: 'Gilgit-Baltistan', majorHub: true, transitDays: '3 - 5 Days' },
  { name: 'Hunza', province: 'Gilgit-Baltistan', majorHub: false, transitDays: '4 - 6 Days' },
  { name: 'Chilas', province: 'Gilgit-Baltistan', majorHub: false, transitDays: '3 - 5 Days' },
  { name: 'Ghanche', province: 'Gilgit-Baltistan', majorHub: false, transitDays: '4 - 6 Days' }
];
