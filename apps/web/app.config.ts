import { defineConfig } from '@tanstack/start/config'
import { cloudflare } from 'unenv'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    preset: 'cloudflare-module',
    unenv: cloudflare,
    output: 'dist',
  },
  vite: {
    plugins: [
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
    ssr: {
      external: ['@cloudflare/kv-asset-handler'],
    },
  },
  routers: {
    ssr: {
      entry: './app/entry-server.tsx',
    },
    client: {
      entry: './app/entry-client.tsx',
    },
  },
})