# Hamza Autos – Complete Admin Panel Architecture Documentation
**Workshop Location:** Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore, Punjab 54000  
**Contact:** +92 325 1814548 | WhatsApp: +92 325 1814548  
**Architecture Type:** Database-Free | Central Server File-Based Storage (`storage/*.json`)

---

## 1. Executive Summary

The Hamza Autos Admin Panel is an enterprise-grade, full-stack management system designed specifically for a motorcycle repair workshop in Badami Bagh, Lahore. Built under a strict **Zero-Database architecture**, the application uses Node.js atomic file I/O with mutex queues to guarantee multi-device persistence across mobile phones and desktop computers.

### Core Architecture Highlights
- **Storage Layer:** Pure JSON files stored in `storage/` and media assets in `uploads/`. Zero external database engines (no MySQL, PostgreSQL, MongoDB, SQLite, Supabase, or Firebase).
- **Backend API:** High-performance Express router mounted directly onto the Vite development server (via `serverApiPlugin()`) and standalone production runner (`server/prodServer.ts`).
- **Authentication:** PBKDF2 encryption (SHA-512, 10,000 iterations, unique 16-byte salt per hash) issuing cryptographic 64-character hex session tokens.
- **Frontend Architecture:** React 19 + TypeScript + Tailwind CSS with responsive 24-section modular dashboard.
- **Multi-Device Synchronization:** Form submissions from customer smartphones instantly arrive in the central file store and appear live in the admin panel.

---

## 2. Directory Structure

```text
hamza-autos/
├── server/
│   ├── app.ts                 # Express application configuration & upload limits
│   ├── auth.ts                # PBKDF2 hashing, session tokens, rate limiting
│   ├── fileStore.ts           # Atomic file writes, mutex locking, automatic backup
│   ├── prodServer.ts          # Standalone production runner (SPA fallback + API)
│   ├── routes.ts              # Express API endpoints for all 24 sections
│   └── seedData.ts            # Default data initialization for all 13 storage files
├── storage/
│   ├── admin-settings.json    # Business profile & admin credentials
│   ├── audit-logs.json        # Security and activity event log
│   ├── blogs.json             # Published and draft articles
│   ├── booking-submissions.json # Public appointment requests
│   ├── categories.json        # Blog categorization taxonomy
│   ├── contact-submissions.json # Contact page form submissions
│   ├── customers.json         # Workshop customer CRM directory
│   ├── feedback-submissions.json # Customer reviews & moderation
│   ├── forms-registry.json    # Global form status toggles & honeypot config
│   ├── inquiries.json         # Central inbox unifying all inbound leads
│   ├── notifications.json     # Admin alerts and real-time badges
│   ├── quotation-submissions.json # Overhaul estimate requests
│   ├── tags.json              # Blog topic tagging
│   └── backups/               # Automated snapshot archives (.json)
├── uploads/
│   ├── blogs/                 # Featured images for articles
│   ├── services/              # Service showcase photographs
│   ├── gallery/               # Workshop bay photographs
│   └── documents/             # Printable reports and PDFs
└── src/
    ├── components/admin/      # 24 modular admin section UI components
    ├── services/
    │   ├── adminApiService.ts # Typed HTTP client for all admin operations
    │   └── formSubmissionService.ts # Unified public form submission client
    └── views/
        └── AdminView.tsx      # Main admin panel container & sidebar
```

---

## 3. Sidebar Organization: 24 Core Sections

The admin panel organizes 24 distinct sections into 5 logical categories:

| Group | Section # | Section Name | Target Key | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Overview & Intelligence** | 1 | Dashboard | `dashboard` | KPI metrics, active bay status, revenue summary |
| | 20 | Notifications Center | `notifications` | Real-time alerts for bookings, contacts, and security |
| | 21 | Reports & Analytics | `analytics` | Inquiries by month, service popularity, CSV export |
| | 24 | Activity Logs | `audit-logs` | Chronological audit trail with IP and timestamps |
| **Inquiries & Leads** | 5 | All Inquiries (Central Inbox) | `inquiries` | 9 statuses, WhatsApp/Call quick actions, notes |
| | 6 | Contact Submissions | `contact-submissions` | Direct messages from `/contact` |
| | 7 | Booking Requests | `bookings` | Online service bay appointments |
| | 8 | Quotation Requests | `quotation-submissions` | Engine overhaul and repair cost inquiries |
| | 9 | Customer Feedback | `feedback` | Review moderation before public approval |
| | 11 | Form Management | `form-management` | Enable/disable forms, honeypot spam protection |
| **Content & Publishing** | 2 | Blog Management | `blogs` | Markdown editor, slug generator, SEO preview |
| | 3 | Blog Categories | `blog-categories` | Taxonomy management with slug editing |
| | 4 | Blog Tags | `blog-tags` | Keyword and topic tagging |
| | 18 | Media Library | `media-library` | Drag-and-drop file upload, folder views, URL copy |
| **Website CMS & SEO** | 12 | Website Content | `website-content` | Homepage hero, badges, CTAs, statistics |
| | 13 | Services Management | `services` | Pricing, labor time, popular tags |
| | 14 | Motorcycle Brands | `brands` | Honda, Yamaha, Suzuki, United repair specialties |
| | 15 | Areas We Serve | `areas` | Badami Bagh, Shadbagh, Misri Shah localities |
| | 16 | FAQ Management | `faqs` | Accordion questions and answers for Google snippets |
| | 17 | Testimonials | `testimonials` | Verified client quote management |
| | 19 | SEO Management | `seo` | Meta titles, descriptions, canonical URLs, OG tags |
| **CRM & System** | 10 | Customer Directory | `customers` | Lifetime inquiry history, bike profiles |
| | 22 | Data Backup & Restore | `backup-restore` | One-click JSON snapshots, rollback, full import |
| | 23 | Admin Settings | `settings` | Business phone, address, PBKDF2 password change |

---

## 4. Cross-Device Data Flow

1. **Customer Submits on Mobile Browser:**
   - User on Android/iOS visits `https://hamzaautos.com.pk/` and books an appointment.
   - `FormSubmissionService.submitBooking()` sends a POST request to `/api/bookings`.
2. **Server Storage Layer (`server/fileStore.ts`):**
   - Mutex lock acquires queue for `booking-submissions.json` and `inquiries.json`.
   - Record written to temporary file (`tempPath`) and atomically renamed.
   - New notification prepended to `storage/notifications.json`.
3. **Master Admin Dashboard:**
   - When Master Mechanic Hamza opens the admin dashboard on any computer or tablet, the Central Inbox automatically reflects the new submission.
   - One-click WhatsApp action opens a pre-composed Urdu/English greeting addressed to the customer.
