/**
 * Hamza Autos - Production Server Runner with Optimized Static Caching
 * Serves static dist/ bundle + /api routes + /uploads
 * Location: Abu Bakar Road, Badami Bagh, Lahore | +92 325 1814548
 */

import path from 'path';
import fs from 'fs';
import express from 'express';
import { createServerApp } from './app';

const PORT = process.env.PORT || 3000;
const app = createServerApp();
const DIST_DIR = path.resolve(process.cwd(), 'dist');

// If production build exists, serve static files with optimized browser caching
if (fs.existsSync(DIST_DIR)) {
  // Fingerprinted JS and CSS assets get 1-year immutable caching
  app.use('/assets', express.static(path.join(DIST_DIR, 'assets'), {
    maxAge: '1y',
    immutable: true,
    etag: true
  }));

  // Other static files (favicon, manifest, robots, icons)
  app.use(express.static(DIST_DIR, {
    maxAge: '1d',
    etag: true
  }));

  // SPA fallback with no-cache for index.html (guarantees instant deployment updates)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  console.log('[ProdServer] "dist" folder not found. Run "npm run build" first to create static assets.');
}

app.listen(PORT, () => {
  console.log(`[Hamza Autos Server] Running in high-performance production mode on http://localhost:${PORT}`);
  console.log(`[Storage] Database-Free File Storage active in storage/*.json`);
});
