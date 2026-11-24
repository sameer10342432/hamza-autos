# Hamza Autos Mobile Application Features Report

**Version**: 1.0.0  
**Build Target**: React Native / Expo / TypeScript  
**Audience**: Lahore Riders, Workshop Clients & Nationwide Spare Parts Buyers  

---

## 1. Feature Breakdown by Module

### 1.1 Home Screen Experience
* **Automotive Brand Identity**:
  * Precision 12-tooth sprocket and dynamic H monogram header.
  * Real-time workshop status indicator.
  * Welcome greeting with customized customer name.
* **Hero Showcase Banner**:
  * High-resolution workshop hero photography.
  * Badami Bagh, Lahore location tag.
  * Direct action buttons: "Book Service" and "Shop Parts".
* **Quick Navigation Action Cards**:
  * Track Active Repair (direct link to job card timeline).
  * Book Workshop Repair (appointment reservation).
  * My Garage (active vehicle odometer & reminders).
  * Track Order (consignment tracking).
* **Active Motorcycle Card**:
  * Displays currently selected motorcycle, registration number, and mileage.
  * Next maintenance alert preview (e.g. "Engine Oil Change Due").
* **Motorcycle Compatibility Finder**:
  * Interactive 3-step selector (Brand -> Model -> Verified Parts).
* **Motorcycle Brands Showcase**:
  * Horizontal carousel covering Honda, Yamaha, Suzuki, United, Road Prince, Super Power, and Chinese motorcycles.
* **Featured Spare Parts & Workshop Services Carousel**:
  * Dynamic pricing in PKR with stock availability badges.
* **Pakistan-Wide Delivery & WhatsApp Support**:
  * Courier guarantees (TCS, Leopards, M&P).
  * One-tap WhatsApp hotline to chat with Badami Bagh master mechanics.

---

### 1.2 Online Spare Parts Shop
* **15+ Motorcycle Categories**:
  * Engine Parts, Clutch Parts, Brake Parts, Electrical Parts, Carburettor & Fuel System, Chain & Sprocket, Tyres & Tubes, Filters, Cables & Controls, Lights & Indicators, Batteries, Oils & Lubricants, Bike Accessories, Other Spare Parts.
* **Multi-Parameter Filtering**:
  * Search by part name, SKU, or description.
  * Filter by motorcycle brand (Honda, Yamaha, Suzuki, United, Road Prince, Super Power, Chinese).
  * Filter by spare part category.
* **Product Card & Listing**:
  * Product photo with automotive placeholder fallbacks.
  * Name, SKU, category badge, compatibility summary.
  * Price in PKR with strike-through discounted price.
  * Real-time stock status badge (`In Stock`, `Low Stock: Only X left`, `Out of Stock`).
  * Instant Add to Cart button with animated confirmation.

---

### 1.3 Product Details (`/product/[id]`)
* **High-Resolution Photo Gallery**: Main hero image with stock availability badge.
* **Specifications Table**: SKU, Category, Current inventory level, Last restocked date.
* **Guaranteed Bike Compatibility Matrix**: Displays verified brands and models.
* **Comprehensive Description**: Technical specs, materials, and tuning notes.
* **Interactive Quantity Selector**: Respects available stock ceiling.
* **Action CTAs**:
  * Add to Cart (persistent across sessions).
  * Buy Now (adds to cart and navigates directly to checkout).
  * Enquire on WhatsApp (pre-fills message with exact part name, SKU, and price).

---

### 1.4 Shopping Cart & Pakistan Delivery Calculator (`/cart`)
* **Persistent Cart**: Powered by `@react-native-async-storage/async-storage`.
* **Item Controls**: Increase quantity, decrease quantity, remove item, clear cart.
* **Destination Selector**:
  * Covers all 7 administrative units of Pakistan (Punjab, Sindh, KPK, Balochistan, Islamabad, GB, AJK).
  * Major city chips with dynamic shipping fee calculation (Lahore: PKR 150; Punjab/Islamabad: PKR 250; Sindh/KPK: PKR 350; Balochistan/GB/AJK: PKR 400-450).
* **Price Breakdown**: Subtotal, Courier Shipping, Net Total in PKR.

---

### 1.5 Checkout & Order Placement (`/checkout`)
* **Guest & Registered Checkout**: No account barrier required.
* **Customer Fields**: Full Name, Mobile Phone (11-digit Pakistani format), WhatsApp Number, Email (optional).
* **Delivery Fields**: Province, City, Detailed street/house address, Postal code, Delivery notes.
* **Payment Methods**:
  * Cash on Delivery (COD) available nationwide.
  * Bank Transfer / Manual Payment (displays verified Hamza Autos Meezan/Allied bank details).
* **Order Guard**: Prevents duplicate submissions and verifies stock availability.
* **Automatic Central Synchronization**: Submits order directly to `storage/orders.json`, registers inquiry in `storage/inquiries.json` (for website Admin Panel), and notifies the admin.

---

### 1.6 Order Tracking (`/order-tracking`)
* **Tracking Input**: Order Number (e.g. `HA-ORD-2026-101`) + Phone Number verification.
* **Visual Multi-Stage Timeline**:
  1. Order Registered
  2. Order Verified by Badami Bagh Team
  3. Parts Packed & Quality Checked
  4. Handed to Courier for Delivery
  5. Delivered to Doorstep
* **Courier Information**: Provider (TCS / Leopards / M&P), Consignment number, Origin.
* **Package Contents**: List of ordered parts, quantities, and price breakdown.

---

### 1.7 Workshop Services & Booking (`/services` & `/repair-booking`)
* **11 Workshop Services**:
  * Motorcycle Engine Repair & Overhaul, Bike Tuning & Fuel Economy, Motorcycle Oil Change, General Bike Repair, Electrical System & Self-Starter Repair, Brake Repair & Shoe/Pad Replacement, Clutch Repair & Friction Plates, Tyre & Puncture Service, Spare Parts Fitting, Bike Modification & Restoration, Custom Workshop Jobs.
* **Service Detail View (`/service/[slug]`)**:
  * Turnaround time, estimated labour cost in PKR, key features, symptoms list, workshop procedure steps, supported motorcycle models.
* **Native Booking Form (`/repair-booking`)**:
  * Customer Name, Phone Number, Motorcycle Brand & Model, Registration Number.
  * Service requested, Problem description, Additional notes.
  * Date Picker: Next 7 days carousel.
  * Time Slot Picker: 11 business-hour time slots (`09:30 AM` to `08:30 PM`).
  * Unique Reference Generation: `HA-BK-2026-XXX`.
  * Physical workshop notice: Exclusively for Badami Bagh, Lahore workshop.

---

### 1.8 Repair Tracking & Job Cards (`/repair-tracking`)
* **2-Factor Security Verification**: Customer must enter both Job Card Number AND registered phone number.
* **10-Stage Repair Timeline**:
  1. Booking Requested
  2. Booking Confirmed
  3. Bike Received
  4. Inspection in Progress
  5. Quotation Prepared
  6. Customer Approval Pending
  7. Repair in Progress
  8. Quality Inspection
  9. Ready for Collection
  10. Completed
* **Job Card Details**: Assigned master mechanic, customer complaint, required services, estimated cost.
* **Bike Health Summary**: Component status pills (`Excellent`, `Good`, `Needs Attention`, `Critical`).

---

### 1.9 My Garage & Maintenance Reminders (`/my-garage`)
* **Multiple Motorcycle Storage**: Save multiple commuter and sports bikes.
* **Vehicle Specs**: Make, Model, Registration plate, Year, Nickname, Odometer reading.
* **Active Bike Switcher**: 1-tap switcher for primary vehicle.
* **Maintenance Reminders**:
  * Engine Oil Change, Bike Tuning, Brake Inspection, Chain Lubrication, Tyre Inspection, General Service.
  * Checkbox toggle, due dates, and mileage triggers.

---

### 1.10 Customer Profile & Support (`/profile` & `/support`)
* **Profile Management**: Phone authentication, saved delivery addresses.
* **In-App Notifications (`/notifications`)**: Real-time alerts for bookings, orders, and maintenance.
* **Customer Support Desk (`/support`)**: Direct phone call, WhatsApp chat, Badami Bagh workshop address, Google Maps routing, and FAQs.
