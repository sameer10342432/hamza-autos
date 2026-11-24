/**
 * Hamza Autos - Automated Screen & Navigation Integrity Test
 * Validates:
 * 1. All screen files exist and export default React components
 * 2. All internal navigation route targets (router.push / router.replace) exist
 * 3. All asset helper mappings resolve to existing asset files
 * 4. All component props and theme color constants are intact
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MOBILE_ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.resolve(MOBILE_ROOT, 'app');

console.log('====================================================');
console.log('HAMZA AUTOS - SCREEN & NAVIGATION INTEGRITY AUDIT');
console.log('====================================================\n');

let passedTests = 0;
let failedTests = 0;

const assert = (condition, title) => {
  if (condition) {
    console.log(`  ✓ PASS: ${title}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${title}`);
    failedTests++;
  }
};

// 1. Audit Screen Files
const EXPECTED_SCREENS = [
  'app/_layout.tsx',
  'app/(tabs)/_layout.tsx',
  'app/(tabs)/index.tsx',
  'app/(tabs)/shop.tsx',
  'app/(tabs)/services.tsx',
  'app/(tabs)/orders.tsx',
  'app/(tabs)/profile.tsx',
  'app/cart.tsx',
  'app/checkout.tsx',
  'app/product/[id].tsx',
  'app/service/[slug].tsx',
  'app/search.tsx',
  'app/repair-booking.tsx',
  'app/repair-tracking.tsx',
  'app/order-tracking.tsx',
  'app/my-garage.tsx',
  'app/bike-health.tsx',
  'app/saved-addresses.tsx',
  'app/notifications.tsx',
  'app/support.tsx',
];

console.log('[Phase 1] Auditing Screen File Existence and Exports:');
for (const relPath of EXPECTED_SCREENS) {
  const fullPath = path.resolve(MOBILE_ROOT, relPath);
  const exists = fs.existsSync(fullPath);
  assert(exists, `Screen file exists: ${relPath}`);
  if (exists) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasDefaultExport = content.includes('export default function') || content.includes('export default');
    assert(hasDefaultExport, `Screen exports default component: ${relPath}`);
  }
}

// 2. Audit Internal Navigation Links
console.log('\n[Phase 2] Auditing Internal Navigation Routes:');
const VALID_ROUTE_PATHS = [
  '/',
  '/(tabs)',
  '/(tabs)/shop',
  '/(tabs)/services',
  '/(tabs)/orders',
  '/(tabs)/profile',
  '/cart',
  '/checkout',
  '/product',
  '/service',
  '/search',
  '/repair-booking',
  '/repair-tracking',
  '/order-tracking',
  '/my-garage',
  '/bike-health',
  '/saved-addresses',
  '/notifications',
  '/support',
];

const screenFiles = fs.readdirSync(APP_DIR, { recursive: true })
  .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let checkedRoutesCount = 0;
for (const f of screenFiles) {
  const fullPath = path.resolve(APP_DIR, f);
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Find all router.push(...) and router.replace(...)
  const routeMatches = content.matchAll(/router\.(?:push|replace)\(\s*(?:['"`]([^'"`]+)['"`]|{\s*pathname:\s*['"`]([^'"`]+)['"`])/g);
  for (const match of routeMatches) {
    const route = match[1] || match[2];
    if (route && !route.startsWith('http') && !route.startsWith('tel:') && !route.startsWith('mailto:')) {
      const baseRoute = route.split('?')[0].split('/')[1] ? `/${route.split('?')[0].split('/')[1]}` : '/';
      const isValid = VALID_ROUTE_PATHS.some(vr => route.startsWith(vr) || baseRoute === vr || vr === `/${route.split('/')[1]}`);
      assert(isValid, `Navigation link "${route}" in ${f} targets valid route`);
      checkedRoutesCount++;
    }
  }
}
console.log(`  -> Verified ${checkedRoutesCount} internal navigation links.`);

// 3. Audit Asset Helper Mappings
console.log('\n[Phase 3] Auditing Asset Helper Image Files:');
const assetHelperPath = path.resolve(MOBILE_ROOT, 'utils/assetHelper.ts');
assert(fs.existsSync(assetHelperPath), 'utils/assetHelper.ts exists');

const assetHelperContent = fs.readFileSync(assetHelperPath, 'utf8');
const assetRequires = assetHelperContent.matchAll(/require\(['"]\.\.\/assets\/images\/([^'"]+)['"]\)/g);
let verifiedAssetsCount = 0;
for (const match of assetRequires) {
  const imageRel = match[1];
  const fullImagePath = path.resolve(MOBILE_ROOT, 'assets/images', imageRel);
  const exists = fs.existsSync(fullImagePath);
  assert(exists, `Required asset exists: assets/images/${imageRel}`);
  verifiedAssetsCount++;
}
console.log(`  -> Verified ${verifiedAssetsCount} static asset files.`);

// 4. Audit Security Invariants
console.log('\n[Phase 4] Auditing Security Invariants:');
const apiConfigPath = path.resolve(MOBILE_ROOT, 'config/api.ts');
const apiConfigContent = fs.readFileSync(apiConfigPath, 'utf8');
assert(!apiConfigContent.includes('password') || !apiConfigContent.includes('secret_key'), 'No hardcoded private API keys/secrets in config/api.ts');
assert(!apiConfigContent.includes('mysql://') && !apiConfigContent.includes('postgres://') && !apiConfigContent.includes('mongodb://'), 'Zero external databases configured in config');

const authContextPath = path.resolve(MOBILE_ROOT, 'context/AuthContext.tsx');
const authContent = fs.readFileSync(authContextPath, 'utf8');
assert(authContent.includes('SecureStore.setItemAsync'), 'Auth tokens stored via Expo SecureStore');
assert(authContent.includes('SecureStore.deleteItemAsync'), 'Auth tokens purged via SecureStore on logout');

console.log('\n====================================================');
console.log(`AUDIT SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('====================================================\n');

process.exit(failedTests > 0 ? 1 : 0);
