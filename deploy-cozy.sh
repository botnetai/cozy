#!/bin/bash

echo "🚀 Deploying Cozy Cloud Workers..."
echo ""

# Deploy Backend
echo "1️⃣  Deploying Backend (cozy-backend)..."
cd apps/worker
wrangler deploy -c wrangler-simple.toml --name cozy-backend

echo ""
echo "2️⃣  Deploying Frontend (cozy-frontend)..."
cd ../web
wrangler deploy -c wrangler-simple.toml --name cozy-frontend

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Your URLs:"
echo "   Backend API: https://cozy-backend.botnet-599.workers.dev"
echo "   Frontend:    https://cozy-frontend.botnet-599.workers.dev"
echo ""
echo "🧪 Test with:"
echo "   curl https://cozy-backend.botnet-599.workers.dev/health"