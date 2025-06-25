#!/usr/bin/env node
import { build } from 'esbuild'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

console.log('Building TypeScript worker...')

// Build the worker
build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/worker.js',
  platform: 'neutral',
  target: 'es2022',
  format: 'esm',
  minify: false,
  sourcemap: false,
  external: [
    '@cloudflare/containers'
  ],
  conditions: ['worker'],
  mainFields: ['module', 'main'],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}).then(() => {
  console.log('✅ Build successful!')
  
  // Read the built file and wrap it for Cloudflare Workers
  const workerCode = readFileSync('dist/worker.js', 'utf-8')
  
  // Create a deployment-ready worker file
  const deploymentCode = `
// Generated worker file
${workerCode}
`
  
  writeFileSync('worker-built.js', deploymentCode)
  console.log('✅ Created worker-built.js for deployment')
  
}).catch((error) => {
  console.error('❌ Build failed:', error)
  process.exit(1)
})