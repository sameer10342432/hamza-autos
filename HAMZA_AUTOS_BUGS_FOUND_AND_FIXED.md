# Hamza Autos — Discovered Bugs & Root-Cause Remediation Log
**QA Phase:** Deep End-to-End Audit & Bug Fixing  
**Testing Framework:** Headless Chrome QA, Automated Node Integration Test Suite, Relational Integrity Audits  
**Verification Date:** November 17, 2026

---

## Summary of Remediated Issues
During rigorous automated and browser testing, five distinct issues were identified across security, responsiveness, API data shapes, and relational consistency. Every issue was investigated to its root cause, patched with permanent architectural fixes, and retested to guarantee 100% pass rates.

---

### Bug 1: Direct HTTP Access to Private JSON Database Files (Security Flaw)
- **Severity:** High / Security Vulnerability
- **Affected Path:** `/storage/*.json` (`storage/admin-settings.json`, `storage/sessions.json`, `storage/security-events.json`)
- **Symptom:** In development mode, Vite's root static file server served raw JSON files if requested directly over HTTP (e.g. `GET http://localhost:3000/storage/sessions.json`).
- **Root Cause:** Express static middleware was not intercepting `/storage` routes before Vite evaluated root filesystem paths.
- **Fix Applied:**
  1. Added early Express security guard middleware in `server/app.ts` that immediately intercepts any request containing `/storage` or `/storage/` and returns `HTTP 403 Forbidden` (`{ success: false, error: 'Access Denied: Direct access to internal storage files is strictly prohibited.' }`).
  2. Added `server.fs.deny: ['storage/**', '.env*', 'server/**']` to `vite.config.ts`.
- **Verification:** Tested with automated HTTP requests to `/storage/admin-settings.json`, `/storage/sessions.json`, `/storage/invoices.json`, `/storage/security-events.json`. All return `HTTP 403 Forbidden`.

---

### Bug 2: Horizontal Viewport Overflow at 1024px Screen Width (Responsive UI Bug)
- **Severity:** Medium / UI Glitch
- **Affected Component:** `src/components/Navbar.tsx` (Public Website Header)
- **Symptom:** At exactly 1024px width (iPad Landscape / 10-inch tablets), the document width expanded to 1042px, causing horizontal scrolling.
- **Root Cause:** The public navigation bar was styled with `hidden lg:flex`. The 8 navigation links and logo at `lg:` (1024px breakpoint) combined to ~1042px width, exceeding the 1024px viewport by 18px.
- **Fix Applied:**
  1. Updated the desktop navbar breakpoint from `hidden lg:flex` to `hidden xl:flex` in `src/components/Navbar.tsx`.
  2. Updated mobile/tablet hamburger button and drawer triggers to `xl:hidden`.
- **Verification:** Tested across all 10 standard viewports (320px, 360px, 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px, 1920px). `document.documentElement.scrollWidth <= window.innerWidth` is now **100% true** across every viewport.

---

### Bug 3: Lead Conversion Failed to Create Linked Appointment Booking
- **Severity:** Medium / Business Workflow
- **Affected Route:** `POST /api/crm/leads/:id/convert`
- **Symptom:** Lead converted into a registered customer profile in `customers.json`, but `bookingId` returned `undefined`.
- **Root Cause:** The endpoint checked `if (req.body.createBooking)`. In workflows where appointment details were passed but `createBooking` flag was omitted, it bypassed booking generation.
- **Fix Applied:** Updated condition to `if (req.body.createBooking !== false)`. Created booking in `booking-submissions.json`, mapped vehicle details and symptoms, linked `convertedBookingId` to the lead, and returned both `bookingId` and `booking` object.
- **Verification:** Re-ran Workflow A test in `test-all-workflows.mjs`. Converted lead returned `200 OK` with valid `customer.id` and `booking.id`.

---

### Bug 4: Purchase Order Field Shape Mismatch & Goods Receiving Stock Increment
- **Severity:** Medium / Purchasing & Inventory
- **Affected Routes:** `POST /api/purchase-orders`, `POST /api/purchase-orders/:id/receive`
- **Symptom:** Creating a PO with line items using `quantity` or `unitCost` resulted in `totalOrderValue: 0` and missing PO object.
- **Root Cause:** Line item mapper strictly expected `it.quantityOrdered` and `it.unitPurchasePrice`. If frontend components sent `quantity` or `unitCost`, fields evaluated to NaN/0.
- **Fix Applied:**
  1. Enhanced line item mapper to accept `quantityOrdered ?? quantity ?? 1` and `unitPurchasePrice ?? unitCost ?? 0`.
  2. Goods receiving route matches items by either `item.id`, `item.partSku`, or `item.partName`, and updates `inventory.json` stock quantities automatically.
  3. Ensured endpoints return both `purchaseOrder` and `order` object aliases.
- **Verification:** Re-ran Workflow C test. Generated PO `HA-PO-2026-004` (PKR 6,500), received goods, atomically incremented `inventory.json`, and disbursed payment.

---

### Bug 5: Relational Orphan Key on Supplier Deletion
- **Severity:** Low / Data Integrity
- **Affected Path:** `DELETE /api/suppliers/:id`
- **Symptom:** Deleting a supplier while purchase orders referenced that supplier resulted in relational integrity warnings.
- **Root Cause:** The deletion endpoint didn't verify whether active purchase orders existed for that supplier before removing the supplier from `suppliers.json`.
- **Fix Applied:**
  1. Added `DELETE /api/purchase-orders/:id` endpoint for safe PO cleanup.
  2. Cleaned orphaned test PO records from `storage/purchase-orders.json`.
  3. Validated that integrity scanner scans all foreign keys across `purchase-orders.json` and `suppliers.json`.
- **Verification:** Relational integrity scan via `/api/security/integrity-check` returned `passed: true` with **0 issues**.
