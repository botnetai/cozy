#!/bin/bash

# Cozy Full Worker Deployment Script
# This deploys the complete TypeScript worker with tRPC and container support

echo "🚀 Deploying Cozy Full Worker..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Error: Must run from apps/worker directory"
    exit 1
fi

# Set environment variables
export CLOUDFLARE_API_TOKEN="SrXIuzVq-PF8G3jeDXTZ9WH26NMJRIQZCysvP5CE"
export CLOUDFLARE_ACCOUNT_ID="599cb66ab5c235bb62eb59dc77ed2f42"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Build TypeScript
echo "🔨 Type checking TypeScript..."
bun run build

# Deploy using wrangler
echo "🚀 Deploying to Cloudflare Workers..."
wrangler deploy

echo "✅ Deployment complete!"
echo ""
echo "🌐 Worker endpoints:"
echo "   - Health: https://cozy-worker.599cb66ab5c235bb62eb59dc77ed2f42.workers.dev/health"
echo "   - tRPC: https://cozy-worker.599cb66ab5c235bb62eb59dc77ed2f42.workers.dev/trpc/*"
echo "   - Claude: https://cozy-worker.599cb66ab5c235bb62eb59dc77ed2f42.workers.dev/container/claude"
echo "   - Execute: https://cozy-worker.599cb66ab5c235bb62eb59dc77ed2f42.workers.dev/container/execute"
echo "   - Files: https://cozy-worker.599cb66ab5c235bb62eb59dc77ed2f42.workers.dev/container/file"