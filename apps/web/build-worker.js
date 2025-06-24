import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

// Build client
await build({
  plugins: [
    react(),
    tsconfigPaths(),
    TanStackRouterVite(),
  ],
  build: {
    outDir: 'dist/client',
    manifest: true,
    rollupOptions: {
      input: './index.html',
    },
  },
});

// Build server for Cloudflare Workers
await build({
  plugins: [
    react(),
    tsconfigPaths(),
    TanStackRouterVite(),
  ],
  build: {
    ssr: true,
    outDir: 'dist/server',
    target: 'esnext',
    rollupOptions: {
      input: './worker-entry.ts',
      output: {
        format: 'es',
      },
    },
  },
});