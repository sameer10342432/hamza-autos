# Hamza Autos — Supplier & Purchase Order Management Guide
**Location:** Workshop Operations Portal, Abu Bakar Road, Badami Bagh, Lahore  
**Architecture:** Database-Free JSON Storage (`storage/suppliers.json`, `storage/purchase-orders.json`, `storage/supplier-payments.json`)  
**Route:** `/admin/suppliers`, `/admin/purchase-orders`, `/admin/goods-receiving`, `/admin/supplier-payments`

---

## 1. Overview & Badami Bagh Parts Ecosystem
Hamza Autos is centrally located in Badami Bagh, Lahore — the premier motorcycle spare parts market of Pakistan. The **Supplier & Purchase Order System** manages vendor accounts (Atlas Honda dealers, Crown Lifan distributors, NGK/Havoline importers, local lathe workshops) and ensures accurate procurement, goods receiving, and payment tracking.

---

## 2. Supplier Directory (`/admin/suppliers`)
Stores vendor profiles in `storage/suppliers.json`:
- **Company & Contact Person Name:** (e.g. *Crown Lifan Auto Parts Badami Bagh - Haji Aslam*).
- **Phone Numbers & WhatsApp:** For quick quotation and order dispatching.
- **Physical Shop / Market Address:** (e.g. *Shop #14, Bilal Market, Badami Bagh, Lahore*).
- **Supplied Product Categories:** Engine parts, bearings, clutch plates, electrical items, lubricants.
- **Running Ledger Balance:** Live payable balance owed to the supplier.
- **Payment Terms:** Cash on Delivery (COD), 7-Day Net, 15-Day Net credit terms.

---

## 3. Purchase Order Workflow (`/admin/purchase-orders`)
1. **Creation:** Admin creates a Purchase Order with line items (Part Name, OEM Part Code, Quantity, Unit Purchase Cost).
2. **Status Progression:**
   $$\text{Draft} \longrightarrow \text{Ordered / Sent} \longrightarrow \text{Partially Received} \longrightarrow \text{Received (Full)} \longrightarrow \text{Closed}$$
3. **Printable PO:** Generates a professional purchase requisition slip with vendor address, line items, total value, and approval signatures.

---

## 4. Inbound Goods Receiving (`/admin/goods-receiving`)
To prevent inventory discrepancies and phantom stock:
> [!IMPORTANT]
> **Stock Safety Guarantee:**  
> When goods are received at the workshop, the system updates `receivedQuantity` against the PO and **atomically increments** `stockQuantity` in `storage/inventory.json`.  
> An internal `StockMovement` entry is logged with type `'RESTOCK'`. Duplicate addition is strictly prevented if the PO is subsequently viewed or modified.

---

## 5. Supplier Payments & Balance Settlement (`/admin/supplier-payments`)
- When cash or bank transfer is issued to a vendor:
  1. The payment is recorded in `storage/supplier-payments.json` against the target PO.
  2. The supplier's outstanding balance in `storage/suppliers.json` is reduced.
  3. A cash outflow is simultaneously appended to `storage/financial-transactions.json` for accurate net profit accounting.
