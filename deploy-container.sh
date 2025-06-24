#!/bin/bash

# Cloudflare Container Deployment Script for Cozy Cloud
# This script builds and deploys the sandbox container to Cloudflare

set -e

echo "🚀 Starting Cloudflare Container deployment for Cozy Cloud..."

# Configuration
ACCOUNT_ID="599cb66ab5c235bb62eb59dc77ed2f42"
API_TOKEN="SrXIuzVq-PF8G3jeDXTZ9WH26NMJRIQZCysvP5CE"
CONTAINER_NAME="cozy-sandbox"
CONTAINER_TAG="latest"
WORKER_NAME="cozy-worker"

# Set up environment
export CLOUDFLARE_API_TOKEN=$API_TOKEN
export CLOUDFLARE_ACCOUNT_ID=$ACCOUNT_ID

# Change to project root
cd "$(dirname "$0")"

echo "📦 Building container image..."
cd sandbox-image

# Build the Docker image
docker build -t $CONTAINER_NAME:$CONTAINER_TAG .

echo "🏷️ Tagging image for Cloudflare registry..."
# Tag for Cloudflare's registry
docker tag $CONTAINER_NAME:$CONTAINER_TAG registry.cloudflare.com/$ACCOUNT_ID/$CONTAINER_NAME:$CONTAINER_TAG

echo "🔐 Logging into Cloudflare registry..."
# Login to Cloudflare's Docker registry
echo $API_TOKEN | docker login registry.cloudflare.com -u _json_key --password-stdin

echo "📤 Pushing image to Cloudflare registry..."
# Push the image
docker push registry.cloudflare.com/$ACCOUNT_ID/$CONTAINER_NAME:$CONTAINER_TAG

echo "✅ Container pushed successfully!"

# Go back to project root
cd ..

echo "🚀 Deploying worker with container bindings..."
cd apps/worker

# Deploy the worker with container support
wrangler deploy --compatibility-date 2025-01-01

echo "✅ Worker deployed successfully with container support!"
echo "🎉 Deployment complete!"
echo ""
echo "Worker URL: https://$WORKER_NAME.botnet-599.workers.dev"
echo "Container: $CONTAINER_NAME:$CONTAINER_TAG"