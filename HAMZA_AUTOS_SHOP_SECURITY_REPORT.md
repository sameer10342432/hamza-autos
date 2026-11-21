# HAMZA AUTOS – SHOP SECURITY & AUDIT REPORT

**Author:** Antigravity Cyber Security & Systems Integrity Team  
**Scope:** Authentication, Rate Limiting, Atomic Storage Safety, Input Validation & Audit Trails  
**Reference Files:** `server/auth.ts`, `server/shopRoutes.ts`, `server/fileStore.ts`, `storage/audit-logs.json`  
**Date:** November 2026  

---

## 1. Security Overview

The Hamza Autos shop e-commerce platform implements a multi-layer defense-in-depth model that protects customer records, inventory values, and administrative controls without relying on heavy relational database security layers.

```
                           [Inbound Request]
                                   │
                                   ▼
                       [IP-Based Rate Limiting]
                       (Max 5 failed attempts / 15m)
                                   │
                                   ▼
                     [Route Protection Middleware]
                  ┌────────────────┴────────────────┐
                  ▼                                 ▼
         [Public Endpoints]               [Admin Endpoints]
        - Input Sanitization             - Bearer Session Token Check
        - Phone Regex (03XXXXXXXXX)      - PBKDF2 Session Validation
        - Quantity Stock Check           - Admin User Context
                  │                                 │
                  └────────────────┬────────────────┘
                                   │
                                   ▼
                     [Atomic JSON Serialization]
                   (Temp file -> rename write lock)
                                   │
                                   ▼
                   [Immutable Audit Logging Table]
```

---

## 2. Authentication & Admin Authorization

1. **PBKDF2 Password Hashing:**
   Administrative credentials are protected with PBKDF2 (`crypto.pbkdf2Sync` using SHA-512 with 10,000 iterations and dedicated salt). Passwords are never stored in plaintext.
2. **Cryptographic Token Verification:**
   All administrative actions (`/api/shop/admin/*`) require a valid cryptographic bearer session token verified by `requireAuth` middleware.
3. **Session Expiry & Revocation:**
   Sessions expire automatically after 24 hours (or 30 days if "Remember Me" is selected). Expired tokens are rejected with HTTP 401 Unauthorized.
4. **Brute Force Protection:**
   The `/api/auth/login` endpoint enforces IP-based rate limiting (5 failed attempts per 15-minute window), returning HTTP 429 Too Many Requests if exceeded.

---

## 3. Atomic File Storage Safety & Concurrency

The shop stores records across 8 JSON files in `storage/`:
- `shop-products.json`
- `shop-categories.json`
- `shop-brands-models.json`
- `shop-orders.json`
- `shop-inventory-movements.json`
- `shop-payments.json`
- `shop-shipping.json`
- `shop-settings.json`

### File Integrity Guarantee:
To prevent file corruption during simultaneous customer checkout and admin order updates, `writeJsonFileAtomic()` employs an atomic write strategy:
1. Data is stringified with 2-space indentation.
2. The payload is written to a temporary swap file: `<fileName>.tmp.<timestamp>`.
3. The temporary file is atomically renamed (`fs.promises.rename()`) to overwrite the destination file.
4. If an unexpected power loss or process termination occurs, the original JSON file remains uncorrupted.

---

## 4. Input Validation & Payment Verification Integrity

1. **Pakistani Phone Validation:**
   Mobile numbers are stripped of non-digits and checked for 10–12 digits (validating formats like `03001234567` and `0321-1234567`).
2. **Server-Side Price Recalculation:**
   Prices submitted by the client cart are never trusted. The server looks up each product in `shop-products.json` and computes subtotals and shipping fees independently before saving orders.
3. **Preventing Overselling:**
   Stock is validated at the moment of order placement. If an item has insufficient stock, the checkout request is rejected with a descriptive error message indicating the available balance.
4. **Manual Payment Verification:**
   Bank transfers remain in `Pending Verification` status until workshop staff verify funds in Meezan Bank. The customer cannot self-mark an unpaid order as paid.

---

## 5. Audit Logging

Every administrative operation in the shop creates an immutable audit trail in `storage/audit-logs.json`:
- `SHOP_PRODUCT_CREATED`
- `SHOP_PRODUCT_UPDATED`
- `SHOP_PRODUCT_DELETED`
- `SHOP_ORDER_STATUS_UPDATED`
- `SHOP_ORDER_SHIPPING_UPDATED`
- `SHOP_ORDER_PAYMENT_VERIFIED`
- `SHOP_SETTINGS_UPDATED`
- `SHOP_SHIPPING_UPDATED`

Each log entry records: action, actor username, affected resource path, timestamp, and details.
