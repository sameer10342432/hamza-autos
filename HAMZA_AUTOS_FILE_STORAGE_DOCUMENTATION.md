# Hamza Autos – File-Based Storage Engine Documentation
**Workshop Location:** Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore  
**Architecture:** Zero Database | Pure Node.js Atomic JSON File Storage Engine

---

## 1. Design Principles

The file storage system is engineered to provide the durability, concurrency safety, and performance of a relational database without running database daemons or requiring connection strings.

### Key Guarantees
1. **Atomic Write Safety:** Data is written to a temporary file (`filename.tmp.<random>`) and renamed via `fs.promises.rename()`. In POSIX and modern Windows NTFS, file renaming within the same volume is atomic, preventing corrupted or half-written JSON files even if power fails mid-write.
2. **Per-File Mutex Locking:** In-memory queue (`fileLockQueues: Map<string, Promise<void>>`) chains concurrent write operations so that multiple incoming requests to the same JSON file are executed sequentially without race conditions.
3. **Safety Rollback Snapshots:** Before overwriting any storage file, `createSafetyBackup()` copies the existing file to `storage/backups/<filename>.bak.<timestamp>`, preserving a historical audit trail.
4. **Zero External Dependencies:** Standard Node.js `fs` and `crypto` modules handle all persistence.

---

## 2. Storage File Schemas

### `storage/inquiries.json` (Central Inbox)
```json
[
  {
    "id": "inq-mwiyw67p-1234",
    "customerName": "Tariq Mehmood",
    "phoneNumber": "0321 4455667",
    "inquiryType": "Appointment Booking",
    "relatedService": "Engine Overhaul & Tuning",
    "bikeBrand": "Honda",
    "bikeModel": "CG 125",
    "registrationNumber": "LEN-4590",
    "message": "Engine smoke issue, please inspect piston and valves.",
    "preferredDate": "2026-11-20",
    "preferredTime": "Morning (10:00 AM)",
    "submissionDate": "2026-11-16T07:54:09.112Z",
    "sourceForm": "Workshop Booking Modal",
    "sourcePage": "/#/",
    "status": "New",
    "priority": "High",
    "assignedAdmin": "Master Mechanic Hamza",
    "adminNotes": "Booking #HA-BK-2026-842"
  }
]
```

### `storage/blogs.json` (Published & Draft Articles)
```json
[
  {
    "id": "common-engine-problems",
    "slug": "common-motorcycle-engine-problems-and-solutions",
    "title": "Common Motorcycle Engine Problems and Their Solutions in Pakistan",
    "excerpt": "Comprehensive diagnostic guide by Master Mechanic Hamza covering engine overheating, white smoke, loss of compression, and carburetor tuning.",
    "content": "## Diagnostic Guide\n\nMotorcycles in Badami Bagh Lahore experience intense heat and dust...",
    "featuredImage": "/assets/images/home/motorcycle-workshop-hero.jpg",
    "category": "Engine Overhaul",
    "tags": ["Engine Repair", "Tuning", "Honda 70"],
    "status": "published",
    "author": "Master Mechanic Hamza",
    "readTime": "5 min read",
    "publishedAt": "2026-11-10T08:00:00.000Z",
    "updatedAt": "2026-11-16T07:00:00.000Z",
    "seoTitle": "Common Motorcycle Engine Problems and Solutions | Hamza Autos Lahore",
    "seoDescription": "Fix white smoke, overheating and compression loss. Diagnostic advice by Hamza Autos Badami Bagh.",
    "keywords": ["motorcycle engine repair lahore", "bike smoke problem", "honda 125 engine overhaul"],
    "views": 342
  }
]
```

### `storage/admin-settings.json` (Credentials & Business Info)
```json
{
  "businessName": "Hamza Autos",
  "tagline": "Bike Mechanic & Motorcycle Repair Shop",
  "phone": "+92 325 1814548",
  "whatsappNumber": "+92 325 1814548",
  "address": "Abu Bakar Road, Near Ali Hajvery Marriage Hall, Badami Bagh, Lahore, Punjab 54000",
  "operatingHours": "9:00 AM – 9:00 PM (Monday to Sunday)",
  "adminUsername": "admin",
  "adminDisplayName": "Master Mechanic Hamza",
  "sessionTimeoutHours": 24,
  "autoBackupDays": 7
}
```

---

## 3. Storage API Methods (`server/fileStore.ts`)

| Function Signature | Description |
| :--- | :--- |
| `readJsonFile<T>(filename, fallback)` | Safely parses JSON file with error recovery and fallback data. |
| `writeJsonFileAtomic<T>(filename, data, backup)` | Acquires mutex, writes temporary file, and performs atomic rename. |
| `createSafetyBackup(filename)` | Copies active file into `storage/backups/` before major modifications. |
| `generateId(prefix)` | Creates unique timestamp-prefixed identifier (e.g. `inq-mwiy...`). |
| `getCurrentTimestamp()` | Returns standard ISO-8601 UTC timestamp. |
