#!/bin/bash
echo "Deploying Cozy Worker..."

# Deploy without TypeScript compilation for now
wrangler deploy \
  --name cozy-worker \
  --compatibility-date 2025-01-01 \
  --compatibility-flags nodejs_compat \
  --no-bundle \
  src/index.ts

echo "Worker deployed to: https://cozy-worker.botnet-599.workers.dev"