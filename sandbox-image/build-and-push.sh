#!/bin/bash

# Build and push container image to Cloudflare Registry
# This script requires Docker and Wrangler to be installed

set -e

# Configuration
IMAGE_NAME="cozy-sandbox"
DOCKERFILE_PATH="./Dockerfile"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[STATUS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker to build container images."
    exit 1
fi

# Check if Wrangler is installed
if ! command -v wrangler &> /dev/null; then
    print_error "Wrangler is not installed. Please install with: npm install -g wrangler"
    exit 1
fi

# Check if Cloudflare credentials are set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    print_error "CLOUDFLARE_API_TOKEN environment variable is not set"
    exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    print_error "CLOUDFLARE_ACCOUNT_ID environment variable is not set"
    exit 1
fi

# Get the current git commit hash (if in a git repo)
GIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Tags to use
LATEST_TAG="${IMAGE_NAME}:latest"
GIT_TAG="${IMAGE_NAME}:${GIT_HASH}"
TIMESTAMP_TAG="${IMAGE_NAME}:${TIMESTAMP}"

print_status "Building container image..."
docker build -t ${LATEST_TAG} -f ${DOCKERFILE_PATH} .

# Tag the image with additional tags
print_status "Tagging image..."
docker tag ${LATEST_TAG} ${GIT_TAG}
docker tag ${LATEST_TAG} ${TIMESTAMP_TAG}

# Push to Cloudflare Registry
print_status "Pushing to Cloudflare Registry..."
print_status "Pushing ${LATEST_TAG}..."
wrangler containers push ${LATEST_TAG}

print_status "Pushing ${GIT_TAG}..."
wrangler containers push ${GIT_TAG}

print_status "Pushing ${TIMESTAMP_TAG}..."
wrangler containers push ${TIMESTAMP_TAG}

# List images in registry
print_status "Listing images in registry..."
wrangler containers list

print_status "Container image successfully built and pushed to Cloudflare Registry!"
print_status "Available tags:"
echo "  - ${LATEST_TAG}"
echo "  - ${GIT_TAG}"
echo "  - ${TIMESTAMP_TAG}"