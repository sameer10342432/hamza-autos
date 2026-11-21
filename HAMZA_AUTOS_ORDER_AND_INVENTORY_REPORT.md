# HAMZA AUTOS – ORDER MANAGEMENT & INVENTORY CONTROL REPORT

**Author:** Antigravity Full-Stack Engineering Team  
**Scope:** Order Processing Workflow, Stock Deductions, Restorations & Movement Ledger  
**Storage Reference:** `storage/shop-orders.json`, `storage/shop-inventory-movements.json`  
**Date:** November 2026  

---

## 1. Order Processing Lifecycle

The Hamza Autos shop order fulfillment workflow guarantees transaction integrity without database overhead.

```
[Customer Places Order (Guest Checkout)]
                 │
                 ▼
          (Status: New Order)
          (Stock: Unadjusted)
                 │
                 ▼
      [Admin Verifies Payment / Call]
                 │
                 ├───────────────────────────────┐
                 ▼                               ▼
       [Admin: Confirms Order]         [Admin: Cancels Order]
      (Status: Confirmed / Processing)   (Status: Cancelled)
   - Stock deducted atomically in JSON   - Order closed
   - ORDER_CONFIRMED movement logged     - No stock impact
                 │
                 ▼
       [Admin: Packed & Dispatched]
         - Adds Courier Tracking
         - Status: Dispatched
                 │
                 ▼
           [In Transit]
         - Status: Shipped
                 │
                 ├───────────────────────────────┐
                 ▼                               ▼
     [Customer Receives Parcel]          [Parcel Returned / Refused]
        (Status: Delivered)                  (Status: Returned)
   - If COD, payment marked Received   - Stock restored atomically in JSON
   - Order Complete                    - ORDER_RETURNED movement logged
```

---

## 2. Order Schema & Unique Numbering

Orders are recorded in `storage/shop-orders.json`. Each order receives a human-readable, sequentially tracked order number formatted as `HA-SHOP-YYYY-XXXX` (e.g. `HA-SHOP-2026-1001`).

### Order Data Structure:
```typescript
export interface ShopOrder {
  id: string;                    // e.g. "ord-202611-1001"
  orderNumber: string;           // e.g. "HA-SHOP-2026-1001"
  customer: {
    fullName: string;
    mobileNumber: string;
    whatsappNumber: string;
    email?: string;
    deliveryAddress: string;
    city: string;
    province: string;
    postalCode?: string;
    orderNotes?: string;
  };
  items: Array<{
    productId: string;
    sku: string;
    name: string;
    slug: string;
    image: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }>;
  pricing: {
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
  };
  paymentMethod: 'Cash on Delivery (COD)' | 'Bank Transfer / Manual Payment';
  paymentStatus: 'Unpaid' | 'Pending Verification' | 'Payment Received' | 'Refunded';
  paymentReference?: string;     // Transaction ID from Meezan Bank / Jazzcash
  paymentProofUrl?: string;
  shipping: {
    courier: string;             // e.g. "TCS Courier", "Leopards Courier", "Hamza Autos Express"
    trackingNumber?: string;     // e.g. "TCS-99112233"
    trackingUrl?: string;
    estimatedDeliveryDays?: string;
    dispatchedAt?: string;
    deliveredAt?: string;
  };
  orderStatus: OrderStatus;
  stockAdjusted: boolean;        // Prevents double deduction or multiple restores
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    updatedBy: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

---

## 3. Atomic Stock Deduction & Movement Audit

### Deduction Trigger:
When an administrator confirms an order via `PUT /api/shop/admin/shop/orders/:id/status` (or advances it to `Processing` or `Dispatched`), the backend:
1. Inspects `order.stockAdjusted`. If `false`, it proceeds.
2. Reads `storage/shop-products.json` and decrements each product's `stockQuantity` by the ordered quantity.
3. Dynamically re-evaluates `availabilityStatus` (`In Stock`, `Low Stock`, or `Out of Stock`).
4. Prepends an audit record to `storage/shop-inventory-movements.json`:
   ```json
   {
     "id": "mov-1732219500-abcd",
     "productId": "sp-eng-001",
     "sku": "HA-ENG-70-001",
     "productName": "Crown Lifan Complete Cylinder Block & Piston Kit – 70cc",
     "changeType": "ORDER_CONFIRMED",
     "previousQuantity": 18,
     "changeAmount": -2,
     "newQuantity": 16,
     "reason": "Order HA-SHOP-2026-1002 confirmed",
     "orderId": "ord-1002",
     "orderNumber": "HA-SHOP-2026-1002",
     "performedBy": "admin",
     "timestamp": "2026-11-22T02:25:28+05:00"
   }
   ```
5. Sets `order.stockAdjusted = true` and writes all changes to disk atomically using `writeJsonFileAtomic()`.

### Restoration Trigger:
If a confirmed order is later marked `Cancelled` or `Returned`:
1. The backend verifies `order.stockAdjusted === true`.
2. Restores the exact item quantities to `storage/shop-products.json`.
3. Creates a reversal audit record in `storage/shop-inventory-movements.json` (`changeType: 'ORDER_CANCELLED'` or `'ORDER_RETURNED'`).
4. Resets `order.stockAdjusted = false`.

This guarantees that physical inventory counts remain accurate across all order states.
