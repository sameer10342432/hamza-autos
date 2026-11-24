# HAMZA AUTOS – SHOP SEO & STRUCTURED DATA REPORT

**Author:** Antigravity SEO & Growth Engineering Team  
**Scope:** Search Engine Optimization Strategy, Meta Tags, Structured Data (JSON-LD) & Open Graph  
**Implementation Reference:** `src/utils/seoHeadManager.ts`  
**Date:** November 2026  

---

## 1. SEO Architecture & Commercial Objective

The primary SEO objective of the shop subsystem is to transition Hamza Autos from a local Lahore repair shop query footprint into a high-intent national e-commerce query footprint:
- **Local Keywords (Preserved):** "bike mechanic badami bagh", "motorcycle repair abu bakar road lahore", "cg125 tuning lahore".
- **National E-Commerce Keywords (Targeted):** "motorcycle spare parts online pakistan", "honda cd70 cylinder block price in pakistan", "buy cg125 clutch plate online", "yamaha ybr 125 genuine spare parts delivery pakistan", "bike parts cash on delivery pakistan".

---

## 2. Dynamic Route Meta Tag Mapping

All page titles, meta descriptions, canonical links, and Open Graph tags update dynamically via `src/utils/seoHeadManager.ts`:

| Route | Page Title | Meta Description | Canonical URL | Robots Tag |
|---|---|---|---|---|
| `/shop` | Online Motorcycle Spare Parts Shop Pakistan \| Genuine Bike Parts \| Hamza Autos | Buy genuine motorcycle spare parts online with cash on delivery across Pakistan. Engine parts, clutch plates, brake shoes, cables & accessories for Honda CD70, CG125, Yamaha YBR, Suzuki & Chinese bikes. | `https://hamzaautos.com/shop` | `index, follow` |
| `/shop/products` | All Motorcycle Spare Parts & Accessories Catalog \| Hamza Autos Pakistan | Explore authentic motorcycle spare parts for Atlas Honda CD70, CG125, Yamaha YBR 125, Suzuki GD110, GS150 & Chinese bikes. Filter by bike brand and model. Delivery all over Pakistan. | `https://hamzaautos.com/shop/products` | `index, follow` |
| `/shop/categories` | Motorcycle Spare Parts Categories \| Hamza Autos Pakistan | Browse 16 categories of motorcycle parts including engine overhauls, clutch plates, disc brakes, cables, and 4T lubricants. | `https://hamzaautos.com/shop/categories` | `index, follow` |
| `/shop/product/:slug` | [Product Title] – Price in Pakistan \| Fitment & Genuine Spec \| Hamza Autos | Genuine [Product Title] with verified bike fitment, specifications, and fast nationwide delivery across Pakistan. Cash on delivery available. | `https://hamzaautos.com/shop/product/[slug]` | `index, follow` |
| `/shop/cart` | Shopping Cart \| Hamza Autos Online Spare Parts | Review selected motorcycle spare parts in your cart, calculate nationwide Pakistan shipping charges, and proceed to checkout. | `https://hamzaautos.com/shop/cart` | `noindex, follow` |
| `/shop/checkout` | Secure Checkout \| Cash on Delivery & Bank Transfer \| Hamza Autos | Complete your motorcycle spare parts order with nationwide Pakistan delivery, Cash on Delivery (COD) or Meezan Bank transfer. | `https://hamzaautos.com/shop/checkout` | `noindex, nofollow` |
| `/shop/order-confirmation`| Order Confirmed \| Hamza Autos Spare Parts Pakistan | Thank you for your order! Your motorcycle spare parts order has been received and is being prepared for dispatch. | `https://hamzaautos.com/shop/order-confirmation`| `noindex, nofollow` |
| `/shop/track-order` | Track Spare Parts Courier Order Online \| Hamza Autos Pakistan | Track your motorcycle spare parts parcel in real-time across Pakistan using your Order Number (HA-SHOP-YYYY-XXXX) or mobile phone number. | `https://hamzaautos.com/shop/track-order` | `index, follow` |

---

## 3. Schema.org JSON-LD Structured Data

### A. AutoPartsStore Schema (`/shop`)
```json
{
  "@context": "https://schema.org",
  "@type": "AutoPartsStore",
  "name": "Hamza Autos Spare Parts Online Store",
  "description": "Nationwide Pakistan motorcycle spare parts and accessories store for Honda, Yamaha, Suzuki, and Chinese bikes.",
  "url": "https://hamzaautos.com/shop",
  "telephone": "+923251814548",
  "priceRange": "PKR 150 - 25000",
  "currenciesAccepted": "PKR",
  "paymentAccepted": "Cash on Delivery, Bank Transfer",
  "areaServed": "PK",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road",
    "addressLocality": "Badami Bagh",
    "addressRegion": "Lahore, Punjab",
    "postalCode": "54000",
    "addressCountry": "PK"
  }
}
```

### B. Product Schema (`/shop/product/:slug`)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Crown Lifan Complete Cylinder Block & Piston Kit – 70cc",
  "image": "https://hamzaautos.com/assets/images/services/motorcycle-engine-repair.webp",
  "description": "Complete 70cc engine cylinder kit featuring precision bored sleeve, piston, rings, gudgeon pin, and circlips.",
  "sku": "HA-ENG-70-001",
  "brand": {
    "@type": "Brand",
    "name": "Crown Lifan"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://hamzaautos.com/shop/product/crown-lifan-70cc-cylinder-kit",
    "priceCurrency": "PKR",
    "price": 2850,
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Hamza Autos"
    }
  }
}
```

### C. CollectionPage Schema (`/shop/products`)
Enables rich snippets and breadcrumbs in Google Search Console, making catalog filters readable by search engine crawlers.
