#!/bin/bash

echo "🚀 Deploying Full TypeScript Worker..."

# Set environment variables
export CLOUDFLARE_API_TOKEN="SrXIuzVq-PF8G3jeDXTZ9WH26NMJRIQZCysvP5CE"
export CLOUDFLARE_ACCOUNT_ID="599cb66ab5c235bb62eb59dc77ed2f42"

# Create a test to check if the worker compiles
echo "📦 Testing TypeScript compilation..."
cd /Users/jeremycai/Projects/cozy/apps/worker
bun run typecheck || { echo "❌ TypeScript compilation failed"; exit 1; }

echo "✅ TypeScript check passed!"

# Deploy using wrangler with the correct configuration
echo "🚀 Deploying with wrangler..."

# Create a temporary wrangler.toml without container bindings
cat > wrangler-deploy.toml << EOF
name = "cozy-worker"
main = "src/index.ts"
compatibility_date = "2025-01-01"
account_id = "599cb66ab5c235bb62eb59dc77ed2f42"

# Enable node compatibility for certain modules
node_compat = true

# Environment variables
[vars]
ENVIRONMENT = "production"
EOF

# Deploy the worker
wrangler deploy --config wrangler-deploy.toml

# Clean up
rm wrangler-deploy.toml

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Worker URLs:"
echo "  - https://cozy-worker.botnet-599.workers.dev"
echo ""
echo "Testing deployment..."
sleep 5

# Test the deployment
echo ""
echo "🧪 Testing health endpoint..."
curl -s https://cozy-worker.botnet-599.workers.dev/health | jq '.' || echo "Failed to parse JSON response"