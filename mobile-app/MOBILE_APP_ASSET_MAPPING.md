# Hamza Autos - Mobile Asset Mapping & Image Optimization

## 1. Asset Strategy & Zero Duplication
All relevant visual assets from the website (`src/assets/images/` and `public/`) were preserved untouched and copied into the self-contained `mobile-app/assets/` structure.

* **Original Website Assets**: Unmodified and intact in `src/assets/images/`.
* **Mobile Assets Directory**: `mobile-app/assets/images/`.
* **Static Bundling**: Handled via `mobile-app/utils/assetHelper.ts` with direct `require()` calls to ensure seamless offline availability.

---

## 2. Image Asset Mapping Matrix

### 2.1 Workshop Services (`mobile-app/assets/images/services/`)

| Service Name | Source Website Path | Mobile Application Asset | Resolved By |
|---|---|---|---|
| **Engine Repair & Overhaul** | `src/assets/images/services/motorcycle-engine-repair.jpg` | `mobile-app/assets/images/services/motorcycle-engine-repair.jpg` | `getServiceImage('motorcycle-engine-repair.jpg')` |
| **Bike Tuning & Fuel Economy** | `src/assets/images/services/bike-tuning.jpg` | `mobile-app/assets/images/services/bike-tuning.jpg` | `getServiceImage('bike-tuning.jpg')` |
| **Motorcycle Oil Change** | `src/assets/images/services/motorcycle-oil-change.jpg` | `mobile-app/assets/images/services/motorcycle-oil-change.jpg` | `getServiceImage('motorcycle-oil-change.jpg')` |
| **General Bike Repair** | `src/assets/images/services/general-bike-repair.jpg` | `mobile-app/assets/images/services/general-bike-repair.jpg` | `getServiceImage('general-bike-repair.jpg')` |
| **Electrical Repair** | `src/assets/images/services/motorcycle-electrical-repair.jpg` | `mobile-app/assets/images/services/motorcycle-electrical-repair.jpg` | `getServiceImage('motorcycle-electrical-repair.jpg')` |
| **Brake Repair** | `src/assets/images/services/motorcycle-brake-repair.jpg` | `mobile-app/assets/images/services/motorcycle-brake-repair.jpg` | `getServiceImage('motorcycle-brake-repair.jpg')` |
| **Clutch Repair** | `src/assets/images/services/bike-clutch-repair.jpg` | `mobile-app/assets/images/services/bike-clutch-repair.jpg` | `getServiceImage('bike-clutch-repair.jpg')` |
| **Tyre & Puncture** | `src/assets/images/services/motorcycle-tyre-repair.jpg` | `mobile-app/assets/images/services/motorcycle-tyre-repair.jpg` | `getServiceImage('motorcycle-tyre-repair.jpg')` |
| **Spare Parts Fitting** | `src/assets/images/services/motorcycle-spare-parts.jpg` | `mobile-app/assets/images/services/motorcycle-spare-parts.jpg` | `getServiceImage('motorcycle-spare-parts.jpg')` |
| **Bike Modification** | `src/assets/images/services/bike-modification.jpg` | `mobile-app/assets/images/services/bike-modification.jpg` | `getServiceImage('bike-modification.jpg')` |

### 2.2 Motorcycle Brands (`mobile-app/assets/images/brands/`)

| Brand | Source Website Path | Mobile Application Asset | Resolved By |
|---|---|---|---|
| **Honda** | `src/assets/images/brands/honda-motorcycle.jpg` | `mobile-app/assets/images/brands/honda-motorcycle.jpg` | `getBrandImage('Honda')` |
| **Yamaha** | `src/assets/images/brands/yamaha-motorcycle.jpg` | `mobile-app/assets/images/brands/yamaha-motorcycle.jpg` | `getBrandImage('Yamaha')` |
| **Suzuki** | `src/assets/images/brands/suzuki-motorcycle.jpg` | `mobile-app/assets/images/brands/suzuki-motorcycle.jpg` | `getBrandImage('Suzuki')` |
| **United** | `src/assets/images/brands/united-chinese-bike.jpg` | `mobile-app/assets/images/brands/united-chinese-bike.jpg` | `getBrandImage('United')` |
| **Road Prince** | `src/assets/images/brands/road-prince-motorcycle.jpg` | `mobile-app/assets/images/brands/road-prince-motorcycle.jpg` | `getBrandImage('Road Prince')` |
| **Super Power** | `src/assets/images/brands/super-power-motorcycle.jpg` | `mobile-app/assets/images/brands/super-power-motorcycle.jpg` | `getBrandImage('Super Power')` |
| **Chinese Bikes** | `src/assets/images/brands/chinese-commuter-bike.jpg` | `mobile-app/assets/images/brands/chinese-commuter-bike.jpg` | `getBrandImage('Chinese Motorcycles')` |

### 2.3 Workshop Hero & Bay Showcase (`mobile-app/assets/images/home/`)

| Visual Showcase | Source Website Path | Mobile Application Asset | Constant |
|---|---|---|---|
| **Workshop Hero** | `src/assets/images/home/motorcycle-workshop-hero.jpg` | `mobile-app/assets/images/home/motorcycle-workshop-hero.jpg` | `HERO_IMAGE` |
| **Service Bay** | `src/assets/images/home/motorcycle-service-bay-presence.jpg` | `mobile-app/assets/images/home/motorcycle-service-bay-presence.jpg` | `SERVICE_BAY_IMAGE` |

---

## 3. Brand Vectors & Generated App Icons

| Asset Type | Source Path | Generated Mobile Asset | Specifications |
|---|---|---|---|
| **Main App Icon** | `public/hamza-autos-icon.svg` | `mobile-app/assets/icon.png` | 1024 × 1024 px PNG, 32-bit RGBA |
| **Android Adaptive Icon** | `public/hamza-autos-icon.svg` | `mobile-app/assets/adaptive-icon.png` | 512 × 512 px PNG on #10182B background |
| **Splash Screen Icon** | `public/hamza-autos-icon.svg` | `mobile-app/assets/splash-icon.png` | 512 × 512 px PNG on #10182B background |
| **Favicon** | `public/hamza-autos-icon.svg` | `mobile-app/assets/favicon.png` | 48 × 48 px PNG |
| **Dynamic Vector Monogram** | `src/components/BrandLogo.tsx` | `mobile-app/components/BrandLogo.tsx` | Pure native Vector component with 12-tooth sprocket and live green indicator |
