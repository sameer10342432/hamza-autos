# Hamza Autos — Data Recovery & Concurrency Architecture Guide
**Location:** Workshop Operations Portal, Abu Bakar Road, Badami Bagh, Lahore  
**Architecture:** Atomic Filesystem Swaps, Mutex Queues, and Automatic Snapshots  
**Route:** `/admin/storage-health` and `/admin/backup`

---

## 1. Concurrency Protection & Zero-Database Guarantee
In a high-activity workshop environment where multiple front-desk staff, estimators, and workshop managers perform concurrent operations (e.g. creating bookings while marking invoices paid and updating job cards), file-based JSON storage requires bulletproof concurrency guards:

### A. In-Memory Mutex Promise Queue
All write operations to the same target file are strictly queued in Node.js via an asynchronous Promise chain. Even if 5 requests arrive at the exact same millisecond:
- Request 1 completes write and file flush.
- Request 2 proceeds using freshly written data.
- Lost updates and race conditions are mathematically eliminated.

### B. Atomic Rename Replacement (`fs.renameSync`)
- Data is first written to a temporary sibling file (e.g., `storage/invoices.json.tmp`).
- Flushed to physical disk using `fs.fsyncSync`.
- Atomically swapped to replace `storage/invoices.json` using the operating system's atomic rename primitive.
- A sudden system power cut or crash can **NEVER** leave a half-written or corrupted JSON file.

### C. Automatic `.bak` Snapshot Retention
Prior to every modifying write, `fileStore.ts` automatically creates a backup snapshot under `storage/backups/`.

---

## 2. Corrupted JSON Disaster Recovery Procedure
If a file becomes unreadable due to accidental manual editing:
1. Navigate to `/admin/storage-health`.
2. The health diagnostics table flags the corrupted store with a red badge: `CORRUPTED`.
3. The system engine automatically pulls the latest valid snapshot from `storage/backups/<filename>.bak.json`.
4. The database is restored to the last known good state within seconds without losing historical transactions.

---

## 3. Manual Backup & Full System Export
Admins can perform complete data archiving at any time from `/admin/backup`:
- **Single-Click ZIP/JSON Export:** Downloads a complete bundle of all 28 JSON database stores.
- **Import & Restore:** Uploads an archive with full schema validation and checksum verification prior to overwriting active storage.
