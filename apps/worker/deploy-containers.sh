#!/bin/bash

# Deploy Cloudflare Worker with Containers

echo "🚀 Deploying Cozy Worker with Cloudflare Containers..."

# Set API token
export CLOUDFLARE_API_TOKEN="SrXIuzVq-PF8G3jeDXTZ9WH26NMJRIQZCysvP5CE"

# Navigate to worker directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Build the worker
echo "🔨 Building worker..."
bun run build

# Deploy with wrangler
echo "🌐 Deploying to Cloudflare..."
bunx wrangler deploy

echo "✅ Deployment complete!"
echo ""
echo "Container endpoints available at:"
echo "  - POST https://api.cozy.cloud/container/claude"
echo "  - POST https://api.cozy.cloud/container/execute"
echo "  - POST https://api.cozy.cloud/container/file"