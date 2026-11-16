# Hamza Autos – Data Backup & Disaster Recovery Guide
**Workshop Location:** Abu Bakar Road, Badami Bagh, Lahore  
**Support Contact:** +92 325 1814548  
**Applicability:** Master Mechanic, Workshop Manager, Administrative Staff

---

## 1. Why Local Backups Matter

Because Hamza Autos uses a **Local-First Architecture** storing all data directly inside your web browser's IndexedDB, your records do not depend on cloud servers. However, clearing your browser history/cookies completely, resetting your computer, or experiencing hardware failure can delete local browser storage.

Regularly downloading a **JSON Backup File** safeguards all customer records, repair histories, invoices, and inventory balances.

---

## 2. Daily & Weekly Backup Routine

### Daily Closing Routine (Takes 10 Seconds)
1. Open the **Hamza Autos Operations Portal** (`/#/admin`).
2. In the top navigation bar, click the **Backup & Restore** button.
3. Click the black button: **"Download Full Backup JSON File"**.
4. A file named `hamza_autos_full_backup_YYYY-MM-DD.json` will download to your `Downloads` folder.
5. *(Recommended)* Copy this `.json` file to a USB flash drive or Google Drive / WhatsApp for off-site redundancy.

### Weekly Archival Routine
- Keep a folder on your workshop PC named `Hamza_Autos_Backups`.
- At the end of every Saturday, archive the week's backup file.

---

## 3. How to Restore from a Backup File

If you switch to a new laptop, change browsers, or need to roll back data:

1. Open the Hamza Autos application on your new browser or computer.
2. Sign in to the **Owner Portal** (`/#/admin`).
3. Click **Backup & Restore** in the top navigation bar.
4. Under **"2. Restore Database from JSON Backup"**:
   - Click **Choose File** and select your `.json` backup file.
   - Or paste the contents into the raw text box.
5. The system will automatically validate the file structure and display a summary of records found.
6. Choose your **Restore Mode**:
   - **Replace (Recommended for full recovery):** Wipes existing browser records and restores the exact backup snapshot. An automatic safety pre-backup of current records is created in memory before replacing.
   - **Merge:** Preserves current records and adds or updates matching IDs from the backup file.
7. Click **"Execute Database Restore"**.
8. A green success message will confirm: *"Success! Restored X records across object stores."*
9. The page will refresh automatically with all records loaded.

---

## 4. Emergency Disaster Recovery Checklist

| Scenario | Recommended Action |
| :--- | :--- |
| **Accidental "Clear Browsing Data"** | Open Admin -> Backup & Restore -> Upload your latest `.json` backup -> Select **Replace Mode**. |
| **Workshop Laptop Hardware Failure** | Take your USB backup, open Hamza Autos on any other computer/tablet, open Backup & Restore, and upload the backup file. All data is restored in under 5 seconds. |
| **Duplicate Records Encountered** | Export current data, inspect the backup file, and perform a clean Replace restore from the last known good backup. |
| **Moving from Chrome to Edge/Brave** | Export JSON from Chrome, open Edge, navigate to Hamza Autos, and import the JSON file. |

---

## 5. Storage Quota Monitoring

In the **Backup & Restore** modal, look at the **Browser Storage Allocation** bar:
- Displays exact megabytes used vs maximum browser quota (e.g., `3.2 MB / 48,000 MB (0.01% used)`).
- Normal workshop usage will easily stay below 0.1% of available browser storage for several years.
