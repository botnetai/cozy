import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
  ],
  build: {
    rollupOptions: {
      input: './index.html',
    },
  },
})