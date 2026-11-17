# HAMZA AUTOS — STRUCTURED DATA & SCHEMA VALIDATION REPORT
**Standard:** Schema.org Vocabulary / JSON-LD  
**Validator:** Google Rich Results Test & Schema Validator Standard  
**Target:** Local Business (Automotive Repair), Organization, WebSite, Service, Breadcrumbs  

---

## 1. Schema Graph Architecture

Hamza Autos implements a unified, linked `@graph` JSON-LD structure inside `index.html` alongside dynamic contextual JSON-LD scripts on subpages:

```
                                  [ Schema.org @graph ]
                                             |
             +-------------------------------+-------------------------------+
             |                               |                               |
             v                               v                               v
    {"@type": "AutoRepair"}         {"@type": "Organization"}        {"@type": "WebSite"}
    - Workshop NAP                  - Official Name                  - Canonical URL
    - Geo Coordinates               - Logo URL                       - en-PK Language
    - Opening Hours                 - Phone ContactPoint             - SearchAction Potential
    - AreaServed (12 Areas)         - Urdu/Punjabi/English
    - PriceRange & Currencies
             |
             +-------------------------------+-------------------------------+
             |                               |                               |
             v                               v                               v
    {"@type": "Service"}            {"@type": "BreadcrumbList"}      {"@type": "BlogPosting"}
    (on /services/:slug)            (on all subpages)                (on /blog/:slug)
    - Service Category              - Home > Category > Page         - Technical Author
    - Provider Reference            - Valid URL Positions            - Publisher Reference
    - Feature Offers Catalog                                         - Published Date
```

---

## 2. Global Graph Schema (Homepage & Master HTML)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AutoRepair",
      "@id": "https://hamzaautos.com/#autorepair",
      "name": "Hamza Autos",
      "alternateName": "Hamza Autos Bike Mechanic Workshop",
      "image": "https://hamzaautos.com/assets/images/home/motorcycle-workshop-hero.webp",
      "logo": "https://hamzaautos.com/hamza-autos-logo.svg",
      "url": "https://hamzaautos.com/",
      "telephone": "+923251814548",
      "priceRange": "PKR (Rs. 150 - Rs. 15,000)",
      "currenciesAccepted": "PKR",
      "paymentAccepted": "Cash, JazzCash, EasyPaisa, Bank Transfer",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road",
        "addressLocality": "Badami Bagh",
        "addressRegion": "Lahore, Punjab",
        "postalCode": "54000",
        "addressCountry": "PK"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 31.5975,
        "longitude": 74.3265
      },
      "hasMap": "https://maps.google.com/maps?q=Shop+Near+Ali+Hajvery+Marriage+Hall,+Abu+Bakar+Road,+Badami+Bagh,+Lahore",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "09:00",
          "closes": "21:00"
        }
      ],
      "areaServed": [
        {"@type": "AdministrativeArea", "name": "Badami Bagh, Lahore"},
        {"@type": "AdministrativeArea", "name": "Shadbagh, Lahore"},
        {"@type": "AdministrativeArea", "name": "Misri Shah, Lahore"},
        {"@type": "AdministrativeArea", "name": "Ravi Road, Lahore"},
        {"@type": "AdministrativeArea", "name": "Azadi Chowk, Lahore"},
        {"@type": "AdministrativeArea", "name": "Timber Market, Lahore"},
        {"@type": "AdministrativeArea", "name": "Bund Road, Lahore"},
        {"@type": "AdministrativeArea", "name": "Garhi Shahu, Lahore"},
        {"@type": "AdministrativeArea", "name": "Bhatti Gate, Lahore"},
        {"@type": "AdministrativeArea", "name": "Shahdara, Lahore"},
        {"@type": "AdministrativeArea", "name": "Sanda, Lahore"},
        {"@type": "AdministrativeArea", "name": "Islampura, Lahore"}
      ],
      "description": "Professional motorcycle repair, engine rebuilding, tuning, oil change, brake calibration, and electrical maintenance workshop in Badami Bagh, Lahore. Serving Honda, Yamaha, Suzuki, and United bikes."
    },
    {
      "@type": "Organization",
      "@id": "https://hamzaautos.com/#organization",
      "name": "Hamza Autos",
      "url": "https://hamzaautos.com/",
      "logo": "https://hamzaautos.com/hamza-autos-logo.svg",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+923251814548",
        "contactType": "customer service",
        "areaServed": "PK",
        "availableLanguage": ["Urdu", "Punjabi", "English"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://hamzaautos.com/#website",
      "url": "https://hamzaautos.com/",
      "name": "Hamza Autos",
      "inLanguage": "en-PK",
      "description": "Leading Motorcycle Mechanic & Repair Workshop in Badami Bagh, Lahore.",
      "publisher": {
        "@id": "https://hamzaautos.com/#organization"
      }
    }
  ]
}
```

---

## 3. Dynamic Service Schema (`Service`)

Generated on `/services/:slug`:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://hamzaautos.com/services/motorcycle-engine-repair#service",
      "name": "Motorcycle Engine Repair & Overhaul",
      "serviceType": "Engine & Mechanical",
      "description": "Complete engine rebuilding, piston & cylinder bore work, valve clearance adjustment, and crankshaft repair.",
      "provider": {
        "@type": "AutoRepair",
        "name": "Hamza Autos",
        "telephone": "+923251814548",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road",
          "addressLocality": "Badami Bagh",
          "addressRegion": "Lahore, Punjab",
          "postalCode": "54000",
          "addressCountry": "PK"
        }
      },
      "areaServed": "Badami Bagh, Lahore",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Motorcycle Engine Repair & Overhaul",
        "itemListElement": [
          {
            "@type": "Offer",
            "position": 1,
            "itemOffered": {
              "@type": "Service",
              "name": "Full engine teardown and sonic cylinder inspection"
            }
          }
        ]
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hamzaautos.com" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://hamzaautos.com/services" },
        { "@type": "ListItem", "position": 3, "name": "Motorcycle Engine Repair & Overhaul", "item": "https://hamzaautos.com/services/motorcycle-engine-repair" }
      ]
    }
  ]
}
```

---

## 4. Breadcrumbs Schema Validation (`BreadcrumbList`)

Breadcrumb schemas are generated dynamically across:
- Services (`Home > Services > [Service Name]`)
- Brands (`Home > Brands > [Brand Name]`)
- Areas (`Home > Areas We Serve > [Area Name]`)
- Blog (`Home > Blog > [Article Headline]`)
- Static pages (`Home > Reviews`, `Home > Contact`, `Home > Gallery`)

Each item specifies exact numerical `position`, human-readable `name`, and absolute canonical URL string.

---

## 5. Rich Results Validation Checklist

| Schema Entity | Required Properties Verified | Google Rich Result Eligibility |
| :--- | :--- | :--- |
| `AutoRepair` | `name`, `address`, `telephone`, `geo`, `openingHours` | **Eligible for Local Business Knowledge Panel** |
| `Organization` | `name`, `url`, `logo`, `contactPoint` | **Eligible for Brand Knowledge Graph** |
| `WebSite` | `name`, `url`, `publisher` | **Eligible for Sitelinks & Brand Attribution** |
| `BreadcrumbList` | `itemListElement`, `position`, `name`, `item` | **Eligible for SERP Breadcrumb Navigation** |
| `BlogPosting` | `headline`, `author`, `publisher`, `datePublished` | **Eligible for Article Rich Results** |
| `Service` | `name`, `serviceType`, `provider`, `areaServed` | **Eligible for Service Catalog Rich Snippet** |
