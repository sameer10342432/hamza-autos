# HAMZA AUTOS — ON-PAGE SEO, CONTENT & HEADING ARCHITECTURE REPORT
**Domain:** `https://hamzaautos.com`  
**Platform:** React 19 Frontend + Tailwind CSS  
**Target Search Market:** Motorcycle Mechanics & Service Centers in Lahore  

---

## 1. On-Page Heading Hierarchy Principles

Search engines use heading hierarchy (`H1`, `H2`, `H3`) to construct an accurate semantic document outline of every page. On the Hamza Autos platform:
1. **Single H1 per Page:** Every view renders exactly one dominant `H1` containing the core localized target keyword and location context.
2. **Logical H2 Subsections:** Services, symptoms, technical procedures, supported motorcycle models, and workshop warranties are housed under `H2` tags.
3. **Granular H3 Features:** Specific steps, part lists, and FAQ questions use `H3` tags.
4. **Keyword Density & Natural Language:** Content avoids artificial keyword stuffing; terms like "engine rebuild", "Badami Bagh", "Lahore", and "Honda 125" are integrated contextually into technical explanations.

---

## 2. Key Pages On-Page Structure

### A. Homepage (`/`)
- **Title Tag:** `Hamza Autos – Bike Mechanic & Motorcycle Repair Shop in Badami Bagh, Lahore`
- **Meta Description:** `Trusted motorcycle mechanic & repair shop in Badami Bagh, Lahore. Professional bike engine repair, tuning, oil change, electrical wiring, brakes & maintenance. Call +92 325 1814548.`
- **H1:** `Expert Motorcycle Mechanic & Repair Shop in Badami Bagh, Lahore`
- **H2 Sections:**
  - `Our Specialized Motorcycle Services in Lahore`
  - `Motorcycle Brands & Models We Master`
  - `Why Lahore Riders Trust Hamza Autos`
  - `Customer Reviews & Workshop Feedback`
  - `Frequently Asked Questions About Bike Maintenance`
  - `Visit Our Workshop on Abu Bakar Road, Badami Bagh`

### B. Service Detail Template (`/services/:slug`)
*(Example: `/services/motorcycle-engine-repair`)*
- **Title Tag:** `Motorcycle Engine Repair & Overhaul in Badami Bagh, Lahore | Hamza Autos`
- **Meta Description:** `Complete engine rebuilding, piston & cylinder bore work, valve clearance adjustment, and crankshaft repair. Expert bike mechanic workshop on Abu Bakar Road, Badami Bagh, Lahore. Call +92 325 1814548.`
- **H1:** `Motorcycle Engine Repair & Complete Overhaul in Badami Bagh, Lahore`
- **H2 Sections:**
  - `Common Engine Symptoms Indicating a Needed Overhaul`
  - `Our 6-Step Engine Teardown & Rebuilding Process`
  - `Key Features of Our Engine Overhaul Service`
  - `Supported Motorcycle Brands (Honda, Yamaha, Suzuki, United)`
  - `Related Mechanical Services at Hamza Autos`
- **H3 Steps:**
  - `Step 1: Precision Compression & Sonic Inspection`
  - `Step 2: Cylinder Teardown & Valve Lapping`
  - `Step 3: OEM Gasket Assembly & Torque Calibration`

### C. Brand Specialist Template (`/brands/:slug`)
*(Example: `/brands/honda-motorcycle-repair`)*
- **Title Tag:** `Honda Motorcycle Repair & Maintenance Specialist Badami Bagh Lahore | Hamza Autos`
- **Meta Description:** `Complete repair, genuine spare parts, and tuning for Honda CD 70, CG 125, and Pridor motorcycles at Hamza Autos Badami Bagh, Lahore. Call +92 325 1814548.`
- **H1:** `Specialized Honda Motorcycle Repair & Servicing in Badami Bagh, Lahore`
- **H2 Sections:**
  - `Honda Models Repaired (CD 70, CG 125, Pridor)`
  - `Common Honda Mechanical Issues We Solve Daily`
  - `Genuine Honda Replacement Parts & Warranty`

### D. Local Area Corridor Template (`/areas/:slug`)
*(Example: `/areas/bike-repair-near-shadbagh-lahore`)*
- **Title Tag:** `Bike Mechanic & Motorcycle Repair Near Shadbagh, Lahore | Hamza Autos Badami Bagh`
- **Meta Description:** `Looking for a trusted bike mechanic near Shadbagh? Hamza Autos is located approx. 2.5 km on Abu Bakar Road, Badami Bagh. Drive time: 7-10 minutes. Call +92 325 1814548.`
- **H1:** `Dependable Bike Mechanic & Motorcycle Repair Near Shadbagh, Lahore`
- **H2 Sections:**
  - `Why Shadbagh Commuters Choose Hamza Autos`
  - `Fast 7-10 Minute Route from Shadbagh to Badami Bagh`
  - `Key Nearby Landmarks & Workshop Accessibility`
  - `Services Most Requested by Shadbagh Commuters`

---

## 3. Image Optimization & Alt Text Standards

All images across the application follow search engine best practices:
1. **Next-Gen WebP Format:** High visual clarity with up to 70% smaller file sizes.
2. **Contextual Descriptive Alt Text:**
   - Hero: `alt="Hamza Autos Motorcycle Workshop Abu Bakar Road Badami Bagh Lahore"`
   - Engine Repair: `alt="Motorcycle engine teardown and cylinder boring at Hamza Autos Badami Bagh"`
   - Bike Tuning: `alt="Motorcycle carburetor cleaning and spark plug tuning in Lahore"`
   - Oil Change: `alt="Motorcycle 4T engine oil drainage and magnetic sump plug cleaning"`
3. **Explicit Dimensions:** Prevent layout shifts (CLS) on mobile loading.
4. **Lazy Loading:** `loading="lazy"` on all images below the fold.

---

## 4. Internal Linking Architecture

Internal links create strong semantic authority throughout the website:
- **Service-to-Booking Linkage:** Every service page features a direct contextual action opening the appointment modal with pre-selected service metadata.
- **Service-to-Service Cross-Links:** Related services (e.g. Engine Repair linking to Tuning and Oil Change) pass link equity between related topics.
- **Area-to-Workshop Route Linkage:** Every area page links directly to Google Maps navigation coordinates and back to the Badami Bagh workshop hub.
- **Blog-to-Service Recommendation:** Technical troubleshooting articles link directly into relevant repair booking funnels.
