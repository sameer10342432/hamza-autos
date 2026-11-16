# Hamza Autos – Inquiry & Form Submissions Management Guide
**Workshop Location:** Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore  
**Phone:** +92 325 1814548 | WhatsApp: +92 325 1814548  
**System Location:** Admin Panel -> Sections 5, 6, 7, 8, 9, 11

---

## 1. Central Inquiry Inbox (Section 5)

The Central Inbox is the command center of Hamza Autos' customer pipeline. Every inbound lead from every device is automatically unified into `storage/inquiries.json`.

### Supported Form Sources
1. **Appointment Bookings:** Online booking modal submissions (`storage/booking-submissions.json`).
2. **Contact Submissions:** Direct queries submitted on `/contact` (`storage/contact-submissions.json`).
3. **Quotation Requests:** Overhaul and maintenance estimates (`storage/quotation-submissions.json`).
4. **Customer Feedback:** Ratings and reviews (`storage/feedback-submissions.json`).

---

## 2. Nine Workflow Statuses

To ensure no customer is forgotten, every inquiry moves through a defined lifecycle:

| Status | Badge Color | Description |
| :--- | :--- | :--- |
| `New` | Blue (Pulsing) | Just submitted by customer; needs first response. |
| `Contacted` | Amber | Mechanic has called or sent WhatsApp greeting. |
| `In Progress` | Indigo | Diagnostics or parts availability being checked. |
| `Quote Sent` | Purple | Official repair cost estimate delivered to customer. |
| `Booked` | Emerald | Service bay appointment confirmed on schedule. |
| `Completed` | Teal | Motorcycle repaired and handed over to customer. |
| `Cancelled` | Slate | Customer cancelled or rescheduled. |
| `Spam` | Red | Junk submission flagged by honeypot or admin. |
| `Archived` | Zinc | Historical record kept for customer reference. |

---

## 3. Quick Actions & Customer Communication

### One-Click WhatsApp Action
Clicking the green WhatsApp icon next to any inquiry immediately launches `https://wa.me/92...` with a personalized, pre-formatted message:
> *"Salam [Customer Name]! Thank you for contacting Hamza Autos (Badami Bagh, Lahore). How can we assist you with your [Bike Model] today?"*

### Direct Phone Call
Clicking the blue telephone icon triggers a direct `tel:` call on mobile or desktop phone clients.

### Internal Admin Notes
Mechanics can append private workshop notes to any inquiry (e.g. *"Customer mentioned bike makes rattling sound in 3rd gear; quoted Rs. 3,500 for gearbox inspection"*). Notes are timestamped and attributed to the admin user.

### Bulk Operations
Admins can select multiple records using checkboxes and apply bulk actions:
- Mark selected as Contacted
- Bulk Archive
- Bulk Delete
