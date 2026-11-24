# Hamza Autos Mobile Application Architecture

## 1. System Overview
The Hamza Autos mobile application is a high-performance, native React Native application developed with Expo SDK 52, TypeScript, and Expo Router. It mirrors the exact business logic, catalog structure, workshop booking systems, and visual identity of the established Hamza Autos website while utilizing a mobile-first architecture.

```
                         [ Mobile Application (Expo / React Native) ]
                                          |
                +-------------------------+-------------------------+
                |                         |                         |
       [ UI Layer (Screens) ]   [ Context State Layer ]   [ Central API Client ]
       - (tabs): Home, Shop,    - CartContext (Async)     - config/api.ts
         Services, Orders,      - AuthContext (Secure)    - services/api.ts
         Profile                - GarageContext (Async)   - Fail-safe timeout & retry
       - Stacks: Checkout,      - QueryClientProvider
         Booking, Tracking,
         Garage, Health
                |                         |                         |
                +-------------------------+-------------------------+
                                          |
                                HTTP REST API Calls
                                          |
                        [ Express Server (server/app.ts) ]
                                          |
                       +------------------+------------------+
                       |                                     |
           [ Public & Sync Routes ]              [ Admin Panel Routes ]
           - GET /api/inventory                  - GET/PUT /api/inquiries
           - POST /api/orders                    - GET/PUT /api/bookings
           - POST /api/bookings                  - GET/PUT /api/customers
           - GET /api/orders/track               - GET/PUT /api/purchase-orders
           - GET /api/repairs/track              - GET/PUT /api/settings
                       |                                     |
                       +------------------+------------------+
                                          |
                       [ File-Based JSON Storage (storage/) ]
                       - inventory.json          - inquiries.json
                       - orders.json             - booking-submissions.json
                       - customers.json          - notifications.json
                       - admin-settings.json     - mechanics.json
```

---

## 2. Technology Stack & Packages

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime & Core** | React Native / Expo SDK | `0.76.7` / `~52.0.37` | Cross-platform native mobile foundation (Android & iOS). |
| **Language** | TypeScript | `^5.3.3` | Strict type safety, interface enforcement, and contract synchronization. |
| **Navigation** | Expo Router | `~4.0.17` | Native file-based navigation, deep linking (`hamzaautos://`), and typed routes. |
| **Icons** | `@expo/vector-icons` | `^14.0.4` | Native icon vector glyphs (Ionicons, MaterialCommunityIcons, FontAwesome5). |
| **Styling** | React Native StyleSheet | Built-in | Platform-optimized styles, pixel density handling, zero web DOM dependencies. |
| **State & Cache** | `@tanstack/react-query` | `^5.62.15` | Server state management, cache invalidation, and background synchronization. |
| **Sensitive Storage** | `expo-secure-store` | `~14.0.1` | Encrypted keychain/keystore token persistence for auth tokens. |
| **Client Storage** | `@react-native-async-storage` | `1.23.1` | Offline shopping cart, customer preferences, and garage vehicle profiles. |
| **Forms & Validation** | `react-hook-form` / `zod` | `^7.54.2` / `^3.24.2` | Robust input handling, Pakistan phone normalization, and checkout validation. |

---

## 3. Directory Structure

```
mobile-app/
├── app/                              # Expo Router file-based screens
│   ├── (tabs)/                       # Bottom Navigation Tabs
│   │   ├── _layout.tsx               # Tabs configuration & icon badges
│   │   ├── index.tsx                 # Home screen
│   │   ├── shop.tsx                  # Spare parts shop & filters
│   │   ├── services.tsx              # Workshop services catalog
│   │   ├── orders.tsx                # Customer order history
│   │   └── profile.tsx               # Rider profile & quick links
│   ├── _layout.tsx                   # Root stack layout & provider tree
│   ├── search.tsx                    # Global parts and services search
│   ├── cart.tsx                      # Persistent cart & Pakistan delivery selector
│   ├── checkout.tsx                  # 4-step guest/user checkout & COD
│   ├── order-tracking.tsx            # Live courier delivery timeline
│   ├── repair-booking.tsx            # Badami Bagh workshop appointment booking
│   ├── repair-tracking.tsx           # 2-factor repair tracking & job card
│   ├── my-garage.tsx                 # Motorcycle manager & maintenance reminders
│   ├── bike-health.tsx               # 7-system motorcycle diagnostic health score
│   ├── saved-addresses.tsx           # Pakistan address book management
│   ├── notifications.tsx             # In-app real-time alerts
│   ├── support.tsx                   # Hotline, WhatsApp, and workshop coordinates
│   ├── product/
│   │   └── [id].tsx                  # Product specifications & stock gallery
│   └── service/
│       └── [slug].tsx                # Detailed workshop procedure view
├── components/                       # Modular native UI components
│   ├── BrandHeader.tsx               # Header with logo, cart badge & notification dot
│   ├── BrandLogo.tsx                 # Precision sprocket & monogram vector mark
│   ├── Button.tsx                    # Native pressable button with variants
│   ├── Badge.tsx                     # Semantic status pills
│   ├── Card.tsx                      # Native elevated card container
│   ├── Input.tsx                     # Input field with label, error & icons
│   ├── ProductCard.tsx               # Product card (vertical & horizontal)
│   ├── ServiceCard.tsx               # Workshop service card with booking CTA
│   ├── CompatibilityFinder.tsx       # 3-step motorcycle model compatibility finder
│   ├── EmptyState.tsx                # Friendly empty view with CTA
│   ├── ErrorState.tsx                # Retry-capable error boundary display
│   └── LoadingState.tsx              # Native activity indicator
├── context/                          # Persistent state contexts
│   ├── CartContext.tsx               # Shopping cart & shipping fee calculator
│   ├── AuthContext.tsx               # Customer login, token session & profile
│   └── GarageContext.tsx             # Saved bikes & maintenance reminder scheduler
├── services/                         # API & networking layer
│   └── api.ts                        # Central API client with timeout & offline seeds
├── config/                           # Environment configuration
│   └── api.ts                        # Base URL resolver (Android 10.0.2.2 / iOS / Production)
├── constants/                        # Theme tokens & design identity
│   ├── colors.ts                     # Brand colors (#E60012, #10182B, #FFFFFF, #F5F7FA)
│   └── theme.ts                      # Typography, spacing, radius, and shadows
├── data/                             # Initial business data ported from website
│   └── initialData.ts                # Services, brands, models, initial parts, FAQs
├── types/                            # Shared TypeScript interfaces
│   └── index.ts                      # SparePart, CustomerOrder, WorkshopService, etc.
└── utils/                            # Helper utilities
    └── assetHelper.ts                # Static asset resolver for images & logos
```

---

## 4. State Management & Data Flow Architecture

1. **Server-State Synchronization**:
   * Uses `MobileApiService` connected to Express endpoints (`/api/inventory`, `/api/orders`, `/api/bookings`, `/api/settings`).
   * When online, pulls latest stock and prices directly from server `storage/inventory.json`.
   * When offline, gracefully falls back to bundled verified catalog seed data without throwing unhandled exceptions.

2. **Cart & Shipping Calculator (`CartContext`)**:
   * Stores items, unit prices, and quantities in local storage (`@hamza_autos_cart_v1`).
   * Computes subtotal, selects Pakistan delivery destination, and applies local vs. interprovincial shipping rates.

3. **Customer Session & Security (`AuthContext`)**:
   * Secure authentication tokens stored using `expo-secure-store`.
   * Customer profiles stored in `AsyncStorage`.
   * Supports frictionless guest checkout.

4. **Vehicle Management (`GarageContext`)**:
   * Supports multiple customer motorcycles with brand, model, registration number, and odometer readings.
   * Auto-schedules preventive maintenance alerts (Oil change at 1,000 km, Tuning at 3,000 km, Chain lube at 500 km).

---

## 5. Security & Privacy Safeguards
* **Zero Database Injections**: Strict adherence to server file-based JSON storage.
* **2-Factor Repair Tracking**: Viewing active repair job cards requires matching Job Card Number AND customer registered mobile number.
* **Sanitized Inputs**: All phone numbers normalized; dangerous characters stripped before dispatch.
* **No Plain-Text Credentials**: Passwords are never stored in client state.
