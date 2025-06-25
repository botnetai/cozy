#!/bin/bash

echo "🚀 Deploying Container to Cloudflare"
echo "===================================="

# Export credentials
export CLOUDFLARE_API_TOKEN='SrXIuzVq-PF8G3jeDXTZ9WH26NMJRIQZCysvP5CE'
export CLOUDFLARE_ACCOUNT_ID='599cb66ab5c235bb62eb59dc77ed2f42'

# Check if container exists
echo "✅ Container built: cozy-sandbox:latest"
docker images | grep cozy-sandbox

# Push to Cloudflare
echo ""
echo "📤 Pushing to Cloudflare Container Registry..."
echo "Run this command:"
echo ""
echo "wrangler containers push cozy-sandbox:latest"
echo ""
echo "If it times out, try:"
echo "1. Check your internet connection"
echo "2. Make sure Docker is running"
echo "3. Try again with: wrangler containers push cozy-sandbox:latest --verbose"
echo ""
echo "Once pushed, deploy the worker:"
echo "cd apps/worker"
echo "wrangler deploy"