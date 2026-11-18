import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import { createServerApp } from './server/app';

function serverApiPlugin() {
  return {
    name: 'hamza-autos-api-server',
    configureServer(server: any) {
      const app = createServerApp();
      server.middlewares.use(app);
    }
  };
}

function copyIndexTo404Plugin() {
  return {
    name: 'copy-index-to-404',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      const notFoundPath = path.join(distDir, '404.html');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath);
      }
    }
  };
}

export default defineConfig(() => {
  return {
    base: process.env.NODE_ENV === 'production' ? '/hamza-autos/' : '/',
    plugins: [react(), tailwindcss(), serverApiPlugin(), copyIndexTo404Plugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 650,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/motion/')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'vendor-lucide';
            }
            if (id.includes('src/components/admin/') || id.includes('src/views/AdminView')) {
              return 'admin-suite';
            }
          }
        }
      }
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      fs: {
        deny: ['storage/**', '.env*', 'server/**']
      }
    },
  };
});
