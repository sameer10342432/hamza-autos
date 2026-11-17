# Hamza Autos — Advanced CRM & Lead Management User & Developer Guide
**Location:** Workshop Operations Portal, Abu Bakar Road, Badami Bagh, Lahore  
**Architecture:** Database-Free File-Based JSON Storage (`storage/crm-*.json`)  
**Route:** `/admin/crm-leads` and `/admin/followups`

---

## 1. Overview & Business Objectives
The **Advanced CRM & Lead Management System** transforms incoming motorcycle repair inquiries, walk-ins, phone calls, and online quotation requests into an organized revenue generation pipeline. It enables Hamza Autos to track high-value prospects (e.g., full engine rebuilds, fork straighteners, tuning packages) through structured sales stages without letting any prospect slip through the cracks.

---

## 2. File-Based Storage Architecture
All CRM data is stored under the `storage/` directory using atomic JSON file updates and in-memory mutex sequencing:
- `storage/crm-leads.json`: Master registry of all leads with customer contacts, motorcycle specs, estimated value, priority, and sales stage.
- `storage/crm-followups.json`: Scheduled, pending, overdue, and completed follow-up phone calls and WhatsApp touchpoints.
- `storage/crm-interactions.json`: Detailed chronological call notes, WhatsApp conversation summaries, and quotation log history.

---

## 3. Lead Lifecycle & Pipeline Stages
A lead progresses through the following five standardized pipeline stages:
1. **New Lead:** Initial capture from website booking, contact form, phone call, or walk-in.
2. **Contacted / In Discussion:** Workshop representative has initiated communication, diagnosed needs, or discussed initial symptoms.
3. **Quotation Sent:** A formal repair or parts quotation has been generated and sent to the client via WhatsApp or PDF.
4. **Follow-Up Scheduled:** Follow-up call or WhatsApp reminder queued up for client decision.
5. **Converted (Won):** The customer has approved the job, converted into an official registered customer, and booked into a repair slot or job card.
6. **Lost / Archived:** The prospect declined service, repaired elsewhere, or was unreachable. A lost reason is permanently documented for analytics.

---

## 4. Single-Click Lead Conversion
When a customer agrees to proceed with workshop repairs:
- Click **"Convert to Customer"** on any active lead card or row.
- The system automatically:
  1. Creates or links the customer in `storage/customers.json`.
  2. Generates an official workshop appointment booking in `storage/booking-submissions.json`.
  3. Pre-populates the vehicle details (Make, Model, Registration Number, Problem Symptoms).
  4. Changes the CRM lead status to `Converted`.
  5. Logs the conversion in `storage/audit-logs.json`.

---

## 5. Direct WhatsApp & Call Integration
- **Quick WhatsApp:** Click the green WhatsApp button next to any lead to trigger a pre-formatted Urdu/English localized message with motorcycle diagnostic details and Hamza Autos workshop address.
- **Quick Call:** Instant `tel:` protocol click-to-dial trigger on mobile devices and workstations.

---

## 6. API Reference
- `GET /api/crm/leads`: Fetch leads with optional filtering by `status`, `priority`, or `search`.
- `POST /api/crm/leads`: Create a new lead with validation.
- `PUT /api/crm/leads/:id`: Update lead details, pipeline stage, priority, or notes.
- `DELETE /api/crm/leads/:id`: Archive or delete a lead record.
- `POST /api/crm/leads/:id/convert`: Atomically convert lead into registered customer profile & appointment booking.
- `GET /api/crm/followups`: Fetch pending and scheduled follow-ups.
- `POST /api/crm/followups`: Queue a new follow-up reminder.
- `PUT /api/crm/followups/:id`: Mark follow-up as completed or reschedule.
