# HAMZA AUTOS – ONLINE SHOP & SPARE PARTS E-COMMERCE IMPLEMENTATION REPORT

**Author:** Antigravity Senior Full-Stack Developer, E-commerce Architect & UI/UX Designer  
**Project:** Hamza Autos – Bike Mechanic & Motorcycle Repair Shop  
**Location:** Abu Bakar Road, Badami Bagh, Lahore, Pakistan  
**Scope:** Nationwide Pakistan Motorcycle Spare Parts & Accessories E-Commerce System  
**Date:** November 2026  
**Status:** Completed & Production Verified  

---

## 1. Executive Summary

Hamza Autos has successfully expanded from a premier local motorcycle workshop in Badami Bagh, Lahore, into a nationwide e-commerce spare parts provider for riders across all provinces and administrative territories of Pakistan. 

The e-commerce subsystem operates as an independent, fully isolated module seamlessly embedded within the existing Hamza Autos React + Vite + Node/Express architecture. It strictly adheres to all architectural constraints:
1. **Zero External Database Dependencies:** Relies entirely on the proven, atomic JSON file-based repository located in `storage/` without introducing MySQL, PostgreSQL, MongoDB, SQLite, Firebase, or Supabase.
2. **Preservation of Workshop Integrity:** The existing motorcycle repair booking system, customer portal, job cards, mechanics management, and CRM pipelines remain 100% intact and untouched.
3. **Nationwide Commuter Focus:** Tailored specifically to commuter motorcycles dominant in Pakistan (Honda CD70, CG125, Pridor, CB125F; Yamaha YBR 125/125G/YB125Z; Suzuki GD110/GS150/GR150; United, Road Prince, and Chinese 70cc/100cc variants).
4. **Frictionless Pakistani Checkout:** Guest checkout without forced account registration, comprehensive 7-province city selection, and dual payment options: Cash on Delivery (COD) and Meezan Bank Transfer with manual Transaction Reference (TID) verification.

---

## 2. System Architecture & Route Blueprint

```
hamza-autos/
├── server/
│   ├── shopRoutes.ts          # Express API router mounted at /api/shop
│   └── shopSeedData.ts        # Seeding engine for products, categories, models & policies
├── storage/
│   ├── shop-products.json     # Catalog, SKU, pricing, fitment & live stock
│   ├── shop-categories.json   # 16 motorcycle parts categories with dynamic counts
│   ├── shop-brands-models.json# Pakistani bike brands and model specifications
│   ├── shop-orders.json       # Customer orders, pricing breakdowns, audit history
│   ├── shop-inventory-movements.json # Immutable stock deduction & restoration audit log
│   ├── shop-payments.json     # Payment audits (COD vs Bank Transfer verification)
│   ├── shop-shipping.json     # Nationwide courier rates, free shipping threshold (PKR 3,500)
│   └── shop-settings.json     # Store branding, WhatsApp helpline, Meezan Bank IBAN
├── src/
│   ├── types/shop.ts          # Complete TypeScript interfaces for all shop entities
│   ├── data/pakistanLocations.ts # 7 Pakistani provinces & curated courier destinations
│   ├── services/shopService.ts # Client API service with JWT authorization
│   ├── context/CartContext.tsx # Global shopping cart state with local storage persistence
│   ├── views/shop/
│   │   ├── ShopHomeView.tsx   # Hero banner, bike selector, categories, best sellers
│   │   ├── ShopProductsView.tsx # Multi-faceted filtering (brand, model, category, price)
│   │   ├── ShopProductDetailView.tsx # Gallery, specs, verified fitment badges, WhatsApp CTA
│   │   ├── ShopCartView.tsx   # Dynamic subtotal, free shipping progress, stock limits
│   │   ├── ShopCheckoutView.tsx # Guest delivery form, province & city select, payment selection
│   │   ├── ShopOrderConfirmationView.tsx # Order summary, print invoice, WhatsApp dispatch CTA
│   │   └── ShopTrackOrderView.tsx # Real-time timeline, courier tracking code & delivery days
│   └── components/admin/shop/
│       ├── ShopDashboardTab.tsx # Revenue KPIs, pending orders, low stock warnings
│       ├── ShopProductsTab.tsx  # Product catalog manager with SKU builder & images
│       ├── ShopProductModal.tsx # Add/Edit modal with multi-bike compatibility builder
│       ├── ShopCategoriesTab.tsx# Category manager with icons and status toggle
│       ├── ShopBrandsModelsTab.tsx # Motorcycle brand and model management
│       ├── ShopInventoryTab.tsx # Live inventory table, movement logs, quick adjuster
│       ├── ShopOrdersTab.tsx    # Order review, status workflows, courier tracking modal
│       ├── ShopPaymentsTab.tsx  # Bank transfer TID verification & COD audits
│       ├── ShopShippingTab.tsx  # Delivery fees, free shipping rules & couriers
│       └── ShopSettingsTab.tsx  # Storefront policies & Meezan Bank payment details
```

---

## 3. Navigation & Public Routing Integration

The application uses clean HTML5 browser history routing managed by `src/utils/adminRouter.ts`.

### Public Storefront Routes:
- `/shop`: Shop Homepage with promotional banners, bike selector widget, featured products, and shopping assistance.
- `/shop/products`: Filterable product catalog supporting `bikeModel`, `bikeBrand`, `category`, `search`, and price sorting.
- `/shop/categories`: Visual grid of the 16 motorcycle spare parts categories with live product count badges.
- `/shop/product/:slug`: Dedicated product detail page featuring verified fitment badges, SKU, stock indicator, and WhatsApp enquiry.
- `/shop/cart`: Persistent shopping cart with stock quantity validation and free shipping progress meter.
- `/shop/checkout`: Streamlined 1-step guest checkout supporting addresses across all Pakistani provinces.
- `/shop/order-confirmation/:orderNumber`: Post-purchase success screen with unique Order Number and direct WhatsApp dispatch notification.
- `/shop/track-order`: Live order and courier tracker by Order Number (`HA-SHOP-YYYY-XXXX`) or mobile number.

### Admin Panel Routes:
The Admin Panel features a dedicated `SHOP MANAGEMENT` group in `AdminSidebar.tsx`:
- `/admin/shop-dashboard`: Shop KPI cards, low stock alerts, and quick order fulfillment.
- `/admin/shop-products`: Full spare parts catalog management (Add, Edit, Publish/Unpublish, Delete).
- `/admin/shop-categories`: Category management with image URLs and sorting orders.
- `/admin/shop-brands`: Supported motorcycle brands and commuter model compatibility specifications.
- `/admin/shop-inventory`: Real-time stock audit, threshold warnings, and immutable movement logs.
- `/admin/shop-orders`: Order management, status transitions, invoice generation, and courier tracking updates.
- `/admin/shop-payments`: Payment ledger, bank transfer TID verification, and COD collection reports.
- `/admin/shop-shipping`: Pakistan delivery rates, free shipping thresholds, and courier configurations.
- `/admin/shop-settings`: Bank account credentials (Meezan Bank, Easypaisa, Jazzcash) and store policies.

---

## 4. Key Architectural Decisions

1. **Atomic Stock Adjustments:**
   Stock is deducted automatically upon admin order confirmation (`Confirmed`, `Processing`, or `Dispatched`), recorded in `shop-inventory-movements.json` with previous and new stock quantities. If an order is subsequently cancelled or returned, stock is automatically restored with an audit entry (`ORDER_CANCELLED` or `ORDER_RETURNED`).
2. **Pakistani Commuter Specialization:**
   Parts are explicitly cross-referenced with genuine Pakistani market models. For example, a CD70 brake shoe correctly displays fitment for Honda CD70, United US 70, and Road Prince 70, preventing customer returns caused by incorrect fitment.
3. **Official Contact Integration:**
   All customer assistance links, pre-order enquiries, and order confirmation buttons route directly to Hamza Autos' official WhatsApp number: `+92 325 1814548`.
