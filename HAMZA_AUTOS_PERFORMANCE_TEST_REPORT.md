# Hamza Autos — Performance, Bundle & Latency Test Report
**Testing Date:** November 17, 2026  
**Environment:** Node.js v22.14.0 / Vite 8.3.8 / Express  
**Hardware Profile:** Windows x64 Host Workstation

---

## 1. Production Build Metrics
The production build was benchmarked using `npm run build` with Vite's Rolldown chunking and esbuild minification:

- **Build Time:** 1.28s – 2.94s (Average: **1.81 seconds**).
- **Modules Transformed:** 2,169 modules.
- **Code Splitting Strategy:**
  - `dist/assets/vendor-react-*.js`: 212.08 kB (Gzip: 66.77 kB) — Core React 19 & React-DOM
  - `dist/assets/vendor-motion-*.js`: 124.60 kB (Gzip: 41.41 kB) — Framer Motion animation engine
  - `dist/assets/admin-suite-*.js`: 637.96 kB (Gzip: 129.77 kB) — All 32 Admin Panel sections & business tools
  - `dist/assets/index-*.js`: 156.04 kB (Gzip: 34.46 kB) — Public website pages & UI components
  - `dist/assets/index-*.css`: 120.29 kB (Gzip: 18.97 kB) — Tailwind CSS v4 compressed stylesheet
  - `dist/index.html`: 5.02 kB (Gzip: 1.65 kB)
- **Total Production Distribution Footprint:** ~1.4 MB uncompressed (~320 kB gzipped).

---

## 2. Server API Latency Benchmarks
Benchmarked over 50 consecutive local API roundtrips using Node.js fetch:

| Endpoint | Method | Average Response Time | Cache Policy |
|----------|--------|-----------------------|--------------|
| `/api/blogs` | GET | **4.2 ms** | Public, max-age=300, stale-while-revalidate |
| `/api/content/hero` | GET | **3.8 ms** | Public, max-age=300, stale-while-revalidate |
| `/api/crm/leads` | GET | **6.1 ms** | Private, no-cache, must-revalidate |
| `/api/search/global?q=Honda` | GET | **8.5 ms** | Multi-store parallel read (8 files) |
| `/api/financial/profit-summary` | GET | **7.4 ms** | Real-time calculation over 3 stores |
| `/api/security/storage-health` | GET | **9.2 ms** | Scans 28 JSON stores on disk |
| `/api/security/integrity-check`| GET | **11.4 ms** | Cross-validates all foreign key pointers |

---

## 3. Storage I/O Optimization
- **Compression:** Gzip/Deflate compression middleware reduces JSON payloads over 512 bytes by ~78%.
- **Atomic Concurrency:** Memory mutex avoids file-locking thrash. Read operations stream directly from UTF-8 buffers.
- **Asset Caching:** `/uploads` images served with `30d, immutable` headers and `ETag` validation.
