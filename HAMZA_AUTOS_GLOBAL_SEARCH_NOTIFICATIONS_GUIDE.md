# Hamza Autos — Global Search & Smart Notifications System Guide
**Location:** Workshop Operations Portal, Abu Bakar Road, Badami Bagh, Lahore  
**Architecture:** Multi-Store JSON Indexing & Notification Center  
**Route:** `/admin/search` and `/admin/notifications`  
**Keyboard Shortcut:** `Ctrl+K` (or `Cmd+K` on macOS)

---

## 1. Top-Bar Global Search (`Ctrl+K`)
Global Search provides instant, zero-latency universal lookup across the workshop's entire operational records:
- **Scope of Index:**
  1. *Customer Directory (`storage/customers.json`)*: Matches Name, Phone, WhatsApp, Address, Bike Model, Registration.
  2. *CRM Leads (`storage/crm-leads.json`)*: Matches Customer Name, Phone, Interested Service, Vehicle.
  3. *Inquiries & Bookings (`storage/inquiries.json`, `storage/booking-submissions.json`)*: Matches Booking Number, Customer Name, Phone, Problem Description.
  4. *Mechanics Roster (`storage/mechanics.json`)*: Matches Full Name, Phone, Technical Specializations.
  5. *Suppliers (`storage/suppliers.json`)*: Matches Supplier Name, Contact Person, Phone, Supplied Brands.
  6. *Purchase Orders (`storage/purchase-orders.json`)*: Matches PO Number, Supplier Name, Parts Listed.
  7. *Expenses (`storage/expenses.json`)*: Matches Expense Title, Category, Description, Paid-To Vendor.
  8. *Blog Content (`storage/blogs.json`)*: Matches Article Title, Slug, Excerpt.

### Direct Navigation Jump
Selecting any result from the dropdown navigates directly to the target record's administrative tab and opens the relevant management card or edit modal.

---

## 2. Smart Notifications Center
The notifications center aggregates live system alerts into a central inbox:
- **Low Stock Alerts:** Automatically triggers when inventory levels drop below `minStockAlert`.
- **Overdue Follow-ups:** Highlights CRM leads with scheduled follow-up dates in the past.
- **Booking Requests:** Alerts on new appointment submissions from the public website.
- **Security Events:** Flags failed login attempts or rate-limit lockouts.
- **Storage Alerts:** Flags corrupted JSON stores or unclosed file locks.

Admins can mark individual notifications as read or use **"Mark All as Read"** to clear pending badges.
