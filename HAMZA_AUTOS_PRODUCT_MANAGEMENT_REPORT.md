# HAMZA AUTOS – PRODUCT & CATEGORY MANAGEMENT REPORT

**Author:** Antigravity E-Commerce Architecture Team  
**Scope:** Motorcycle Spare Parts Taxonomy, SKU Structure, Fitment Compatibility & Inventory Seeding  
**Storage Reference:** `storage/shop-products.json`, `storage/shop-categories.json`, `storage/shop-brands-models.json`  
**Date:** November 2026  

---

## 1. Motorcycle Spare Parts Category Taxonomy

The Hamza Autos online shop organizes all motorcycle components into 16 verified categories tailored specifically to the Pakistani motorcycle ecosystem:

| # | Category Name | Slug | Icon | Typical Pakistani Components |
|---|---------------|------|------|------------------------------|
| 1 | Engine Parts | `engine-parts` | `Settings2` | Cylinder blocks, pistons, piston rings, valves, timing chains, camshafts, crankshafts |
| 2 | Clutch Parts | `clutch-parts` | `Cog` | Friction plates, steel clutch plates, clutch hubs, pressure plates, clutch springs |
| 3 | Brake Parts | `brake-parts` | `ShieldAlert` | Front/rear brake shoes, disc pads, brake drums, master cylinder repair kits |
| 4 | Electrical Parts | `electrical-parts` | `Zap` | CDI units, ignition coils, rectifiers/regulators, stator coils, wiring harnesses |
| 5 | Carburettor & Fuel System | `carburettor-fuel-system` | `Gauge` | Complete carburetors, jet kits, floats, fuel petcocks, fuel filters, intake manifolds |
| 6 | Chain & Sprocket | `chain-sprocket` | `Sliders` | 428H heavy duty drive chains, front sprockets, rear sprockets, chain adjusters |
| 7 | Tyres & Tubes | `tyres-tubes` | `CircleDot` | Front 2.50-17 tyres, Rear 2.75-17 / 3.00-17 tyres, butyl rubber tubes, rim strips |
| 8 | Filters | `filters` | `Droplets` | Foam air filters, paper air filters, oil strainer meshes, fuel sediment filters |
| 9 | Cables & Controls | `cables-controls` | `Cable` | Clutch cables, front brake cables, throttle cables, speedometer cables, switchgear |
| 10 | Body Parts | `body-parts` | `Sliders` | Fuel tanks, side covers, front mudguards, rear mudguards, chain covers |
| 11 | Lights & Indicators | `lights-indicators` | `Zap` | Headlamp assemblies, halogen/LED bulbs, taillight assemblies, turn signal indicators |
| 12 | Mirrors | `mirrors` | `Navigation` | Left & right rearview mirrors, 8mm & 10mm thread mirrors for commuter bikes |
| 13 | Batteries | `batteries` | `Zap` | Maintenance-free (MF) 12V 2.5Ah, 12V 5Ah, and 12V 7Ah motorcycle batteries |
| 14 | Bike Accessories | `bike-accessories` | `Sliders` | Crash guards, safe guards, seat covers, grip covers, luggage carriers, mobile holders |
| 15 | Oils & Lubricants | `oils-lubricants` | `Droplets` | 20W-40 & 20W-50 4T engine oils (Atlas Honda, Caltex Havoline, Shell Advance, ZIC) |
| 16 | Other Spare Parts | `other-spare-parts` | `Wrench` | Spark plugs (NGK / Denso), wheel bearings (6301, 6202), oil seals, gasket kits |

Administrators can add, edit, reorder, activate, and deactivate categories via the Admin Panel under `Shop Management -> Categories`.

---

## 2. Motorcycle Brand & Model Compatibility Engine

In Pakistan, motorcycle spare part fitment is nuanced. A single part (e.g. CD70 brake shoes or a 70cc cylinder kit) fits dozens of localized models across Honda, United, Road Prince, and Chinese clones.

### Supported Brands & Models:
1. **Atlas Honda:** CD 70, CD 70 Dream, CG 125, CG 125 Self, Pridor 100, CB 125F, CB 150F.
2. **Yamaha Pakistan:** YBR 125, YBR 125G, YB 125Z, YB 125Z-DX.
3. **Pak Suzuki:** GD 110S, GS 150, GS 150SE, GR 150.
4. **United Auto Industries:** US 70, US 100, US 125.
5. **Road Prince:** Classic 70, Bullet 70, Shift 110, Robinson 150.
6. **Super Power / Hi-Speed / Crown / Chinese Clones:** SP 70, Deluxe 70, PK 70, Star 70.

### Compatibility Schema Structure:
```typescript
export interface BikeCompatibility {
  brand: string;        // e.g. "Honda"
  model: string;        // e.g. "CD 70"
  years?: string;       // e.g. "2000 - 2026"
  notes?: string;       // e.g. "Universal fit for all 70cc commuter bikes"
}
```

The frontend catalog enables instant filtering:
`Select Brand [Honda] -> Select Model [CD 70] -> Display all compatible genuine parts.`

---

## 3. Product Schema & Authentic Initial Catalog

Each product entity is stored in `storage/shop-products.json` with verified specifications:
- `id`: Unique identifier (e.g. `sp-eng-001`).
- `sku`: Standardized SKU (e.g. `HA-ENG-70-001`).
- `name`: Full descriptive title.
- `slug`: URL-friendly identifier.
- `categoryId` & `categoryName`: Parent taxonomy.
- `brand`: Part manufacturer (Atlas Honda Genuine, Crown Lifan, NGK, GS Yuasa, Servis Tyres, etc.).
- `price` & `discountedPrice`: In Pakistani Rupees (PKR).
- `stockQuantity`: Live stock in workshop inventory.
- `lowStockThreshold`: Reorder trigger point.
- `condition`: `New` or `Refurbished/Used`.
- `images`: Array of authentic product photograph URLs with alt text.
- `compatibleBikes`: Verified motorcycle fitments.
- `features`: Key product advantages (e.g. "Heat treated steel", "Low smoke emission").
- `specifications`: Technical parameters (e.g. "Bore: 47mm", "Spark plug gap: 0.7mm").

### Seeded High-Demand Products (18 Genuine Items):
1. **Crown Lifan Complete Cylinder Block & Piston Kit – 70cc** (PKR 2,850)
2. **Atlas Honda Genuine Friction Clutch Plate Set – CG 125** (PKR 1,650)
3. **Atlas Honda Genuine Front & Rear Brake Shoe Set – CD 70 / CG 125** (PKR 750)
4. **D.I.D Heavy Duty 428H Drive Chain & Sprocket Kit – CG 125** (PKR 2,950)
5. **Denso Japan Standard Spark Plug – C7HSA (CD 70 / Chinese 70cc)** (PKR 350)
6. **Crown Standard Keihin-Type 70cc Carburettor Assembly** (PKR 2,450)
7. **Servis Cruiser Front Motorcycle Tyre – 2.50-17 with Tube** (PKR 4,800)
8. **Panther Heavy Duty Rear Motorcycle Tyre – 2.75-17 with Tube** (PKR 5,400)
9. **AGS Dry-Charged 12V 2.5Ah Motorcycle Battery – CD 70 / CG 125** (PKR 2,650)
10. **Atlas Honda Genuine High-Flow Paper Air Filter – CG 125** (PKR 450)
11. **Yamaha Genuine Oil Filter Element – YBR 125 / YBR 125G** (PKR 650)
12. **Crown Lifan Complete Clutch Cable Assembly – Honda CD 70** (PKR 250)
13. **Atlas Honda Genuine Throttle Cable Assembly – CG 125** (PKR 320)
14. **Crystal Lens Clear Front Indicator Assembly Set (Pair) – CG 125** (PKR 650)
15. **OEM Standard Rectangular Rearview Mirror Set (Pair) – 8mm Thread** (PKR 550)
16. **Heavy Duty Chromed Engine Crash Guard – Honda CD 70 / United 70** (PKR 1,450)
17. **Caltex Havoline Super 4T Motorcycle Engine Oil 20W-40 – 0.7 Litre** (PKR 980)
18. **Atlas Honda Genuine 4T Engine Oil 20W-40 – 1 Litre** (PKR 1,350)
