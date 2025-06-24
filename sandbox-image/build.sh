#!/bin/bash

# Build script for Cozy sandbox container image

# Set variables
IMAGE_NAME="cozy-sandbox"
TAG="latest"
REGISTRY="registry.developers.cloudflare.com"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID}"

# Build the Docker image
echo "Building Docker image..."
docker build -t ${IMAGE_NAME}:${TAG} .

# Tag for Cloudflare registry if account ID is set
if [ -n "$ACCOUNT_ID" ]; then
    echo "Tagging for Cloudflare registry..."
    docker tag ${IMAGE_NAME}:${TAG} ${REGISTRY}/${ACCOUNT_ID}/${IMAGE_NAME}:${TAG}
    
    echo "Pushing to Cloudflare registry..."
    docker push ${REGISTRY}/${ACCOUNT_ID}/${IMAGE_NAME}:${TAG}
else
    echo "CLOUDFLARE_ACCOUNT_ID not set. Skipping registry push."
    echo "To push to registry, set CLOUDFLARE_ACCOUNT_ID environment variable."
fi

echo "Build complete!"