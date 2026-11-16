# Hamza Autos – Known Technical Boundaries & Operational Considerations
**System:** Local-First Workshop Management Suite  
**Database Model:** Browser-Native IndexedDB (`hamza_autos_db`)  
**Workshop:** Abu Bakar Road, Badami Bagh, Lahore (+92 325 1814548)

---

## 1. Browser Origin Isolation (Per-Browser Storage)

### Explanation
By design under the W3C Web Security and Same-Origin Policy, IndexedDB databases are sandboxed to the specific browser application and device origin where they were created.

### Operational Implication
- Records created in Google Chrome on the workshop PC are stored inside Google Chrome's local profile on that PC.
- Opening Microsoft Edge or Mozilla Firefox on that same PC will access a separate local IndexedDB space unless synced.
- **Solution:** Use the built-in **Backup & Restore** feature to export a `.json` backup file and import it into any other browser or machine in under 5 seconds.

---

## 2. Incognito / Private Browsing Mode

### Explanation
Browsers deliberately wipe IndexedDB databases created in Incognito/Private tabs as soon as the Incognito window is closed.

### Best Practice
- **Never operate the primary workshop counter in Incognito mode.**
- Always run Hamza Autos in standard browser windows to ensure permanent persistence across system restarts.

---

## 3. Browser Cache Clearing Precautions

### Explanation
When a user opens Chrome's "Clear Browsing Data" menu and checks **"Cookies and other site data"**, the browser will purge all local IndexedDB stores.

### Prevention Protocol
1. Follow the Daily Closing Routine: download a JSON backup at the end of each working day.
2. If cleaning browser junk, uncheck "Cookies and site data" or use the **Replace Restore** function from your downloaded backup.

---

## 4. Multi-Device Real-Time Synchronization

### Explanation
Because Hamza Autos avoids centralized cloud database servers (zero MySQL, zero MongoDB, zero Firebase) to maintain zero server costs and zero cloud dependencies, automatic instantaneous multi-device background synchronization is not performed.

### Solution for Multi-Counter Operations
Workshops requiring record sharing between a counter PC and mechanic bay tablets can export the daily backup JSON file to a shared local network folder or send it via WhatsApp Web.
