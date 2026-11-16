/**
 * Hamza Autos - Production Server Runner
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

// If production build exists, serve static files
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));

  // SPA fallback
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  console.log('[ProdServer] "dist" folder not found. Run "npm run build" first to create static assets.');
}

app.listen(PORT, () => {
  console.log(`[Hamza Autos Server] Running in production mode on http://localhost:${PORT}`);
  console.log(`[Storage] Database-Free File Storage active in storage/*.json`);
});
