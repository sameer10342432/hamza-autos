# Hamza Autos - End-to-End Workflow Test Report

**Date**: November 24, 2026  
**Auditor**: QA Automation Engineer & Backend Integration Specialist  
**Test Suite**: `mobile-app/scripts/test-api-integration.mjs`  
**Total Tests Executed**: 23  
**Passed**: 23 | **Failed**: 0 | **Blocked**: 0  

---

## 1. WORKFLOW A – Spare Parts Shopping & Order Placement

```mermaid
sequenceDiagram
  autonumber
  actor Customer as Mobile App Customer
  participant App as Mobile App (Cart/Checkout)
  participant API as Express API (/api/orders)
  participant Store as Storage (orders.json & inventory.json)
  participant Admin as Website Admin Inbox (inquiries.json)

  Customer->>App: Browse Shop, Add Part to Cart
  Customer->>App: Proceed to Checkout (Enter Name, Phone, Address)
  Customer->>App: Tap "Place Order (COD)"
  App->>API: POST /api/orders (Customer details, Items, Subtotal, Shipping)
  API->>Store: Deduct Stock in inventory.json
  API->>Store: Append Order to orders.json (HA-ORD-2026-xxx)
  API->>Admin: Create Central Inquiry in inquiries.json
  API-->>App: 200 OK (orderNumber, status: "New")
  App->>Customer: Display Order Confirmation & Courier Tracking Details
```

### Verified Test Evidence:
1. `POST /api/orders` created order `HA-ORD-2026-998`.
2. Initial stock of 12 units automatically decremented to 10 units in `storage/inventory.json`.
3. Order immediately registered in `storage/inquiries.json` under type `"Online Spare Part Order"` for the website Admin Panel Central Inbox.
4. Notification created in `storage/notifications.json`.
5. Order tracking lookup via `GET /api/orders/track` retrieved the created record.
- **Status**: **PASS**

---

## 2. WORKFLOW B – Workshop Repair Booking (Badami Bagh, Lahore)

```mermaid
sequenceDiagram
  autonumber
  actor Rider as Lahore Motorcycle Rider
  participant App as Mobile App (repair-booking)
  participant API as Express API (/api/bookings)
  participant Store as Storage (booking-submissions.json)
  participant Admin as Website Admin Dashboard

  Rider->>App: Select Repair (Brake Repair & Shoe Replacement)
  Rider->>App: Select Bike (Yamaha YBR 125, Reg: LEA-22-1982)
  Rider->>App: Select Date & Time (11:30 AM)
  Rider->>App: Tap "Confirm Workshop Booking"
  App->>API: POST /api/bookings (Payload)
  API->>Store: Append to booking-submissions.json (HA-BK-2026-xxx)
  API->>Admin: Register notification & inquiry
  API-->>App: 200 OK (bookingNumber: HA-BK-2026-605)
  App->>Rider: Display Booking Reference & Badami Bagh Bay Reservation
```

### Verified Test Evidence:
1. `POST /api/bookings` generated booking reference `HA-BK-2026-605`.
2. Verified record written directly to `storage/booking-submissions.json`.
3. Booking visible for website Admin Panel review.
- **Status**: **PASS**

---

## 3. WORKFLOW C – Central Backend & Admin Panel Synchronization

1. **Admin Adds Product**: `POST /api/inventory` added part `TEST-QA-...`. Immediately visible on mobile app `GET /api/inventory`.
2. **Admin Updates Price & Stock**: `PUT /api/inventory/:id` updated price to PKR 420 and stock to 12. Changes reflected immediately in mobile catalog.
3. **Admin Updates Order Status**: Live status queries return latest state from `storage/orders.json`.
- **Status**: **PASS**
