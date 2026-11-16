/**
 * Hamza Autos - Express Application Configuration with High Performance Caching & Compression
 * Integrates directly with Vite Dev Server and Standalone Production Node Runner
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import zlib from 'zlib';
import { apiRouter } from './routes';
import { ensureInitialSeedFiles } from './seedData';
import { UPLOADS_DIR } from './fileStore';

export function createServerApp(): Express {
  const app = express();

  // 1. Built-in Gzip/Deflate HTTP Response Compression Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const acceptEncoding = (req.headers['accept-encoding'] as string) || '';
    if (!acceptEncoding) return next();

    const originalSend = res.send;
    res.send = function (body: any) {
      if (typeof body === 'string' || Buffer.isBuffer(body)) {
        const contentType = (res.getHeader('Content-Type') as string) || '';
        // Only compress text, json, html, css, js over 512 bytes
        if (!contentType.includes('image/') && body.length > 512) {
          if (acceptEncoding.includes('gzip')) {
            res.setHeader('Content-Encoding', 'gzip');
            res.removeHeader('Content-Length');
            const compressed = zlib.gzipSync(body, { level: 6 });
            return originalSend.call(this, compressed);
          } else if (acceptEncoding.includes('deflate')) {
            res.setHeader('Content-Encoding', 'deflate');
            res.removeHeader('Content-Length');
            const compressed = zlib.deflateSync(body, { level: 6 });
            return originalSend.call(this, compressed);
          }
        }
      }
      return originalSend.call(this, body);
    };
    next();
  });

  // 2. Performance & Smart Cache-Control Headers Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const pathUrl = req.path;

    // Public cached API endpoints
    if (req.method === 'GET' && (
      pathUrl.startsWith('/api/blogs') ||
      pathUrl.startsWith('/api/content') ||
      pathUrl.startsWith('/api/seo') ||
      pathUrl.startsWith('/api/forms/registry')
    )) {
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
    } else if (pathUrl.startsWith('/api/')) {
      // Sensitive or dynamic admin / submission endpoints
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    // Modern performance security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    next();
  });

  // Parse JSON payloads up to 50MB (supports base64 image uploads)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Seed storage files on startup
  ensureInitialSeedFiles().catch(err => {
    console.error('[Server Error] Seed initialization failed:', err);
  });

  // Serve uploads directory publicly with 30-day immutable caching
  app.use('/uploads', express.static(UPLOADS_DIR, {
    maxAge: '30d',
    immutable: true,
    etag: true
  }));

  // Mount API router
  app.use('/api', apiRouter);

  return app;
}
