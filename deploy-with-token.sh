#!/bin/bash

echo "🚀 Deploying Cozy Backend with API Token..."

# Set environment variables
export CLOUDFLARE_API_TOKEN="SrXIuzVq-PF8G3jeDXTZ9WH26NMJRIQZCysvP5CE"
export CLOUDFLARE_ACCOUNT_ID="599cb66ab5c235bb62eb59dc77ed2f42"

# Kill any stuck wrangler processes
pkill -f wrangler 2>/dev/null

# Navigate to worker directory
cd apps/worker

# Deploy with explicit timeout
timeout 30s wrangler deploy -c wrangler-simple.toml --name cozy-backend

if [ $? -eq 0 ]; then
    echo "✅ Backend deployed successfully!"
    echo "🌐 URL: https://cozy-backend.botnet-599.workers.dev"
else
    echo "❌ Deployment failed or timed out"
    echo "Try running manually with:"
    echo "CLOUDFLARE_API_TOKEN='SrXIuzVq-PF8G3jeDXTZ9WH26NMJRIQZCysvP5CE' wrangler deploy -c wrangler-simple.toml"
fi