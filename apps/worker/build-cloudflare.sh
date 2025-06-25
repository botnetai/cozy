#!/bin/bash

echo "Building TypeScript worker for Cloudflare..."

# Build with Bun
bun build src/index.ts --target=browser --format=esm --outfile=worker-esm.js

# Create worker metadata
cat > metadata.json << EOF
{
  "main_module": "worker-esm.js",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"]
}
EOF

echo "✅ Build complete!"