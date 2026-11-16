/**
 * Hamza Autos - Express Application Configuration
 * Integrates directly with Vite Dev Server and Standalone Production Node Runner
 */

import express, { Express } from 'express';
import path from 'path';
import { apiRouter } from './routes';
import { ensureInitialSeedFiles } from './seedData';
import { UPLOADS_DIR } from './fileStore';

export function createServerApp(): Express {
  const app = express();

  // Parse JSON payloads up to 50MB (supports base64 image uploads)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Seed storage files on startup
  ensureInitialSeedFiles().catch(err => {
    console.error('[Server Error] Seed initialization failed:', err);
  });

  // Serve uploads directory publicly
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Mount API router
  app.use('/api', apiRouter);

  return app;
}
