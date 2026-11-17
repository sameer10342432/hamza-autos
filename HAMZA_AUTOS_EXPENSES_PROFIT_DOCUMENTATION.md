# Hamza Autos — Expenses & Real Profit Accounting Documentation
**Location:** Workshop Operations Portal, Abu Bakar Road, Badami Bagh, Lahore  
**Architecture:** Database-Free File-Based JSON Storage (`storage/expenses*.json`, `storage/financial-*.json`)  
**Route:** `/admin/expenses`, `/admin/transactions`, `/admin/profit-reports`

---

## 1. Accounting Philosophy: Cash Realization Principle
Unlike rudimentary demo dashboards that treat unpaid invoice totals as "revenue", Hamza Autos uses strict **Cash Realization Accounting**:
> [!IMPORTANT]
> Unpaid customer invoices or outstanding receivables are **NEVER** counted as earned revenue.  
> Only funds physically received into workshop cash drawers or verified bank transfers (`amountPaid`) constitute Realized Gross Revenue.

---

## 2. Real Profit Formulas & Definitions
1. **Collected Revenue (Cash Inflow):**
   $$\text{Collected Revenue} = \sum \text{amountPaid across all paid and partial customer invoices}$$
2. **Accounts Receivable (Pending Inflows):**
   $$\text{Pending Collection} = \sum (\text{totalAmount} - \text{amountPaid})$$
3. **Direct Parts Cost (COGS):**
   $$\text{Direct Parts Cost} = \sum \text{Purchase cost of inventory parts utilized in completed repair jobs}$$
4. **Operating Expenses (Overhead):**
   $$\text{Operating Expenses} = \sum \text{Operating expense vouchers (Rent, Utilities, Mechanic Wages, Consumables, Tools)}$$
5. **Real Gross Profit:**
   $$\text{Gross Profit} = \text{Collected Revenue} - \text{Direct Parts Cost}$$
6. **Real Net Profit:**
   $$\text{Net Profit} = \text{Collected Revenue} - (\text{Direct Parts Cost} + \text{Operating Expenses})$$

---

## 3. Expense Voucher Management
Expense vouchers are registered at `/admin/expenses` and stored in `storage/expenses.json`:
- **Voucher Number:** Unique sequence (e.g. `EXP-2026-001`).
- **Standardized Categories:**
  - *Workshop Rent & Property Taxes*
  - *Electricity & Generator Fuel (LESCO & Diesel)*
  - *Staff & Mechanic Daily Wages*
  - *Shop Tools, Equipment & Maintenance*
  - *Workshop Consumables (Cotton rags, Carb spray, Degreasers, Kerosene)*
  - *Refreshments & Office Tea*
  - *Marketing & Local Printing*
- **Payment Modes:** Cash, Bank Transfer (Meezan / HBL / UBL), JazzCash, EasyPaisa.
- **Audit Requirement:** Name of receiver / vendor and internal approval signature.

---

## 4. Unified Financial Transactions Ledger
Accessible at `/admin/transactions`:
- Merges both **Customer Inflows** (Invoice cash receipts) and **Cash Outflows** (Expenses and Supplier payments) into a single chronological ledger.
- Filterable by Inflow / Outflow, Payment Method, and Date Range.
- Guarantees transparency for daily workshop reconciliation at close of business (6:00 PM PKT).

---

## 5. API Reference
- `GET /api/expenses`: Retrieve all recorded expense vouchers.
- `POST /api/expenses`: Record a new expense voucher.
- `PUT /api/expenses/:id`: Update an expense voucher.
- `DELETE /api/expenses/:id`: Delete or void an expense voucher.
- `GET /api/expenses/categories`: Fetch expense category directory.
- `GET /api/financial/transactions`: Retrieve unified transaction ledger.
- `GET /api/financial/profit-summary`: Calculate real-time gross and net profit summary using actual stored records.
