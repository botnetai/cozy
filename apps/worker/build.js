import { build } from 'esbuild'
import { readFileSync } from 'fs'

// Build the worker bundle
async function buildWorker() {
  try {
    await build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      outfile: 'dist/worker.js',
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      minify: true,
      sourcemap: false,
      conditions: ['worker', 'browser'],
      mainFields: ['module', 'main'],
      external: ['node:*'],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      loader: {
        '.ts': 'ts',
      },
    })
    console.log('Worker built successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildWorker()