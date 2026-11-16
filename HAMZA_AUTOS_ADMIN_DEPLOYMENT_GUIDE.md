# Hamza Autos – Production Deployment & Hosting Guide
**Workshop Location:** Shop Near Ali Hajvery Marriage Hall, Abu Bakar Road, Badami Bagh, Lahore  
**Architecture:** Zero Database | Node.js Express + Static SPA Bundle

---

## 1. Hosting Architecture Overview

Because Hamza Autos uses a **zero external database architecture**, deploying the complete application requires only a standard Node.js runtime (v18+) or any containerized hosting service (VPS, Railway, Render, DigitalOcean, or local workshop server).

```text
[Internet / Customer Smartphones & Laptops]
                     │
                     ▼
             [Node.js Server]
             PORT 3000 / 80 / 443
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
   [Express API]          [Vite Static SPA]
  /api/*, /uploads/*      dist/index.html & assets
         │
         ▼
[File Storage Engine]
  storage/*.json
```

---

## 2. Deployment Steps

### Option A: Running Production Server (Recommended)
1. **Install Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
2. **Compile Frontend:**
   ```bash
   npm run build
   ```
3. **Start Production Runner:**
   ```bash
   npm run start
   # Or directly: npx tsx server/prodServer.ts
   ```
   The server serves the compiled `dist/` directory at `http://localhost:3000` with active API endpoints and file storage.

### Option B: Development Mode
For live local editing and auto-reload:
```bash
npm run dev
```
Vite mounts the Express middleware automatically on `http://localhost:3000/`.

---

## 3. Persistent Volumes Configuration

When hosting on cloud platforms (such as Docker, Railway, or Render):
- Mount a persistent disk volume to the `/storage` and `/uploads` directories so that customer inquiries, blogs, and uploaded images are preserved across container redeployments.

Example `docker-compose.yml`:
```yaml
version: '3.8'
services:
  hamza-autos:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - ADMIN_USERNAME=admin
      - ADMIN_PASSWORD=hamza12345
    volumes:
      - ./storage:/app/storage
      - ./uploads:/app/uploads
```
