# Hamza Autos – IndexedDB Database Specification & Schema Reference
**Database Name:** `hamza_autos_db`  
**Database Version:** `1`  
**Storage Architecture:** W3C Client-Side IndexedDB  
**Object Store Count:** 16 Stores  
**Location:** Abu Bakar Road, Badami Bagh, Lahore (+92 325 1814548)

---

## 1. Database Overview

The Hamza Autos Workshop Management System uses browser IndexedDB (`hamza_autos_db`) as its local system of record. All 16 object stores are initialized within an atomic `onupgradeneeded` handler in `src/services/storageService.ts`.

---

## 2. Comprehensive Store Specifications

### 1. `customers`
Stores customer CRM data, contact coordinates, and lifetime workshop statistics.
- **KeyPath:** `id` (string, e.g. `cust-1`)
- **Indexes:**
  - `phoneNumber` (unique: false)
  - `name` (unique: false)
  - `createdAt` (unique: false)
- **Schema:**
  ```typescript
  interface CustomerProfile {
    id: string;
    name: string;
    phoneNumber: string;       // Pakistani mobile: 03XX XXXXXXX
    area: string;              // Badami Bagh, Shadbagh, Misri Shah, etc.
    totalVisits: number;
    totalSpent: number;        // PKR
    registeredBikes: string[]; // Motorcycle IDs
    lastVisitDate: string;     // ISO format YYYY-MM-DD
    notes?: string;
    createdAt: string;
  }
  ```

---

### 2. `motorcycles`
Maintains records of individual motorcycles owned by customers.
- **KeyPath:** `id` (string, e.g. `bike-1`)
- **Indexes:**
  - `customerId` (unique: false)
  - `registrationNumber` (unique: false)
  - `brand` (unique: false)
- **Schema:**
  ```typescript
  interface MotorcycleProfile {
    id: string;
    customerId: string;
    brand: 'Honda' | 'Yamaha' | 'Suzuki' | 'United' | 'Road Prince' | string;
    model: string;             // CD 70, CG 125, YBR 125, GS 150, etc.
    year: number;              // 2018 - 2026
    registrationNumber: string;// e.g. LEN-23-4412
    engineCc: number;          // 70, 100, 110, 125, 150
    currentMileage: number;    // Kilometres
    fuelType: 'Petrol';
    notes?: string;
  }
  ```

---

### 3. `bookings`
Stores appointment bookings submitted online through the multi-step booking modal.
- **KeyPath:** `id` (string, e.g. `bk-1`)
- **Indexes:**
  - `bookingNumber` (unique: true, format `HA-BK-YYYY-XXX`)
  - `customerPhone` (unique: false)
  - `appointmentDate` (unique: false)
  - `status` (unique: false)
- **Schema:**
  ```typescript
  interface AppointmentBooking {
    id: string;
    bookingNumber: string;
    customerId?: string;
    customerName: string;
    phoneNumber: string;
    area: string;
    bikeBrand: string;
    bikeModel: string;
    registrationNumber?: string;
    serviceRequested: string;
    problemDescription: string;
    appointmentDate: string;   // YYYY-MM-DD
    appointmentTime: string;   // e.g. 10:30 AM
    status: 'New Request' | 'Pending Confirmation' | 'Confirmed' | 'Rescheduled' | 'Checked In' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rejected';
    estimatedCost?: number;
    createdAt: string;
  }
  ```

---

### 4. `jobCards`
Represents the core workshop bay repair job lifecycle from reception to delivery.
- **KeyPath:** `id` (string, e.g. `jc-1`)
- **Indexes:**
  - `jobCardNumber` (unique: true, format `HA-JC-YYYY-XXX`)
  - `customerPhone` (unique: false)
  - `repairStatus` (unique: false)
  - `assignedMechanic` (unique: false)
- **Schema:**
  ```typescript
  interface JobCard {
    id: string;
    jobCardNumber: string;
    customerId?: string;
    customerName: string;
    phoneNumber: string;
    area: string;
    bikeBrand: string;
    bikeModel: string;
    registrationNumber?: string;
    meterReading?: number;
    fuelLevel?: 'Empty' | '1/4' | '1/2' | '3/4' | 'Full';
    problemReported: string;
    diagnosisNotes?: string;
    assignedMechanic?: string;
    receivedDate: string;
    estimatedCompletionDate: string;
    completedDate?: string;
    repairStatus: 'Received' | 'Diagnosis' | 'Parts Waiting' | 'Work In Progress' | 'Testing & Quality Check' | 'Ready for Delivery' | 'Delivered' | 'Cancelled' | 'Invoiced' | 'Closed';
    items: Array<{
      type: 'Labour' | 'Part';
      partId?: string;
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    labourCharges: number;
    partsCost: number;
    estimatedCost: number;
    notes?: string;
    createdAt: string;
  }
  ```

---

### 5. `inspections`
Logs 16-point mechanical & electrical safety audits for motorcycles.
- **KeyPath:** `id` (string, e.g. `insp-1`)
- **Indexes:**
  - `inspectionNumber` (unique: true, format `HA-INSP-YYYY-XXX`)
  - `customerPhone` (unique: false)
  - `overallCondition` (unique: false)
- **Checklist Points:** 16 standard components:
  1. Engine Condition & Compression
  2. Engine Oil Level & Viscosity
  3. Front & Rear Brake Shoes / Pads
  4. Front Tyre Tread Depth & Pressure
  5. Rear Tyre Tread Depth & Pressure
  6. Battery Voltage & Terminal Health
  7. Headlight & High/Low Beam Focus
  8. Turn Indicators & Hazard Warning
  9. Main Wiring Harness & CDI Ignition
  10. Drive Chain Tension & Sprocket Teeth
  11. Clutch Cable Freeplay & Friction Plates
  12. Front Telescopic & Rear Shock Absorbers
  13. Steering Cone Bearings & Handle Alignment
  14. Electric Horn & Handlebar Switchgear
  15. Fuel Line, Petcock & Carburetor / EFI
  16. Chassis Frame, Nuts, Bolts & Roadworthiness
- **Component Statuses:** `Good`, `Needs Attention`, `Requires Repair`, `Not Inspected`, `N/A`

---

### 6. `quotations`
Pre-service estimates with itemized parts & labour breakdown.
- **KeyPath:** `id` (string, e.g. `qt-1`)
- **Indexes:**
  - `quotationNumber` (unique: true, format `HA-QT-YYYY-XXX`)
  - `customerPhone` (unique: false)
  - `status` (unique: false)
- **Status Lifecycle:** `Draft` -> `Sent` -> `Approved` -> `Rejected` -> `Invoiced`

---

### 7. `invoices`
Official workshop bills and receipts.
- **KeyPath:** `id` (string, e.g. `inv-1`)
- **Indexes:**
  - `invoiceNumber` (unique: true, format `HA-INV-YYYY-XXX`)
  - `customerPhone` (unique: false)
  - `paymentStatus` (unique: false)
  - `jobCardId` (unique: false)
- **Payment Statuses:** `Unpaid`, `Partial`, `Paid`

---

### 8. `payments`
Detailed financial transaction logs for payments against invoices.
- **KeyPath:** `id` (string, e.g. `pay-1`)
- **Indexes:**
  - `invoiceNumber` (unique: false)
  - `customerId` (unique: false)
  - `paymentDate` (unique: false)
  - `paymentMethod` (unique: false: `Cash` | `Bank Transfer` | `Easypaisa` | `JazzCash`)

---

### 9. `inventory`
Catalog of authentic spare parts and workshop supplies.
- **KeyPath:** `id` (string, e.g. `part-1`)
- **Indexes:**
  - `partNumber` (unique: true)
  - `category` (unique: false)
  - `bikeModel` (unique: false)
  - `stockQuantity` (unique: false)
- **11 Categories:** Engine Parts, Oils & Lubricants, Brake System, Tyres & Tubes, Electrical & Battery, Chain & Sprockets, Clutch System, Suspension, Body & Chassis, Filters, Cables & Hardware.

---

### 10. `inventoryMovements`
Immutable audit log recording every inventory adjustment, job card deduction, or restock.
- **KeyPath:** `id` (string, e.g. `mov-1`)
- **Indexes:**
  - `partId` (unique: false)
  - `type` (unique: false: `initial` | `restock` | `job_usage` | `adjustment` | `cancellation_return`)
  - `referenceId` (unique: false)
  - `timestamp` (unique: false)

---

### 11. `maintenanceReminders`
Tracks preventative service intervals for customer motorcycles.
- **KeyPath:** `id` (string, e.g. `rem-1`)
- **Indexes:**
  - `customerPhone` (unique: false)
  - `dueDate` (unique: false)
  - `status` (unique: false: `Upcoming` | `Due Today` | `Overdue` | `Completed` | `Dismissed`)
  - `reminderType` (unique: false)
- **10 Types:** Oil Change, Engine Tuning, Brake Inspection, Chain Slack & Lubrication, Valve Clearance, Battery Check, Tyre Replacement, Air Filter Cleaning, Spark Plug Replacement, General Overhaul.

---

### 12. `feedback`
Customer reviews submitted through the Customer Portal.
- **KeyPath:** `id` (string, e.g. `fb-1`)
- **Indexes:**
  - `status` (unique: false: `Pending` | `Approved` | `Rejected` | `Hidden`)
  - `overallRating` (unique: false: 1 to 5)
  - `submittedAt` (unique: false)
  - `isFeatured` (unique: false)

---

### 13. `notifications`
Internal workshop alerts for low stock, overdue reminders, and new bookings.
- **KeyPath:** `id` (string, e.g. `notif-1`)
- **Indexes:**
  - `type` (unique: false)
  - `isRead` (unique: false)
  - `createdAt` (unique: false)

---

### 14. `whatsappTemplates`
Customizable message blueprints with placeholders for click-to-chat links.
- **KeyPath:** `id` (string, e.g. `bookingConfirmation`)
- **7 Templates:**
  1. `bookingConfirmation`
  2. `jobCardUpdate`
  3. `inspectionReady`
  4. `quotationSent`
  5. `readyForCollection`
  6. `invoiceReceipt`
  7. `maintenanceReminder`

---

### 15. `applicationSettings`
Workshop business information, opening hours, Google Maps coordinates, and SEO metadata.
- **KeyPath:** `id` (string: `'global_settings'`)

---

### 16. `auditLogs`
Internal system audit log for data modifications and restores.
- **KeyPath:** `id` (string, e.g. `audit-1`)
- **Indexes:**
  - `action` (unique: false)
  - `performedBy` (unique: false)
  - `timestamp` (unique: false)
