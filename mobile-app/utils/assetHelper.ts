/**
 * Hamza Autos - Asset Helper for Native Images
 * Resolves static local assets bundled in mobile-app/assets/images/
 */

export const SERVICE_IMAGES: Record<string, any> = {
  'motorcycle-engine-repair.jpg': require('../assets/images/services/motorcycle-engine-repair.jpg'),
  'bike-tuning.jpg': require('../assets/images/services/bike-tuning.jpg'),
  'motorcycle-oil-change.jpg': require('../assets/images/services/motorcycle-oil-change.jpg'),
  'general-bike-repair.jpg': require('../assets/images/services/general-bike-repair.jpg'),
  'motorcycle-electrical-repair.jpg': require('../assets/images/services/motorcycle-electrical-repair.jpg'),
  'motorcycle-brake-repair.jpg': require('../assets/images/services/motorcycle-brake-repair.jpg'),
  'bike-clutch-repair.jpg': require('../assets/images/services/bike-clutch-repair.jpg'),
  'motorcycle-tyre-repair.jpg': require('../assets/images/services/motorcycle-tyre-repair.jpg'),
  'motorcycle-spare-parts.jpg': require('../assets/images/services/motorcycle-spare-parts.jpg'),
  'bike-modification.jpg': require('../assets/images/services/bike-modification.jpg'),
};

export const BRAND_IMAGES: Record<string, any> = {
  Honda: require('../assets/images/brands/honda-motorcycle.jpg'),
  Yamaha: require('../assets/images/brands/yamaha-motorcycle.jpg'),
  Suzuki: require('../assets/images/brands/suzuki-motorcycle.jpg'),
  United: require('../assets/images/brands/united-chinese-bike.jpg'),
  'Road Prince': require('../assets/images/brands/road-prince-motorcycle.jpg'),
  'Super Power': require('../assets/images/brands/super-power-motorcycle.jpg'),
  'Chinese Motorcycles': require('../assets/images/brands/chinese-commuter-bike.jpg'),
};

export const HERO_IMAGE = require('../assets/images/home/motorcycle-workshop-hero.jpg');
export const SERVICE_BAY_IMAGE = require('../assets/images/home/motorcycle-service-bay-presence.jpg');

export function getServiceImage(filename: string): any {
  return SERVICE_IMAGES[filename] || SERVICE_IMAGES['general-bike-repair.jpg'];
}

export function getBrandImage(brandName: string): any {
  return BRAND_IMAGES[brandName] || BRAND_IMAGES['Honda'];
}

export function getProductPlaceholder(category: string): any {
  if (category.toLowerCase().includes('oil') || category.toLowerCase().includes('lubricant')) {
    return SERVICE_IMAGES['motorcycle-oil-change.jpg'];
  }
  if (category.toLowerCase().includes('brake')) {
    return SERVICE_IMAGES['motorcycle-brake-repair.jpg'];
  }
  if (category.toLowerCase().includes('clutch')) {
    return SERVICE_IMAGES['bike-clutch-repair.jpg'];
  }
  if (category.toLowerCase().includes('tyre')) {
    return SERVICE_IMAGES['motorcycle-tyre-repair.jpg'];
  }
  return SERVICE_IMAGES['motorcycle-spare-parts.jpg'];
}
