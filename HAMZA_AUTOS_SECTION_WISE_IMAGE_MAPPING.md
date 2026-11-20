# HAMZA AUTOS – SECTION-WISE IMAGE MAPPING & CENTRAL REGISTRY

**Generated:** November 19, 2026  
**System:** Hamza Autos Central Unique Image Mapping Registry (`src/utils/imageRegistry.ts`)  
**Uniqueness Guarantee:** 100% Exclusive 1-to-1 Mapping. No image is shared or reused across any two public placements.

---

## Architecture of Central Image Mapping

Each public image slot on the Hamza Autos website is bound to a single registered asset record in `CENTRAL_IMAGE_REGISTRY`. The mapping enforces:
1. **Single Exclusive Assignment:** An image asset cannot be assigned to more than one route or section ID.
2. **Dual-Format Delivery:** Every image asset provides a standard JPEG (`.jpg`) and a next-generation WebP (`.webp`) format for modern high-performance browser delivery.
3. **Exact Dimensions:** Uniform 1200x800 resolution (3:2 ratio) across all cards, banners, and thumbnails to prevent layout shifting (CLS = 0).
4. **Verified Perceptual Hash (dHash):** Stored 64-bit difference hash prevents duplicate assignment even if an image file is renamed or recompressed.

---

## Complete 41-Slot Mapping Inventory

| Slot ID | Website Route | Target Section / Component | Asset File Path | Dimensions | SHA-256 (12h) | dHash (64-bit) | Commercial License & Attribution |
|---------|---------------|----------------------------|-----------------|------------|---------------|----------------|----------------------------------|
| `home-hero` | `/` | **Homepage Hero Backdrop Banner** | `assets/images/home/motorcycle-workshop-hero.jpg` | 1200x800 | `ca06a1dfcaf4` | `e131515c59496d86` | CC BY-SA 2.0 (Flickr (Imran, Islamabad)) |
| `home-presence` | `/` | **Homepage Badami Bagh Service Bay Showcase** | `assets/images/home/motorcycle-service-bay-presence.jpg` | 1200x800 | `ab50167ecf04` | `e4d43031b13239d8` | CC BY 2.0 (Flickr (Christopher)) |
| `home-showcase-engine` | `/` | **Homepage Engine Diagnostics Showcase Grid** | `assets/images/home/home-engine-diagnostics-showcase.jpg` | 1200x800 | `7ec492a3ff34` | `bc7c6cac8a5a662e` | CC0 / Public Domain (Wikimedia Commons (File:Motorcycle Engine Block.jpg)) |
| `home-showcase-tuning` | `/` | **Homepage Precision Fuel Calibration Showcase Grid** | `assets/images/home/home-precision-tuning-showcase.jpg` | 1200x800 | `21a61412e5cf` | `979bb2d075494d8c` | CC BY-SA 3.0 (Wikimedia Commons (File:Keihin carburetor.jpg)) |
| `about-philosophy` | `/about` | **About Page Master Mechanic Philosophy** | `assets/images/about/workshop-mechanic-philosophy.jpg` | 1200x800 | `b0292999d99d` | `3339b9bbb3168e1a` | Pexels Free License (Pexels Photo 1413412) |
| `about-engine-workbench` | `/about` | **About Section Engine Overhaul Workbench** | `assets/images/about/engine-overhaul-workbench.jpg` | 1200x800 | `4d9312cb2575` | `ab67672facdc9ccd` | CC BY-SA 4.0 (Wikimedia Commons (File:Detail view of a large single-cylinder air-cooled motorcycle engine.jpg)) |
| `about-tuning-rig` | `/about` | **About Section Fuel Tuning Rig** | `assets/images/about/tuning-carburetor-setup.jpg` | 1200x800 | `1312d7f27ca4` | `c9a7e436cdd3cbcb` | Unsplash Free License (Unsplash Photo 1776264730216) |
| `svc-engine-repair` | `/services/motorcycle-engine-repair` | **Service 1: Engine Overhaul & Head Repair** | `assets/images/services/motorcycle-engine-repair.jpg` | 1200x800 | `f948d8f28b07` | `d4948f1919393959` | CC BY-SA 3.0 (Wikimedia Commons (File:Mekanik motor - motorcycle mechanic.jpg)) |
| `svc-bike-tuning` | `/services/bike-tuning` | **Service 2: Bike Tuning & Fuel Economy Optimization** | `assets/images/services/bike-tuning.jpg` | 1200x800 | `953b4b490b47` | `6589cb9943f335dd` | Unsplash Free License (Unsplash Photo photo-1650569663338-f6921d483868 (Mick Haupt)) |
| `svc-oil-change` | `/services/motorcycle-oil-change` | **Service 3: Engine Oil Change & 4T Fluid Flush** | `assets/images/services/motorcycle-oil-change.jpg` | 1200x800 | `11f1e9b4e2cb` | `bfd97bf3d2d3e7ca` | Unsplash Free License (Unsplash Photo 1627918451877) |
| `svc-general-repair` | `/services/general-bike-repair` | **Service 4: General Periodic Maintenance** | `assets/images/services/general-bike-repair.jpg` | 1200x800 | `e8c24d76d2e4` | `3c58d676f4948e8e` | Pexels Free License (Pexels Photo 2244746) |
| `svc-electrical-repair` | `/services/motorcycle-electrical-repair` | **Service 5: Electrical Diagnostics & CDI Repair** | `assets/images/services/motorcycle-electrical-repair.jpg` | 1200x800 | `671a82ec1ae5` | `3398ac666b25929b` | Unsplash Free License (Unsplash Photo photo-1777042510267-2c0543a0d715) |
| `svc-wiring-repair` | `/services/bike-wiring-repair` | **Service 6: Wiring Harness & Switchgear Replacement** | `assets/images/services/bike-wiring-repair.jpg` | 1200x800 | `7d81e2045691` | `2f0f0582471d1864` | CC BY-SA 3.0 (Wikimedia Commons (File:Motorcycle BMW f650 st 10 left-handlebar.jpg)) |
| `svc-brake-repair` | `/services/motorcycle-brake-repair` | **Service 7: Brake Shoe & Drum Overhaul** | `assets/images/services/motorcycle-brake-repair.jpg` | 1200x800 | `f3ca3828ef81` | `e6abcd4c6533939b` | CC BY-SA 3.0 (Wikimedia Commons (File:Drum Brake parts.jpg)) |
| `svc-clutch-repair` | `/services/bike-clutch-repair` | **Service 8: Clutch Plate & Friction Plate Renewal** | `assets/images/services/bike-clutch-repair.jpg` | 1200x800 | `608b74e14a7a` | `6ee7e1c9393d0303` | Unsplash Free License (Unsplash Photo 1617480174392) |
| `svc-tyre-repair` | `/services/motorcycle-tyre-repair` | **Service 9: Tyre Replacement & Wheel Truing** | `assets/images/services/motorcycle-tyre-repair.jpg` | 1200x800 | `7d733405d83a` | `ee5a5373879f9e1e` | Pexels Free License (Pexels Photo 5794260) |
| `svc-puncture-repair` | `/services/bike-puncture-repair` | **Service 10: Hot Vulcanized Puncture Repair** | `assets/images/services/bike-puncture-repair.jpg` | 1200x800 | `9a1ff8fc258e` | `c8c84a63a38fc350` | CC BY 2.0 (Flickr (Syed Mehdi)) |
| `svc-spare-parts` | `/services/motorcycle-spare-parts` | **Service 11: Genuine Spare Parts Fitting** | `assets/images/services/motorcycle-spare-parts.jpg` | 1200x800 | `a886e71ac9cc` | `67ebf3a4e578e2e0` | CC BY-SA 3.0 (Wikimedia Commons (File:Motorcyle spares..JPG)) |
| `svc-bike-modification` | `/services/bike-modification` | **Service 12: Commuter Modifications & Ergonomics** | `assets/images/services/bike-modification.jpg` | 1200x800 | `ba28bf8ca3f9` | `e4845653d1a33324` | Unsplash Free License (Unsplash Photo photo-1636761358772-798789548d25) |
| `svc-general-maintenance` | `/services/motorcycle-general-maintenance` | **Service 13: 20-Point Roadworthiness Safety Check** | `assets/images/services/motorcycle-general-maintenance.jpg` | 1200x800 | `06e510f9ef5e` | `84848d091e0e0e3a` | Unsplash Free License (Unsplash Photo photo-1769028886710-3ecefa6d0acd) |
| `brand-honda` | `/brands/honda` | **Brand Guide: Honda CD 70 / CG 125** | `assets/images/brands/honda-motorcycle.jpg` | 1200x800 | `473834925c31` | `f5b28a435b33271a` | CC BY-SA 4.0 (Wikimedia Commons (File:Honda 70 2025.jpg)) |
| `brand-yamaha` | `/brands/yamaha` | **Brand Guide: Yamaha YBR 125 Series** | `assets/images/brands/yamaha-motorcycle.jpg` | 1200x800 | `b97cfe75c4c5` | `bc7a1c9caca571c3` | Pexels Free License (Pexels Photo 104842) |
| `brand-suzuki` | `/brands/suzuki` | **Brand Guide: Suzuki GS 150 / GD 110S** | `assets/images/brands/suzuki-motorcycle.jpg` | 1200x800 | `6bf767592a2f` | `9898d8109a42486c` | Pexels Free License (Pexels Photo 2116475) |
| `brand-united` | `/brands/united` | **Brand Guide: United Auto Industries (US 70 / 125)** | `assets/images/brands/united-chinese-bike.jpg` | 1200x800 | `bfd858d78a10` | `278333074d17294b` | CC BY-SA 4.0 (Wikimedia Commons (File:Honda cd 70.jpg)) |
| `brand-road-prince` | `/brands/road-prince` | **Brand Guide: Road Prince (RP 70 / 110)** | `assets/images/brands/road-prince-motorcycle.jpg` | 1200x800 | `09acc09008e6` | `c181931389492888` | CC BY-SA 4.0 (Wikimedia Commons (File:Various models of Honda CG125.jpg)) |
| `brand-super-power` | `/brands/super-power` | **Brand Guide: Super Power (SP 70 / 125)** | `assets/images/brands/super-power-motorcycle.jpg` | 1200x800 | `121de9b700e4` | `13323e3b0777533e` | CC BY-SA 4.0 (Wikimedia Commons (File:Honda CG125.jpg)) |
| `brand-chinese` | `/brands/chinese-bikes` | **Brand Guide: Chinese Commuter Bikes (Crown/Metro/Unique)** | `assets/images/brands/chinese-commuter-bike.jpg` | 1200x800 | `f485c0953f6b` | `753d9423c8a85431` | CC BY-SA 3.0 (Wikimedia Commons (File:Sea of motorcycles scooters at Lahore Railway Station.jpg)) |
| `loc-badami-bagh` | `/locations/badami-bagh` | **Areas We Serve: Badami Bagh & Circular Road** | `assets/images/locations/lahore-badami-bagh-traffic.jpg` | 1200x800 | `d80da93c37db` | `b8b0f0e0b4e0c880` | CC BY-SA 3.0 (Wikimedia Commons (File:Lahore traffic.jpg)) |
| `loc-lahore-transit` | `/locations/lahore-commuter-routes` | **Areas We Serve: Lahore Arterial Routes & Ring Road** | `assets/images/locations/lahore-commuter-road.jpg` | 1200x800 | `7a03f961971c` | `35bc2bb1926e7595` | CC BY-SA 3.0 (Wikimedia Commons (File:Family on motorcycle in Lahore.jpg)) |
| `gal-service-bay` | `/gallery` | **Workshop Gallery: Main Workshop Bay** | `assets/images/gallery/gallery-service-bay.jpg` | 1200x800 | `e18a3f481a16` | `faaace8c8ca8a8b0` | CC BY-SA 4.0 (Wikimedia Commons (File:Motorcycle workshop.jpg)) |
| `gal-engine-rebuild` | `/gallery` | **Workshop Gallery: 4-Stroke Engine Bench Overhaul** | `assets/images/gallery/gallery-engine-rebuild.jpg` | 1200x800 | `c62dfd3f912e` | `eaebe327cfe7c733` | CC0 / Public Domain (Wikimedia Commons (File:Motorcycle Rear Wheel Assembly.jpg)) |
| `gal-carburetor-tuning` | `/gallery` | **Workshop Gallery: Carburetor Cleaning & Syncing** | `assets/images/gallery/gallery-carburetor-tuning.jpg` | 1200x800 | `7942d8384495` | `9d8736365a66e4e9` | CC BY-SA 3.0 (Wikimedia Commons (File:Mikuni BS36SS Carburetor.JPG)) |
| `gal-oil-servicing` | `/gallery` | **Workshop Gallery: 4T Engine Oil Draining & Refill** | `assets/images/gallery/gallery-oil-servicing.jpg` | 1200x800 | `deb1fb9f6c52` | `28bccb3171392da5` | CC BY-SA 4.0 (Wikimedia Commons (File:Comparison of new and old motorcycle oil filters.jpg)) |
| `gal-chain-sprocket` | `/gallery` | **Workshop Gallery: Drive Chain Tension & Sprocket Fit** | `assets/images/gallery/gallery-chain-sprocket.jpg` | 1200x800 | `1566d274d702` | `1b13939353333b3b` | Pexels Free License (Pexels Photo 12741673) |
| `gal-suspension-shocks` | `/gallery` | **Workshop Gallery: Front Fork Spring & Shock Absorber** | `assets/images/gallery/gallery-suspension-shocks.jpg` | 1200x800 | `f8daa76d2b72` | `ec26373736373337` | CC BY-SA 3.0 (Wikimedia Commons (File:Marzocchis.jpg)) |
| `gal-brake-servicing` | `/gallery` | **Workshop Gallery: Motorcycle Brake Drum & Shoe Servicing** | `assets/images/gallery/gallery-brake-servicing.jpg` | 1200x800 | `7b3edcffbba2` | `58786c6c0e323373` | Pexels Free License (Pexels Photo 833320) |
| `gal-electrical-diagnostics` | `/gallery` | **Workshop Gallery: Electrical Loom & Stator Coil Diagnosis** | `assets/images/gallery/gallery-electrical-diagnostics.jpg` | 1200x800 | `edea82f6d445` | `aa2233bb93939393` | CC BY-SA 3.0 (Wikimedia Commons (File:Ignition coils.jpg)) |
| `blog-engine-problems` | `/blog/motorcycle-engine-problems-guide` | **Blog: Common Motorcycle Engine Problems and Solutions** | `assets/images/blog/blog-engine-problems.jpg` | 1200x800 | `7d592f43c289` | `0707470d150d1460` | CC BY-SA 3.0 (Wikimedia Commons (File:Motorcycles-Honda-MVX250F-Conrod-Piston 01.JPG)) |
| `blog-oil-change-guide` | `/blog/motorcycle-oil-change-guide` | **Blog: Motorcycle Engine Oil & Maintenance Guide** | `assets/images/blog/blog-oil-change-guide.jpg` | 1200x800 | `eac4f34e1536` | `5924aeccc78e3c8d` | CC BY-SA 4.0 (Wikimedia Commons (File:Kawasaki W175 Motorcycle Oil Filter.jpg)) |
| `blog-fuel-economy-tuning` | `/blog/fuel-economy-tuning-tips` | **Blog: How to Improve Motorcycle Fuel Economy** | `assets/images/blog/blog-fuel-economy-tuning.jpg` | 1200x800 | `80de2dab6273` | `3313933313121717` | CC BY-SA 3.0 (Wikimedia Commons (File:Spark plug comparison.jpg)) |
| `blog-clutch-plate-guide` | `/blog/motorcycle-clutch-plate-guide` | **Blog: Signs Bike Clutch Plate Is Slipping & Replacement** | `assets/images/blog/blog-clutch-plate-guide.jpg` | 1200x800 | `ace3c102278e` | `afa29684a666c0d1` | CC BY-SA 3.0 (Wikimedia Commons (File:Clutch discs.jpg)) |

---

## Route-by-Route Breakdown

### 1. Route: `/` (Homepage)
- **`home-hero`**: `assets/images/home/motorcycle-workshop-hero.jpg` (Hero Banner Backdrop)
- **`home-presence`**: `assets/images/home/motorcycle-service-bay-presence.jpg` (Service Bay Showcase)
- **`home-showcase-engine`**: `assets/images/home/home-engine-diagnostics-showcase.jpg` (Engine Diagnostics Grid)
- **`home-showcase-tuning`**: `assets/images/home/home-precision-tuning-showcase.jpg` (Carburetor Calibration Grid)

### 2. Route: `/about` (About Us)
- **`about-philosophy`**: `assets/images/about/workshop-mechanic-philosophy.jpg` (Master Mechanic Ustad Philosophy)
- **`about-engine-workbench`**: `assets/images/about/engine-overhaul-workbench.jpg` (Engine Overhaul Workbench)
- **`about-tuning-rig`**: `assets/images/about/tuning-carburetor-setup.jpg` (Fuel Tuning Rig)

### 3. Route: `/services/*` (All 13 Dedicated Service Pages & Cards)
- **`/services/motorcycle-engine-repair`**: `assets/images/services/motorcycle-engine-repair.jpg` (`svc-engine-repair`)
- **`/services/bike-tuning`**: `assets/images/services/bike-tuning.jpg` (`svc-bike-tuning`)
- **`/services/motorcycle-oil-change`**: `assets/images/services/motorcycle-oil-change.jpg` (`svc-oil-change`)
- **`/services/general-bike-repair`**: `assets/images/services/general-bike-repair.jpg` (`svc-general-repair`)
- **`/services/motorcycle-electrical-repair`**: `assets/images/services/motorcycle-electrical-repair.jpg` (`svc-electrical-repair`)
- **`/services/bike-wiring-repair`**: `assets/images/services/bike-wiring-repair.jpg` (`svc-wiring-repair`)
- **`/services/motorcycle-brake-repair`**: `assets/images/services/motorcycle-brake-repair.jpg` (`svc-brake-repair`)
- **`/services/bike-clutch-repair`**: `assets/images/services/bike-clutch-repair.jpg` (`svc-clutch-repair`)
- **`/services/motorcycle-tyre-repair`**: `assets/images/services/motorcycle-tyre-repair.jpg` (`svc-tyre-repair`)
- **`/services/bike-puncture-repair`**: `assets/images/services/bike-puncture-repair.jpg` (`svc-puncture-repair`)
- **`/services/motorcycle-spare-parts`**: `assets/images/services/motorcycle-spare-parts.jpg` (`svc-spare-parts`)
- **`/services/bike-modification`**: `assets/images/services/bike-modification.jpg` (`svc-bike-modification`)
- **`/services/motorcycle-general-maintenance`**: `assets/images/services/motorcycle-general-maintenance.jpg` (`svc-general-maintenance`)

### 4. Route: `/brands/*` (Commuter Motorcycle Guides)
- **`/brands/honda`**: `assets/images/brands/honda-motorcycle.jpg` (`brand-honda`)
- **`/brands/yamaha`**: `assets/images/brands/yamaha-motorcycle.jpg` (`brand-yamaha`)
- **`/brands/suzuki`**: `assets/images/brands/suzuki-motorcycle.jpg` (`brand-suzuki`)
- **`/brands/united`**: `assets/images/brands/united-chinese-bike.jpg` (`brand-united`)
- **`/brands/road-prince`**: `assets/images/brands/road-prince-motorcycle.jpg` (`brand-road-prince`)
- **`/brands/super-power`**: `assets/images/brands/super-power-motorcycle.jpg` (`brand-super-power`)
- **`/brands/chinese-bikes`**: `assets/images/brands/chinese-commuter-bike.jpg` (`brand-chinese`)

### 5. Route: `/locations/*` (Areas We Serve)
- **`/locations/badami-bagh`**: `assets/images/locations/lahore-badami-bagh-traffic.jpg` (`loc-badami-bagh`)
- **`/locations/lahore-commuter-routes`**: `assets/images/locations/lahore-commuter-road.jpg` (`loc-lahore-transit`)

### 6. Route: `/gallery` (Workshop Facilities & Tooling)
- **`gal-service-bay`**: `assets/images/gallery/gallery-service-bay.jpg`
- **`gal-engine-rebuild`**: `assets/images/gallery/gallery-engine-rebuild.jpg`
- **`gal-carburetor-tuning`**: `assets/images/gallery/gallery-carburetor-tuning.jpg`
- **`gal-oil-servicing`**: `assets/images/gallery/gallery-oil-servicing.jpg`
- **`gal-chain-sprocket`**: `assets/images/gallery/gallery-chain-sprocket.jpg`
- **`gal-suspension-shocks`**: `assets/images/gallery/gallery-suspension-shocks.jpg`
- **`gal-brake-servicing`**: `assets/images/gallery/gallery-brake-servicing.jpg`
- **`gal-electrical-diagnostics`**: `assets/images/gallery/gallery-electrical-diagnostics.jpg`

### 7. Route: `/blog/*` (Technical Articles)
- **`/blog/motorcycle-engine-problems-guide`**: `assets/images/blog/blog-engine-problems.jpg` (`blog-engine-problems`)
- **`/blog/motorcycle-oil-change-guide`**: `assets/images/blog/blog-oil-change-guide.jpg` (`blog-oil-change-guide`)
- **`/blog/fuel-economy-tuning-tips`**: `assets/images/blog/blog-fuel-economy-tuning.jpg` (`blog-fuel-economy-tuning`)
- **`/blog/motorcycle-clutch-plate-guide`**: `assets/images/blog/blog-clutch-plate-guide.jpg` (`blog-clutch-plate-guide`)
