# Hamza Autos — Security Centre & Access Control Documentation
**Location:** Workshop Operations Portal, Abu Bakar Road, Badami Bagh, Lahore  
**Architecture:** Cryptographic PBKDF2 Hashing, Session Persistence & Audit Trail  
**Route:** `/admin/security` and `/admin/activity-logs`

---

## 1. Security Overview
The Hamza Autos Workshop Operations Portal enforces multi-layered defense to safeguard workshop financial records, customer personal data, and operational assets without relying on third-party cloud authentication dependencies.

---

## 2. Authentication Mechanics & Credentials
- **Master Admin Username:** `admin` (or configured via environment variable `ADMIN_USERNAME`)
- **Default Master Passwords:**
  - Standard Admin: `hamza12345`
  - High-Security Master: `HamzaAutos2026!`
- **Password Storage:** Salted PBKDF2 (10,000 iterations, 64-byte key, SHA-512) stored in `storage/admin-settings.json`. Cleartext passwords are never saved to disk.
- **Session Tokens:** Cryptographically random 256-bit hexadecimal tokens saved in `storage/sessions.json` with sliding expiry timestamps (24 hours default, 30 days if "Remember Me" is enabled).

---

## 3. Brute-Force Rate Limiting Guard
To protect the administrative login endpoint from automated password guessing attacks:
- The backend tracks failed login attempts by Client IP Address.
- **Threshold:** Maximum 5 failed attempts within a 15-minute rolling window.
- **Penalty:** IP address is locked out for 15 minutes. HTTP 429 (Too Many Requests) is returned with exact wait time.
- **Security Event:** Each violation is permanently logged in `storage/security-events.json`.

---

## 4. Audit Log & Security Events Registry
Accessible at `/admin/security`:
- **Real-time Event Feed:**
  - Successful administrative logins with IP, User Agent, and timestamp.
  - Failed login attempts with submitted username and IP.
  - Rate limit trigger events.
  - Administrative credential changes.
  - Unauthorized access attempts to restricted `/api/*` routes.
- **Severity Classification:** `Info`, `Warning`, `Critical`.

---

## 5. Security Best Practices for Workshop Staff
1. Always log out when stepping away from the workshop counter terminal.
2. Regularly inspect the Security Centre for unrecognized IP addresses.
3. Update the master admin password at least once every 90 days.
