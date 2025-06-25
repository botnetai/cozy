#!/bin/bash

# Deploy script for the full TypeScript worker

echo "🚀 Deploying Cozy Worker (TypeScript)..."

# Set environment variables
export CLOUDFLARE_API_TOKEN="SrXIuzVq-PF8G3jeDXTZ9WH26NMJRIQZCysvP5CE"
export CLOUDFLARE_ACCOUNT_ID="599cb66ab5c235bb62eb59dc77ed2f42"

# Deploy the worker
echo "📦 Deploying worker..."
wrangler deploy \
  --name cozy-worker \
  --compatibility-date 2025-01-01 \
  --no-bundle \
  || { echo "❌ Deployment failed"; exit 1; }

echo "✅ Deployment complete!"
echo ""
echo "🔗 Worker URL: https://cozy-worker.jeremycai2001.workers.dev"
echo ""
echo "Test endpoints:"
echo "  - Health: https://cozy-worker.jeremycai2001.workers.dev/health"
echo "  - tRPC: https://cozy-worker.jeremycai2001.workers.dev/trpc"