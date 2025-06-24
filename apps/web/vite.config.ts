import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    TanStackRouterVite(),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html',
    },
  },
  ssr: {
    target: 'webworker',
    noExternal: true,
  },
})