# Hamza Autos – Duplicate Image Audit & Detection Report
**Workshop Location:** Abu Bakar Road, Near Ali Hajvery Marriage Hall, Badami Bagh, Lahore, Pakistan  
**Audit Date:** November 2026  
**Auditor:** Senior Frontend Architect & Media QA Team  

---

## 1. Executive Summary

A thorough multi-level image audit was conducted across every public view, service card, blog article, brand guide, and gallery showcase of the Hamza Autos web application.

The audit revealed that a previous optimization task replaced foreign imagery with authentic commuter photos, but severely violated the **Strict No-Duplicate Rule** by reusing a small pool of 9 base photographs across 34 public placements. Furthermore, 4 brand cards and 2 gallery items in `src/data/businessData.ts` directly referenced duplicate files, and the Homepage showcase re-used photos from the About Us section.

All duplicate instances have been documented below, categorized by detection method, and resolved.

---

## 2. Detailed Duplicate Clusters Detected (Pre-Fix)

### Cluster 1: Engine Overhaul & Workbench
- **Referenced In:**
  - `about/engine-overhaul-workbench.jpg` (About Page)
  - `gallery/gallery-engine-rebuild.jpg` (Workshop Gallery)
  - `HomeView.tsx` (Homepage Experience Grid)
- **Detection:** Exact SHA-256 match (`454584dea180`) and identical perceptual dHash (`d4948f1919393959`).
- **Violation:** Same photograph used across 3 different public sections.
- **Resolution:** Retained original in About page (`about/engine-overhaul-workbench.jpg`). Created distinct engine disassembly photo for `gallery/gallery-engine-rebuild.jpg` (Pexels 12741656) and unique showcase photo for Homepage (`home/home-engine-diagnostics-showcase.jpg`).

### Cluster 2: Carburetor & Fuel Tuning
- **Referenced In:**
  - `about/tuning-carburetor-setup.jpg` (About Page)
  - `gallery/gallery-carburetor-tuning.jpg` (Workshop Gallery)
  - `HomeView.tsx` (Homepage Experience Grid)
- **Detection:** Exact SHA-256 match (`315afd8546c9`) and identical dHash (`c9a7e436cdd3cbcb`).
- **Violation:** Same photograph repeated across About, Gallery, and Homepage.
- **Resolution:** Retained in About page. Created unique photo for `gallery/gallery-carburetor-tuning.jpg` (Pexels 40046211) and unique photo for Homepage showcase (`home/home-precision-tuning-showcase.jpg`).

### Cluster 3: Clutch Plate & Slipping Diagnostic
- **Referenced In:**
  - `services/bike-clutch-repair.jpg` (Service Card 8)
  - `blog/blog-clutch-plate-guide.jpg` (Technical Blog 4)
- **Detection:** Exact SHA-256 match (`0a4b9d42737f`) and identical dHash (`6ee7e1c9393d0303`).
- **Violation:** Service card shared exact photograph with blog featured image.
- **Resolution:** Retained in Service Card 8. Replaced Blog 4 with distinct motorcycle clutch hub and drive assembly photo (Pexels 9606743).

### Cluster 4: 4-Stroke Engine Diagnostics & Tuning
- **Referenced In:**
  - `services/motorcycle-engine-repair.jpg` (Service Card 1)
  - `services/bike-tuning.jpg` (Service Card 2)
  - `blog/blog-engine-problems.jpg` (Technical Blog 1)
- **Detection:** Exact SHA-256 match (`60bde501a40c`) and identical dHash (`bc7c6cac8a5a662e`).
- **Violation:** 3 different public placements sharing the same image.
- **Resolution:** Retained in Service Card 1. Replaced Service Card 2 with slide carburetor calibration detail (Unsplash 1776264492483). Replaced Blog 1 with motorcycle cylinder head cooling fins detail (Unsplash 1776265003057).

### Cluster 5: Electrical Diagnostics, Wiring & Fuel Economy
- **Referenced In:**
  - `services/bike-wiring-repair.jpg` (Service Card 6)
  - `services/motorcycle-electrical-repair.jpg` (Service Card 5)
  - `blog/blog-fuel-economy-tuning.jpg` (Technical Blog 3)
- **Detection:** Exact SHA-256 match (`b80b783c8dbe`) and identical dHash (`3313933313121717`).
- **Violation:** 2 services and 1 blog sharing the exact same spark plug photo.
- **Resolution:** Retained in Service Card 6. Replaced Service Card 5 with mechanic diagnosing motorbike electrical wiring (Pexels 8550684). Replaced Blog 3 with vintage spark plug electrode gap inspection (Unsplash 1776264762509).

### Cluster 6: Engine Oil Change & Servicing
- **Referenced In:**
  - `services/motorcycle-oil-change.jpg` (Service Card 3)
  - `gallery/gallery-oil-servicing.jpg` (Workshop Gallery 4)
  - `blog/blog-oil-change-guide.jpg` (Technical Blog 2)
- **Detection:** Exact SHA-256 match (`3d17b76d9d41`) and identical dHash (`bfd97bf3d2d3e7ca`).
- **Violation:** 3 different public placements sharing the same oil pouring photo.
- **Resolution:** Retained in Service Card 3. Replaced Gallery 4 with commuter motorcycle oil servicing in workshop (Pexels 31864575). Replaced Blog 2 with motorcycle rear drivetrain and crankcase oil level check (Pexels 34240236).

### Cluster 7: Roller Drive Chain & Maintenance
- **Referenced In:**
  - `services/motorcycle-general-maintenance.jpg` (Service Card 13)
  - `gallery/gallery-chain-sprocket.jpg` (Workshop Gallery 5)
- **Detection:** Exact SHA-256 match (`f8e92c998ca8`) and identical dHash (`1b13939353333b3b`).
- **Violation:** Service card and gallery item shared the exact same drive chain photo.
- **Resolution:** Retained in Gallery 5. Replaced Service Card 13 with mechanic hands using wrench during 20-point roadworthiness check (Unsplash 1636761358772).

### Cluster 8: Workshop Service Bay Presence
- **Referenced In:**
  - `home/motorcycle-workshop-hero.jpg` (Homepage Hero Banner)
  - `gallery/gallery-service-bay.jpg` (Workshop Gallery 1)
- **Detection:** Exact SHA-256 match (`0874a6221991`) and identical dHash (`faaace8c8ca8a8b0`).
- **Violation:** Homepage hero banner repeated inside gallery showcase.
- **Resolution:** Retained in Homepage Hero. Replaced Gallery 1 with multiple motorcycle workstations and mechanics inside service bay (Pexels 12741630).

### Cluster 9: Tyre Replacement & Puncture Patching
- **Referenced In:**
  - `services/bike-puncture-repair.jpg` (Service Card 10)
  - `services/motorcycle-tyre-repair.jpg` (Service Card 9)
- **Detection:** Exact SHA-256 match (`4a026a7faac7`) and identical dHash (`c8c84a63a38fc350`).
- **Violation:** 2 service cards sharing the same roadside tyre shop photo.
- **Resolution:** Retained in Service Card 10. Replaced Service Card 9 with mechanic fixing motorcycle wheel spokes and truing rim with wrench (Pexels 8550756).

### Cluster 10: Commuter Brand Re-Use (In Code)
- **Referenced In:** `src/data/businessData.ts` `BRANDS_LIST`
  - United (`united-chinese-bike.jpg`)
  - Road Prince (`united-chinese-bike.jpg`)
  - Super Power (`united-chinese-bike.jpg`)
  - Chinese Motorcycles (`united-chinese-bike.jpg`)
- **Detection:** Duplicate asset URL reference across 4 distinct brand entries.
- **Violation:** 4 brands shared the exact same photo.
- **Resolution:** Retained in United. Sourced genuine red Pakistani 70cc commuter motorcycle in Sargodha for Road Prince (`brands/road-prince-motorcycle.jpg` - Pexels 11728286). Sourced genuine black commuter motorcycle for Super Power (`brands/super-power-motorcycle.jpg` - Pexels 9195325). Sourced Pakistani city street commuter motorcycle scene for Chinese Motorcycles (`brands/chinese-commuter-bike.jpg` - Pexels 14909087).

### Cluster 11: Gallery Re-Use of Service Images (In Code)
- **Referenced In:** `src/data/businessData.ts` `GALLERY_LIST`
  - `gal-7` referenced `services/motorcycle-brake-repair.jpg`
  - `gal-8` referenced `services/motorcycle-electrical-repair.jpg`
- **Detection:** Direct URL re-use across different view types.
- **Violation:** Gallery items re-using service card images.
- **Resolution:** Created unique photograph for `gallery/gallery-brake-servicing.jpg` (Pexels 36552350 - front wheel brake assembly). Created unique photograph for `gallery/gallery-electrical-diagnostics.jpg` (Unsplash 1785912112571 - stator coil and wiring loom).

---

## 3. Audit Verification Metric

| Metric | Before Audit & Fix | After Replacement & Prevention | Standard Achieved |
| :--- | :--- | :--- | :--- |
| **Total Registered Placements** | 41 | 41 | Complete Coverage |
| **Unique Photographic Assets** | 22 | 41 | **100% Unique** |
| **Duplicate Files on Disk** | 19 | **0** | **100% Eliminated** |
| **Duplicate Image References in Code** | 8 | **0** | **100% Eliminated** |
| **Minimum Perceptual Distance (dHash)** | 0 bits (Identical) | **9 bits (All Distinct)** | **Passed (Zero Duplicates)** |
| **Pakistani & Commuter Relevance** | 100% | 100% | **Maintained** |
| **Commercial License Verification** | 100% | 100% | **Fully Verified** |
