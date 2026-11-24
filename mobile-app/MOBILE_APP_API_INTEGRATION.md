# Hamza Autos - Mobile API Integration & Admin Panel Synchronization

## 1. Architecture & Design Principles
The Hamza Autos mobile application connects directly to the existing Express REST backend (`server/app.ts`, `server/routes.ts`), utilizing the server's atomic file-based JSON storage engine (`server/fileStore.ts`). 

**Core Architectural Rule**: The website Admin Panel remains the single central source of truth for all business operations. When an admin updates records on the website, those changes immediately reflect in the mobile app, and when a mobile user places an order or books a service, it appears instantly in the website Admin Panel.

---

## 2. API Environment Configuration (`mobile-app/config/api.ts`)

| Platform / Runtime | API Base Address | Description |
|---|---|---|
| **Android Emulator** | `http://10.0.2.2:3000` | Android emulator loopback alias to host development machine. |
| **iOS Simulator** | `http://localhost:3000` | Native macOS localhost host network. |
| **Physical Phone (LAN)** | `http://192.168.100.1:3000` | Configurable computer Wi-Fi / Ethernet LAN IP for testing on physical devices. |
| **Production Server** | `https://api.hamzaautos.com` | Clearly documented placeholder to be populated when live hosting is provisioned. |

---

## 3. Verified Two-Way Workflows

The following table documents the exact integration flow between the website Admin Panel and the mobile application, verified via automated integration tests (`mobile-app/scripts/test-api-integration.mjs`):

| # | Action / Event | Initiator | Backend Operation | Synchronization Result |
|---|---|---|---|---|
| **1** | Admin adds spare part | Website Admin (`InventoryTab.tsx`) | Writes to `storage/inventory.json` | Part immediately appears on mobile Shop screen via `GET /api/inventory`. |
| **2** | Admin updates part price | Website Admin (`InventoryTab.tsx`) | Updates `sellingPrice` / `discountedPrice` in `storage/inventory.json` | Updated price in PKR appears instantly on mobile Product Cards and Cart. |
| **3** | Admin adjusts inventory stock | Website Admin (`InventoryTab.tsx`) | Updates `stockQuantity` in `storage/inventory.json` | Stock badge updates (`In Stock`, `Low Stock`, `Out of Stock`) in mobile app. |
| **4** | Customer places order | Mobile User (`app/checkout.tsx`) | `POST /api/orders` | 1. Order saved to `storage/orders.json`.<br>2. Stock automatically deducted in `storage/inventory.json`.<br>3. Inquiry created in `storage/inquiries.json` (Website Admin Central Inbox).<br>4. Notification added to `storage/notifications.json`. |
| **5** | Admin updates order status | Website Admin (`CentralInquiryInbox.tsx`) | Updates status (`Confirmed`, `Dispatched`, `Delivered`) | Customer tracks updated status and courier consignment number on mobile screen. |
| **6** | Customer books workshop service | Mobile User (`app/repair-booking.tsx`) | `POST /api/bookings` | 1. Booking recorded in `storage/booking-submissions.json`.<br>2. Forwarded to `storage/inquiries.json`.<br>3. Booking reference e.g. `HA-BK-2026-808` generated. |
| **7** | Customer tracks repair | Mobile User (`app/repair-tracking.tsx`) | `GET /api/repairs/track` | 2-factor verification verifies Job Card Number + Customer Phone; returns 10-stage repair progress. |

---

## 4. API Endpoints Specification

### 4.1 Spare Parts Catalog
* **`GET /api/inventory`**
  * **Description**: Returns all active spare parts from `storage/inventory.json`.
  * **Query Parameters**:
    * `category`: Filter by category (e.g. `Engine Parts`, `Brake Parts`).
    * `brand`: Filter by motorcycle brand (e.g. `Honda`, `Yamaha`).
    * `search`: Keyword search across part name, SKU, and description.
  * **Response (200 OK)**:
    ```json
    {
      "success": true,
      "count": 15,
      "inventory": [
        {
          "id": "sp-1",
          "partNumber": "SP-ENG-001",
          "partName": "Piston Kit Complete 0.25 (70cc OHC)",
          "category": "Engine Parts",
          "compatibleBrands": ["Honda", "United", "Road Prince"],
          "compatibleModels": ["CD 70", "US 70", "Passion 70"],
          "sellingPrice": 1800,
          "discountedPrice": 1650,
          "stockQuantity": 14,
          "minStockAlert": 5
        }
      ]
    }
    ```

### 4.2 Online Order Submission
* **`POST /api/orders`**
  * **Description**: Submits customer order, deducts stock, alerts admin, and syncs CRM.
  * **Request Payload**:
    ```json
    {
      "customer": {
        "fullName": "Muhammad Usman",
        "phoneNumber": "0300 1234567",
        "whatsappNumber": "0300 1234567",
        "province": "Punjab",
        "city": "Lahore",
        "streetAddress": "House 14, Shadbagh"
      },
      "items": [
        {
          "partId": "sp-1",
          "sku": "SP-ENG-001",
          "name": "Piston Kit Complete 0.25 (70cc OHC)",
          "unitPrice": 1650,
          "quantity": 1,
          "totalPrice": 1650
        }
      ],
      "subtotal": 1650,
      "shippingFee": 150,
      "totalAmount": 1800,
      "paymentMethod": "Cash on Delivery (COD)"
    }
    ```
  * **Response (200 OK)**:
    ```json
    {
      "success": true,
      "orderNumber": "HA-ORD-2026-847",
      "message": "Order registered successfully with Hamza Autos! Dispatch team will confirm shipment on WhatsApp."
    }
    ```

### 4.3 Order Tracking
* **`GET /api/orders/track?orderNumber=HA-ORD-2026-847&phone=03001234567`**
  * **Description**: Returns live delivery status and courier consignment number.
  * **Security**: Phone number verification required.

### 4.4 Workshop Service Booking
* **`POST /api/bookings`**
  * **Description**: Creates workshop appointment at Badami Bagh, Lahore.
  * **Request Payload**:
    ```json
    {
      "customerName": "Kashif Ali",
      "phoneNumber": "0321 7766554",
      "bikeBrand": "Yamaha",
      "bikeModel": "YBR 125",
      "registrationNumber": "LEA-22-1982",
      "serviceRequested": "Motorcycle Brake Repair & Shoe/Pad Replacement",
      "problemDescription": "Front hydraulic disc brake lever has lost pressure.",
      "appointmentDate": "2026-11-28",
      "appointmentTime": "11:30 AM"
    }
    ```
  * **Response (200 OK)**:
    ```json
    {
      "success": true,
      "bookingNumber": "HA-BK-2026-808",
      "booking": { ... }
    }
    ```

### 4.5 2-Factor Repair Tracking
* **`GET /api/repairs/track?jobCard=HA-BK-2026-808&phone=03217766554`**
  * **Description**: Returns 10-stage repair progress timeline, assigned mechanic, and health report.
  * **Security**: Returns `403 Forbidden` if phone does not match booking record.
