# Hamza Autos — Complete File Storage Schema Reference
**Storage Directory:** `storage/`  
**Backup Directory:** `storage/backups/`  
**Total Managed Stores:** 28 JSON Files  
**Encoding:** UTF-8 JSON with 2-space indentation

---

## Complete Matrix of All 28 JSON Stores

| # | File Name | Primary Entity | Key Fields & Relational References |
|---|-----------|----------------|------------------------------------|
| 1 | `crm-leads.json` | `LeadRecord[]` | `id`, `customerName`, `phoneNumber`, `bikeBrand`, `bikeModel`, `estimatedValue`, `status`, `assignedAdmin` |
| 2 | `crm-followups.json` | `FollowUpRecord[]` | `id`, `leadId` $\rightarrow$ `crm-leads`, `scheduledDate`, `actionType`, `status`, `notes` |
| 3 | `crm-interactions.json` | `CustomerInteraction[]` | `id`, `leadId`, `customerId`, `channel`, `summary`, `timestamp` |
| 4 | `mechanics.json` | `MechanicProfile[]` | `id`, `fullName`, `phoneNumber`, `cnic`, `specializations[]`, `dailyRate`, `bayNumber`, `employmentStatus` |
| 5 | `mechanic-attendance.json` | `MechanicAttendance[]` | `id`, `mechanicId` $\rightarrow$ `mechanics`, `date`, `status`, `checkInTime`, `checkOutTime`, `wageEarned` |
| 6 | `expenses.json` | `ExpenseRecord[]` | `id`, `voucherNumber`, `expenseCategory`, `amount`, `paymentMethod`, `paidTo`, `date`, `notes` |
| 7 | `expense-categories.json` | `ExpenseCategory[]` | `id`, `categoryName`, `description`, `isTaxDeductible`, `monthlyBudget` |
| 8 | `financial-transactions.json` | `FinancialTransaction[]` | `id`, `transactionType` (Inflow/Outflow), `category`, `amount`, `paymentMethod`, `referenceId`, `date` |
| 9 | `suppliers.json` | `SupplierRecord[]` | `id`, `supplierName`, `contactPerson`, `phoneNumber`, `address`, `currentBalance`, `paymentTerms` |
| 10 | `purchase-orders.json` | `PurchaseOrder[]` | `id`, `poNumber`, `supplierId` $\rightarrow$ `suppliers`, `items[]`, `totalOrderValue`, `deliveryStatus`, `paymentStatus` |
| 11 | `supplier-payments.json` | `SupplierPayment[]` | `id`, `poId` $\rightarrow$ `purchase-orders`, `supplierId`, `amountPaid`, `paymentMethod`, `date`, `receiptNumber` |
| 12 | `customers.json` | `CustomerProfile[]` | `id`, `name`, `phoneNumber`, `whatsapp`, `bikeBrand`, `bikeModel`, `totalSpent`, `totalBookings` |
| 13 | `booking-submissions.json` | `AppointmentBooking[]`| `id`, `bookingNumber`, `customerName`, `phoneNumber`, `serviceRequested`, `appointmentDate`, `status` |
| 14 | `job-cards.json` | `JobCard[]` | `id`, `jobNumber`, `customerId`, `mechanicId`, `bikeBrand`, `bikeModel`, `repairStatus`, `partsCost`, `laborCost` |
| 15 | `invoices.json` | `WorkshopInvoice[]` | `id`, `invoiceNumber`, `jobCardId`, `customerId`, `totalAmount`, `amountPaid`, `paymentStatus` |
| 16 | `inventory.json` | `SparePart[]` | `id`, `partNumber`, `name`, `category`, `bikeModel`, `stockQuantity`, `minStockAlert`, `purchasePrice`, `sellingPrice` |
| 17 | `stock-movements.json` | `StockMovement[]` | `id`, `partId` $\rightarrow$ `inventory`, `movementType` (IN/OUT/ADJUST), `quantity`, `reference`, `timestamp` |
| 18 | `inquiries.json` | `InquiryLead[]` | `id`, `customerName`, `phoneNumber`, `serviceType`, `message`, `source`, `status`, `createdAt` |
| 19 | `contact-submissions.json` | `ContactSubmission[]` | `id`, `name`, `email`, `phone`, `subject`, `message`, `submittedAt`, `isRead` |
| 20 | `quotation-requests.json` | `QuotationRequest[]` | `id`, `name`, `phone`, `bikeModel`, `requiredServices[]`, `budgetEstimate`, `status` |
| 21 | `customer-feedback.json` | `CustomerFeedback[]` | `id`, `customerName`, `rating`, `reviewText`, `bikeModel`, `isPublic`, `createdAt` |
| 22 | `blogs.json` | `BlogPost[]` | `id`, `title`, `slug`, `content`, `excerpt`, `category`, `tags[]`, `status`, `publishedDate` |
| 23 | `blog-categories.json` | `Category[]` | `id`, `name`, `slug`, `description`, `count` |
| 24 | `blog-tags.json` | `Tag[]` | `id`, `name`, `slug`, `count` |
| 25 | `site-settings.json` | `SiteSettings` | Business name, phone, address, operating hours, hero banners, social links |
| 26 | `admin-settings.json` | `AdminSettings` | Admin username, salted password hash, salt, notification preferences |
| 27 | `audit-logs.json` | `AuditLog[]` | `id`, `action`, `performedBy`, `affectedRecord`, `timestamp`, `metadata` |
| 28 | `security-events.json` | `SecurityEvent[]` | `id`, `timestamp`, `eventType`, `username`, `ipAddress`, `userAgent`, `severity` |

---

## Concurrency & Integrity Invariants
1. **Uniqueness:** All IDs use cryptographic prefix identifiers (e.g. `lead-`, `mech-`, `exp-`, `po-`).
2. **Referential Integrity:** Invoices must point to valid Job Cards; Job Cards must point to valid Customers or Mechanics.
3. **No Negative Quantities:** Spare parts stock count cannot drop below 0.
4. **Cash Inflows = Amount Paid:** Invoice total cannot be booked as revenue prior to payment registration.
