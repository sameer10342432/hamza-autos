# Hamza Autos - Website Source Code & Mobile Architecture Audit

**Project**: Hamza Autos Mobile Application (React Native / Expo / TypeScript)  
**Source of Truth**: Hamza Autos Website (`Hamza Autos App`)  
**Audit Date**: November 2026  
**Auditor**: Senior React Native Engineer & Expo Architect  

---

## 1. Executive Summary

This document establishes the comprehensive technical audit of the existing **Hamza Autos** website application, located at `C:\Users\sameer\Downloads\Sameer Project\Hamza Autos App`. The primary objective is to convert this web application into a high-performance, native React Native mobile application (`mobile-app`) built on Expo, TypeScript, and Expo Router, while preserving the established business rules, backend JSON storage, administrative interfaces, and automotive design identity.

The existing website source code remains completely untouched and is the single source of truth for business logic, catalog structures, styling identity, and API workflows.

---

## 2. Comprehensive Website Source Code Audit

### 2.1 Existing Frontend Framework
* **Framework**: React 19 (`react: ^19.0.1`, `react-dom: ^19.0.1`) bundled with Vite 8 (`vite: ^8.3.0`).
* **Styling**: Tailwind CSS v4 (`@tailwindcss/vite: ^4.3.3`, `tailwindcss: ^4.3.3`), custom CSS animations (`src/index.css`), and Motion (`motion/react: ^12.23.24`).
* **Icons**: Lucide React (`lucide-react: ^0.546.0`).
* **Routing**: Single Page Application (SPA) with custom hash/state-based routing (`src/utils/adminRouter.ts`, `App.tsx`) managing 13+ views:
  * `HomeView`, `ServicesView`, `ServiceDetailView`, `BrandsView`, `AreasView`, `AboutView`, `GalleryView`, `ReviewsView`, `BlogView`, `ContactView`, `TrackRepairView`, `CustomerDashboardView`, `AdminView`.
* **Mobile Porting Strategy**:
  * **Replace DOM Elements**: Replace `<div>`, `<span>`, `<section>`, `<header>`, `<footer>`, `<input>`, `<button>` with React Native native primitives (`View`, `Text`, `Pressable`, `TextInput`, `ScrollView`, `FlatList`, `SafeAreaView`).
  * **Replace Web Styling**: Replace Tailwind utility strings and CSS animations with React Native `StyleSheet` objects, using platform-optimized density-independent pixels.
  * **Replace Routing**: Replace hash router with Expo Router file-based navigation (`app/(tabs)` and stack screens).
  * **Replace Web Icons**: Migrate `lucide-react` to React Native compatible icons (`@expo/vector-icons` / `lucide-react-native`).

### 2.2 Existing Backend Framework
* **Server Framework**: Node.js with Express 4 (`express: ^4.21.2`), written in TypeScript and executed via `tsx server/prodServer.ts`.
* **Middleware & Architecture**:
  * Storage Access Block Guard: Blocks direct HTTP access to internal `/storage` directory.
  * HTTP Compression: Built-in Gzip/Deflate compression (`zlib.gzipSync`).
  * Performance Cache Headers: Dynamic cache-control for public vs. authenticated admin endpoints.
  * Payload Limits: JSON parser configured up to 50MB (supporting base64 image uploads).
  * Static Asset Serving: Serves `/uploads` with 30-day immutable caching.
* **Mobile Porting Strategy**:
  * Mobile app connects directly to Express API routes.
  * API client handles cross-platform networking, timeout handling, network state awareness, and offline retry queues.

### 2.3 Existing API Endpoints
The Express server (`server/routes.ts`) exposes 40+ endpoints:
1. **Authentication**:
   * `POST /api/auth/login` - Admin session creation
   * `POST /api/auth/logout` - Session invalidation
   * `GET /api/auth/me` - Current session validation
   * `POST /api/auth/profile` - Admin profile updates
2. **Dashboard & Analytics**:
   * `GET /api/dashboard/stats` - Total bookings, leads, customers, blogs
   * `GET /api/dashboard/charts` - Monthly booking and inquiry trends
3. **Inquiries & Leads**:
   * `GET /api/inquiries` - List inquiries (supports search, status, type filters)
   * `POST /api/inquiries` - Public inquiry submission (General, Repair, Quote, Spare Parts Order)
   * `PUT /api/inquiries/:id` - Update status, priority, or admin notes
   * `DELETE /api/inquiries/:id` - Remove inquiry
   * `POST /api/inquiries/bulk` - Batch update or delete
4. **Public Workshop Forms**:
   * `POST /api/contact` - General contact form submission
   * `POST /api/bookings` - Dedicated workshop appointment booking
   * `POST /api/feedback` - Customer review/rating submission
5. **Content & Taxonomy**:
   * `GET /api/blogs`, `GET /api/blogs/:idOrSlug`, `POST/PUT/DELETE /api/blogs`
   * `GET /api/categories`, `POST /api/categories`
   * `GET /api/tags`, `POST /api/tags`
   * `GET /api/content/:section`, `PUT /api/content/:section`
   * `GET /api/settings`, `PUT /api/settings`
6. **CRM & Workshop Management**:
   * `GET /api/customers`, `PUT /api/customers/:id`
   * `GET /api/crm/leads`, `POST/PUT/DELETE /api/crm/leads`, `POST /api/crm/leads/:id/convert`
   * `GET/POST/PUT/DELETE /api/crm/followups`
   * `GET/POST /api/crm/interactions`
   * `GET/POST/PUT/DELETE /api/mechanics`, `GET/POST /api/mechanics/attendance`
   * `GET/POST/PUT/DELETE /api/expenses`, `GET/POST /api/expenses/categories`
   * `GET /api/financial/transactions`, `GET /api/financial/profit-summary`
   * `GET/POST/PUT/DELETE /api/suppliers`
   * `GET/POST/DELETE /api/purchase-orders`, `POST /api/purchase-orders/:id/receive`, `POST /api/purchase-orders/:id/pay`
7. **System & Security**:
   * `GET /api/notifications`, `PUT /api/notifications/:id/read`
   * `GET /api/audit-logs`
   * `GET/POST /api/backup/*`
   * `GET /api/search/global`
   * `GET /api/security/events`, `storage-health`, `integrity-check`, `recovery-history`

### 2.4 Existing Authentication System
* **Admin Auth**: Token-based session management (`server/auth.ts`). Sessions stored in `storage/sessions.json` with secure random tokens, IP tracking, user-agent auditing, and expiration timestamps. Passwords salted and hashed with PBKDF2 (`crypto.pbkdf2Sync`).
* **Customer Auth**: Phone-number verification (`src/services/customerService.ts`, `src/utils/workshopLogic.ts`). Normalized Pakistani mobile numbers (e.g. `0325 1814548` -> `03251814548` / `+923251814548`). Two-factor verification for repair tracking (requires Job Card number + registered mobile number).
* **Mobile Porting Strategy**:
  * Store auth tokens and customer phone session securely using `expo-secure-store`.
  * Support guest browsing and guest checkout without forcing login.
  * Provide persistent customer profile lookup by mobile number.

### 2.5 Existing JSON Storage Architecture
* **Flat-File JSON Storage** (`storage/`):
  All central records are saved in atomic JSON files using `writeJsonFileAtomic()` to prevent race conditions and partial file writes:
  * `inventory.json`: Spare parts catalog, SKUs, stock levels, wholesale and retail pricing.
  * `booking-submissions.json`: Workshop service appointment bookings.
  * `inquiries.json`: Centralized inbox of orders, quotes, repair requests, and messages.
  * `customers.json`: Registered customer profiles, vehicle profiles, visit logs.
  * `notifications.json`: Real-time administrative notifications.
  * `admin-settings.json`: Business hours, shop coordinates, phone numbers, contact info.
  * `purchase-orders.json` & `suppliers.json`: Supplier procurement records.
  * `mechanics.json`: Technician roster and workshop bay assignments.
* **Local-First Client Storage**:
  * The website client utilizes an IndexedDB database (`hamza_autos_db`) with 16 stores for offline resilience.
* **Mobile Storage Strategy**:
  * Mobile app will NOT introduce SQL or NoSQL databases.
  * Local cache and cart persistence will use `@react-native-async-storage/async-storage`.
  * Central transactions will synchronize directly with the server JSON endpoints.

### 2.6 Existing Product Data Structure
From `src/types.ts` and `storage/inventory.json`:
```typescript
interface SparePart {
  id: string;                      // e.g. "sp-1"
  partNumber: string;              // SKU e.g. "SP-ENG-001"
  partName: string;                // e.g. "Piston Kit Complete 0.25 (70cc OHC)"
  category: string;                // e.g. "Engine & Mechanical"
  compatibleBrands: string[];      // e.g. ["Honda", "United", "Road Prince"]
  compatibleModels: string[];      // e.g. ["CD 70", "US 70", "RP 70"]
  purchasePrice: number;           // Wholesale/Cost in PKR
  sellingPrice: number;            // Retail in PKR
  stockQuantity: number;           // Current inventory level
  minStockAlert: number;           // Threshold for low-stock warning
  supplier?: string;               // e.g. "Badami Bagh Parts Market"
  description?: string;
  isArchived?: boolean;
  lastRestocked?: string;
  image?: string;                  // Asset path or URL
  rating?: number;
  reviewsCount?: number;
}
```

### 2.7 Existing Category Structure
* **Spare Parts Categories**:
  1. Engine Parts (`Engine & Mechanical`)
  2. Clutch Parts (`Clutch & Transmission`)
  3. Brake Parts (`Brakes & Safety`)
  4. Electrical Parts (`Electrical & Ignition`)
  5. Carburettor & Fuel System (`Fuel System`)
  6. Chain & Sprocket (`Drive & Chain`)
  7. Tyres & Tubes (`Tyres & Suspension`)
  8. Filters (`Filters & Gaskets`)
  9. Cables & Controls (`Cables & Levers`)
  10. Body Parts (`Body & Frame`)
  11. Lights & Indicators (`Lighting & Bulbs`)
  12. Mirrors (`Mirrors & Horns`)
  13. Batteries (`Batteries & Charging`)
  14. Bike Accessories (`Accessories & Security`)
  15. Oils & Lubricants (`Lubricants & Fluids`)
  16. Other Spare Parts (`General Hardware`)

* **Workshop Services Categories**:
  1. Engine Repair & Overhaul
  2. Bike Tuning & Fuel Economy
  3. Oil Change & Lubrication
  4. General Bike Repair
  5. Electrical Work & Wiring
  6. Brake Repair & Shoe/Pad Replacement
  7. Clutch Repair & Friction Plates
  8. Tyre & Puncture Service
  9. Spare Parts Installation
  10. Bike Modification & Restoration
  11. Other Custom Workshop Jobs

### 2.8 Existing Motorcycle Brands & Models
* **Supported Brands**:
  * Honda (Atlas Honda)
  * Yamaha (Yamaha Motor Pakistan)
  * Suzuki (Pak Suzuki)
  * United Auto Industries
  * Road Prince
  * Super Power
  * Chinese Motorcycles (Crown, Metro, Ravi, Eagle, Super Star)
* **Supported Models**:
  * Honda: CD 70, CD 70 Dream, Pridor 100cc, CG 125, CG 125 SE, CB 125F, CB 150F
  * Yamaha: YBR 125, YBR 125G, YB 125Z, YB 125Z-DX
  * Suzuki: GD 110S, GS 150, GS 150SE, GR 150
  * United: US 70, US 100, US 125
  * Road Prince: RP 70, RP 110, Passion 70
  * Super Power: SP 70, SP 125
  * All 70cc Chinese 4-stroke commuter motorcycles

### 2.9 Existing Order Management
* Orders are recorded with:
  * Customer details (Name, Phone, WhatsApp, Delivery Address, City, Province, Postal Code)
  * Line items with SKU, Quantity, Unit Price
  * Shipping fee (calculated based on province/city)
  * Payment method: Cash on Delivery (COD) or Bank Transfer
  * Order status: `New`, `Confirmed`, `Dispatched`, `In Transit`, `Delivered`, `Cancelled`
  * Courier tracking integration readiness (TCS, Leopards, M&P)
* Submissions automatically create administrative notifications and update customer records.

### 2.10 Existing Customer Management
* Profiles tracked in `customers.json` and client storage.
* Fields: `id`, `name`, `phoneNumber`, `email`, `area`, `bikeBrand`, `bikeModel`, `registrationNumber`, `registeredDate`, `totalSpent`, `totalVisits`, `notes`.
* Auto-upserted upon service booking, inquiry, or order placement.

### 2.11 Existing Booking System
* Location: Badami Bagh, Lahore Workshop ONLY.
* Time slots: 09:30 AM to 08:30 PM, 60-minute windows.
* Capacity: 2 bikes per time slot max.
* Unique booking reference generation: `HA-BK-YYYY-XXX`.
* Booking statuses: `Pending Confirmation`, `Confirmed`, `In Service`, `Completed`, `Cancelled`.

### 2.12 Existing Repair Tracking
* Job Cards: `HA-JC-YYYY-XXX`.
* Multi-stage repair tracking:
  1. `Booking Requested`
  2. `Booking Confirmed`
  3. `Bike Received`
  4. `Inspection in Progress`
  5. `Quotation Prepared`
  6. `Customer Approval Pending`
  7. `Repair in Progress`
  8. `Quality Inspection`
  9. `Ready for Collection`
  10. `Completed`
* 2-Factor Security: Verification requires matching Job Card Number AND registered customer phone number.

### 2.13 Existing Image Assets
* 40+ dedicated, optimized automotive images in `src/assets/images/`:
  * `services/` (13 service images)
  * `brands/` (7 motorcycle brand images)
  * `home/` (4 hero and bay showcase images)
  * `gallery/` (7 workshop and repair gallery images)
  * `about/` (3 workshop philosophy and bench photos)
  * `locations/` (2 Badami Bagh road traffic photos)
* Vectors in `public/`:
  * `hamza-autos-logo.svg`
  * `hamza-autos-icon.svg`
  * `hamza-autos-white.svg`
* Dynamic Monogram & 12-tooth Sprocket in `BrandLogo.tsx`.

### 2.14 Existing Website Navigation
* Header Navigation: Home, Services, Spare Parts / Shop, Areas, Brands, About, Gallery, Reviews, Blog, Contact, Track Repair, Customer Dashboard, Admin Login.
* Bottom Bar / Mobile Header: Quick booking modal, quick phone call, quick WhatsApp message.

### 2.15 Existing Business Settings
From `storage/admin-settings.json` and `src/data/businessData.ts`:
* Business Name: **Hamza Autos**
* Tagline: **Bike Mechanic & Motorcycle Repair Shop**
* Address: **Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore, Punjab 54000, Pakistan**
* Phone & WhatsApp: **+92 325 1814548**
* Operating Hours: **9:00 AM – 9:00 PM (Monday to Sunday, 7 Days a Week)**

### 2.16 Existing Admin Panel Functionality
* Comprehensive administrative dashboard with tabs for:
  * Central Inquiry Inbox, Bookings Management, Job Cards, Invoices, Customer Records, Inventory Control & Stock Adjustments, Staff Roster & Attendance, Service Reminders, Vehicle Inspections, Quotations, Media Library, Website CMS, SEO Management, Database Backup & Restore, Security Centre & Audit Logs.

---

## 3. Reuse vs. Rewrite Matrix for React Native

| Module / Component | Existing Website Implementation | Mobile App Strategy | Porting Action |
|---|---|---|---|
| **Branding & Theme** | Tailwind CSS v4 & Hex variables | Native React Native Theme constants | **Reuse** color tokens (`#E60012`, `#10182B`, `#FFFFFF`, `#F5F7FA`, `#64748B`), typography scales, and brand identity. |
| **Brand Logo** | SVG inside `BrandLogo.tsx` | React Native SVG / PNG / Vector | **Port** SVG geometry into native vector components and raster fallback assets. |
| **Business Data** | `src/data/businessData.ts` | Shared Mobile Config / Data | **Reuse** all service descriptions, brand lists, model lists, FAQs, and business coordinates directly. |
| **API Client** | `src/services/adminApiService.ts` | Mobile API Service (`config/api.ts`, `services/api.ts`) | **Rewrite** with configurable base URL (handling Android emulator `10.0.2.2`, physical devices, and production), timeout, and network resilience. |
| **Product Catalog** | `storage/inventory.json` & `types.ts` | React Native Shop Screens | **Reuse** data structures (`SparePart`). Render with `FlatList`, `ExpoImage`, and native cards. |
| **Shopping Cart** | Client memory / IndexedDB | Context + AsyncStorage | **Rewrite** with React Context (`CartContext`) persisted via `@react-native-async-storage/async-storage`. |
| **Checkout & Delivery** | Web form submission | Native Form + Pakistan Address Selector | **Rewrite** with `react-hook-form` and native Pickers for all 7 Pakistan provinces and major cities. |
| **Service Booking** | `BookingModal.tsx` | Native Stack Screen `RepairBookingScreen` | **Rewrite** with mobile date/time pickers, brand/model dropdowns, and Badami Bagh Lahore workshop validation. |
| **Repair Tracking** | `TrackRepairView.tsx` | Native Stack Screen `RepairTrackingScreen` | **Rewrite** with phone verification, animated native timeline steps, and status pills. |
| **My Garage** | `CustomerDashboardView.tsx` | Native Stack Screen `MyGarageScreen` | **Rewrite** with persistent bike storage, odometer tracking, and service reminder scheduling. |
| **Navigation** | Hash router + DOM tabs | Expo Router Bottom Tabs + Stack | **Rewrite** cleanly using Expo Router `(tabs)`: Home, Shop, Services, Orders, Profile + modal/stack screens. |
| **Storage Backend** | Server JSON files (`storage/*.json`) | Server JSON endpoints | **Preserve** server JSON architecture 100%. Central management remains website Admin Panel. |

---

## 4. Architectural Decisions & Non-Negotiables

1. **Zero Database Alteration**: No MySQL, MongoDB, PostgreSQL, SQLite, Firebase, or Supabase. Storage remains purely JSON on the server.
2. **Untouched Website Source**: The original website code, public assets, and build directories remain strictly unmodified.
3. **No WebView Wrappers**: All user-facing mobile interfaces are 100% native React Native components.
4. **Independent Executability**: The mobile application has its own `package.json`, TypeScript configuration, and Expo configuration inside `mobile-app/`.
5. **Fail-Safe Networking**: All network requests gracefully handle offline state, timeouts, and server downtime with retry capabilities.
