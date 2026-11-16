# Hamza Autos – Data Backup & Restore Operations Guide
**Workshop Location:** Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore  
**Architecture:** Zero Database | Point-in-Time Snapshot Engine

---

## 1. Overview

Because all website data, blogs, appointments, and inquiries reside in `storage/*.json`, backups and disaster recovery operations are fast, reliable, and completely portable. Master Mechanic Hamza can create instant snapshots, download complete JSON archives to his local laptop or flash drive, and restore previous workshop states with one click.

---

## 2. Backup Methods

### Method 1: Instant Snapshot (Server-Side)
- Navigating to **Section 22: Data Backup & Restore** and clicking **Create Snapshot** reads all 13 storage files and bundles them into `storage/backups/snapshot-<timestamp>.json`.
- This operation takes less than 50 milliseconds and produces a self-contained archive of the entire workshop state.

### Method 2: Download Full JSON (Offline Storage)
- Clicking **Download Full JSON** exports the complete database into a downloadable file:
  `hamza_autos_full_backup_YYYY-MM-DD.json`
- Admins can keep weekly copies on external drives or cloud storage for ultimate disaster preparedness.

### Method 3: Automated Safety Backups (`*.bak.*`)
- The atomic write engine in `server/fileStore.ts` automatically creates a timestamped safety backup in `storage/backups/` every time a file is updated or overwritten.

---

## 3. Restore Procedures

### Restoring from Saved Snapshot
1. In the admin panel, navigate to **22. Data Backup & Restore**.
2. Under **Saved Snapshot History**, locate the desired snapshot date and time.
3. Click **Restore This Snapshot**.
4. Confirm the prompt dialog. The server will atomically unpack the stores, reload the state, and log the event to `storage/audit-logs.json`.

### Importing an Offline JSON Backup File
1. In the top toolbar, click **Import JSON**.
2. Select your previously downloaded `hamza_autos_full_backup_*.json` file.
3. Confirm the overwrite warning.
4. The system validates the schema, restores each JSON store, and updates the UI immediately.
