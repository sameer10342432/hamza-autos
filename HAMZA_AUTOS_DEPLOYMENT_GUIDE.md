# Hamza Autos – Production Deployment & Hosting Guide
**Target Environments:** GitHub Pages, Cloudflare Pages, Netlify, Vercel, Local Workshop Server  
**Framework:** React 19 + TypeScript + Vite + Tailwind CSS  
**Database Requirements:** None (Zero server-side databases required)  
**Location:** Abu Bakar Road, Badami Bagh, Lahore (+92 325 1814548)

---

## 1. Zero Backend Hosting Architecture

Because Hamza Autos is engineered with a **Local-First Architecture**, the entire build compiles into pure static HTML, CSS, JavaScript, and optimized media assets. It requires:
- No Node.js runtime server on the host.
- No database server (no MySQL, PostgreSQL, MongoDB, Firebase, or Supabase).
- No server-side environment variables or secret API keys.

This makes Hamza Autos deployable on any free or low-cost static hosting platform with 100% uptime and high page speed.

---

## 2. Deploying to GitHub Pages (Recommended Free Hosting)

### Step 1: Verify the Build
```bash
npm run build
```
This produces the distribution bundle in the `dist/` directory.

### Step 2: Configure HashRouter Navigation
The application uses hash-based routing (`/#/services`, `/#/admin`, `/#/customer-portal`, `/#/track-repair`). This ensures that client-side page transitions, direct links, and page refreshes work without requiring server-side URL rewrite rules (such as `.htaccess` or `_redirects`).

### Step 3: Deploy via GitHub Actions
Ensure your GitHub repository has GitHub Pages enabled under **Settings -> Pages -> Build and deployment -> Source: GitHub Actions** (or `gh-pages` branch).

---

## 3. Deploying to Netlify or Cloudflare Pages

### Build Settings
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node.js Version:** `20.x` or `22.x`

No environment variables are required.

---

## 4. Local Workshop Offline Setup (Single PC / Workshop Counter)

If the workshop has a counter PC that occasionally operates completely offline without internet:
1. Build the production bundle: `npm run build`.
2. Serve locally using any lightweight static server:
   ```bash
   npx serve dist -l 3000
   ```
3. Create a desktop shortcut pointing to `http://localhost:3000`.
4. The workshop team can check in motorcycles, generate job cards, update inventory, and print thermal receipts even if broadband is completely down.

---

## 5. Browser Compatibility Matrix

| Browser | Platform | Compatibility | IndexedDB Support |
| :--- | :--- | :--- | :--- |
| **Google Chrome** | Windows / Mac / Linux | 100% Fully Supported | Full (Native) |
| **Microsoft Edge** | Windows / Mac | 100% Fully Supported | Full (Native) |
| **Mozilla Firefox** | Windows / Mac / Linux | 100% Fully Supported | Full (Native) |
| **Apple Safari** | macOS / iOS | Fully Supported | Full (Native) |
| **Chrome for Android** | Android (Smartphones/Tablets) | 100% Fully Supported | Full (Native) |
| **Samsung Internet** | Android | 100% Fully Supported | Full (Native) |
