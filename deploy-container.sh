#!/bin/bash

# Deploy container-based Cloudflare Worker
# This script builds and pushes the container, then deploys the worker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check for required environment variables
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    print_error "CLOUDFLARE_API_TOKEN environment variable is not set"
    print_info "Please set: export CLOUDFLARE_API_TOKEN='your-token'"
    exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    print_error "CLOUDFLARE_ACCOUNT_ID environment variable is not set"
    print_info "Please set: export CLOUDFLARE_ACCOUNT_ID='599cb66ab5c235bb62eb59dc77ed2f42'"
    exit 1
fi

# Parse command line arguments
WORKER_NAME=""
SKIP_CONTAINER_BUILD=false
CONTAINER_TAG="latest"

while [[ $# -gt 0 ]]; do
    case $1 in
        --worker)
            WORKER_NAME="$2"
            shift 2
            ;;
        --skip-container)
            SKIP_CONTAINER_BUILD=true
            shift
            ;;
        --tag)
            CONTAINER_TAG="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --worker <name>      Specify worker to deploy (default: all container-based workers)"
            echo "  --skip-container     Skip container build and push"
            echo "  --tag <tag>          Container tag to use (default: latest)"
            echo "  --help               Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Build and push container if not skipped
if [ "$SKIP_CONTAINER_BUILD" = false ]; then
    print_status "Building and pushing container image..."
    
    # Check if we're in the right directory
    if [ -f "sandbox-image/build-and-push.sh" ]; then
        cd sandbox-image
        ./build-and-push.sh
        cd ..
    else
        print_error "Cannot find sandbox-image/build-and-push.sh"
        print_info "Please run this script from the project root directory"
        exit 1
    fi
else
    print_info "Skipping container build (--skip-container flag set)"
fi

# Function to check if wrangler.toml uses containers
uses_container() {
    local wrangler_file=$1
    grep -q "^\[containers\]" "$wrangler_file" || grep -q "^image = " "$wrangler_file"
}

# Function to deploy a worker with container
deploy_worker() {
    local worker_name=$1
    local wrangler_file=$2
    
    print_status "Deploying $worker_name using $wrangler_file..."
    
    # Check if this worker uses containers
    if ! uses_container "$wrangler_file"; then
        print_warning "$worker_name does not use containers, skipping..."
        return
    fi
    
    # Deploy the worker
    if [ -f "$wrangler_file" ]; then
        wrangler deploy --config "$wrangler_file"
        print_status "$worker_name deployed successfully!"
    else
        print_error "Wrangler config not found: $wrangler_file"
        return 1
    fi
}

# Deploy workers
print_status "Deploying container-based workers..."

if [ -n "$WORKER_NAME" ]; then
    # Deploy specific worker
    case $WORKER_NAME in
        "cozy-worker")
            deploy_worker "cozy-worker" "apps/worker/wrangler.toml"
            ;;
        *)
            print_error "Unknown worker: $WORKER_NAME"
            exit 1
            ;;
    esac
else
    # Deploy all container-based workers
    print_info "Looking for container-based workers to deploy..."
    
    # Check main worker
    if [ -f "apps/worker/wrangler.toml" ] && uses_container "apps/worker/wrangler.toml"; then
        deploy_worker "cozy-worker" "apps/worker/wrangler.toml"
    fi
    
    # Check for other workers that might use containers
    for wrangler_file in $(find . -name "wrangler*.toml" -not -path "*/node_modules/*"); do
        if uses_container "$wrangler_file"; then
            worker_name=$(basename "$wrangler_file" .toml)
            print_info "Found container-based worker config: $wrangler_file"
            deploy_worker "$worker_name" "$wrangler_file"
        fi
    done
fi

print_status "Container deployment complete!"
print_info "Container tag used: cozy-sandbox:$CONTAINER_TAG"

# List deployed workers
print_status "Listing deployed workers..."
wrangler deployments list