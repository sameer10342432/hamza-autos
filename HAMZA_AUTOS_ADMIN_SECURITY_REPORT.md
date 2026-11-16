# Hamza Autos – Admin Panel Security Architecture Report
**Workshop Location:** Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore  
**Security Framework:** Zero Database | PBKDF2 Hashing | Token Auth | IP Rate Limiting

---

## 1. Threat Model & Security Posture

Because Hamza Autos operates in a file-based environment without a database server, traditional SQL injection attacks are entirely non-existent. However, the file system and API endpoints require defense against:
1. Brute-force credential attacks.
2. Unauthorized file system access (Directory Traversal).
3. Session hijacking and replay.
4. Data loss due to concurrent file writes.

---

## 2. Implemented Security Controls

### 1. PBKDF2 Password Hashing with Dynamic Salt
- **Algorithm:** PBKDF2 (Password-Based Key Derivation Function 2) using `sha512`.
- **Iteration Count:** 10,000 rounds.
- **Salt:** 16-byte cryptographically secure random hexadecimal string generated via `crypto.randomBytes(16)`.
- **Storage:** Stored inside `storage/admin-settings.json`. Passwords are never stored in plaintext.

### 2. Cryptographic Session Token Issuance
- Upon successful authentication, a 64-character hexadecimal session token is issued using `crypto.randomBytes(32).toString('hex')`.
- Tokens expire automatically after 24 hours (or 7 days if "Remember Me" is selected).
- Protected endpoints validate the token via the `Authorization: Bearer <token>` header or `x-admin-token` request header.
- Token invalidation on logout removes the session from both memory and disk.

### 3. IP-Based Rate Limiting
- To prevent dictionary and automated brute-force attacks on the admin login route (`POST /api/auth/login`), an in-memory tracking map monitors failed login attempts per client IP.
- **Threshold:** 5 consecutive failed attempts.
- **Penalty:** IP address is locked for **15 minutes**. Further login attempts return HTTP 429 with remaining lockout time.
- Successful authentication immediately clears the failed attempt counter.

### 4. Path Traversal & File Upload Guardrails
- In `server/routes.ts` and `server/fileStore.ts`, all file operations validate that target paths reside strictly inside `STORAGE_DIR` or `UPLOADS_DIR`.
- Filenames containing `..`, null bytes, or absolute drive paths outside the workspace directory are rejected.
- Media upload limits payload to 50MB and restricts extensions to safe mime types (`.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`, `.pdf`).

### 5. Audit Logging (`storage/audit-logs.json`)
Every sensitive administrative action is logged with:
- Action type (`ADMIN_LOGIN`, `PASSWORD_UPDATED`, `INQUIRY_DELETED`, `BACKUP_CREATED`, `DATA_RESTORED`)
- Authenticated username
- Timestamp (UTC ISO-8601)
- Client IP address and User Agent
- Detailed event description
