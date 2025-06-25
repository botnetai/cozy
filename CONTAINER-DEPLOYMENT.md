# Cloudflare Container Deployment Guide

## Overview

This guide documents the process for deploying Cloudflare Containers with their native container support as documented at https://developers.cloudflare.com/containers/get-started/

## Current Status

### ✅ Completed
1. Updated wrangler.toml configuration for containers
2. Created Durable Object class (CozySandboxContainer) as required
3. Created container server implementation
4. Updated Dockerfile for container runtime
5. Fixed compatibility flags (nodejs_compat instead of node_compat)

### ❌ Blockers
1. **Docker Requirement**: Cloudflare Containers require Docker to be running locally to build and push container images. The error message states:
   ```
   The Docker CLI could not be launched. Please ensure that the Docker CLI is installed and the daemon is running.
   ```

2. **Container Registry**: Cloudflare uses its own container registry that requires Docker to push images during deployment

## Container Configuration

### wrangler.toml
```toml
name = "cozy-worker"
main = "src/index.ts"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]
account_id = "599cb66ab5c235bb62eb59dc77ed2f42"

# Container configuration
[[containers]]
max_instances = 10
name = "cozy-sandbox"
class_name = "CozySandboxContainer"
image = "../../sandbox-image/Dockerfile"

# Durable Object binding for container
[[durable_objects.bindings]]
name = "CONTAINER"
class_name = "CozySandboxContainer"

# Migration for Durable Object
[[migrations]]
tag = "v1"
new_sqlite_classes = ["CozySandboxContainer"]
```

### Durable Object Implementation
Located at: `/apps/worker/src/durable-objects/CozySandboxContainer.ts`

This class handles:
- Container lifecycle management
- Request forwarding to container
- API key management for Claude Code SDK

### Container Server
Located at: `/sandbox-image/server.js`

Runs on port 8080 and provides:
- `/execute` - Code execution endpoint
- `/claude` - Claude Code SDK endpoint
- `/file` - File operations endpoint

### Dockerfile
Located at: `/sandbox-image/Dockerfile`

Includes:
- Node.js 22
- Python 3.12
- Claude Code CLI and SDK
- Non-root user for security

## Deployment Instructions

1. **Install Docker**: Ensure Docker Desktop is installed and running locally

2. **Set API Token**:
   ```bash
   export CLOUDFLARE_API_TOKEN="SrXIuzVq-PF8G3jeDXTZ9WH26NMJRIQZCysvP5CE"
   ```

3. **Deploy**:
   ```bash
   bunx wrangler deploy
   ```

The deployment process will:
- Build the container image using Docker
- Push to Cloudflare's container registry
- Deploy the worker with container bindings
- Provision container instances

## Alternative Deployment

A simplified version without containers has been deployed at:
- https://cozy-worker.botnet-599.workers.dev

This version returns mock responses and can be used for testing the API structure.

## Testing

Once deployed with Docker, test the endpoints:

```bash
# Test health check
curl https://api.cozy.cloud/health

# Test Claude Code execution
curl -X POST https://api.cozy.cloud/container/claude \
  -H "Content-Type: application/json" \
  -H "X-Anthropic-Api-Key: YOUR_API_KEY" \
  -d '{"prompt": "Write a hello world function"}'

# Test code execution
curl -X POST https://api.cozy.cloud/container/execute \
  -H "Content-Type: application/json" \
  -d '{"language": "python", "code": "print(\"Hello\")"}'
```

## Next Steps

To complete the deployment:
1. Install Docker on a machine with deployment access
2. Run the deployment script: `./deploy-containers.sh`
3. Configure the zone_id for custom domain routing if needed
4. Test container execution with real Claude Code SDK

## Resources
- [Cloudflare Containers Documentation](https://developers.cloudflare.com/containers/)
- [Wrangler Documentation](https://developers.cloudflare.com/workers/wrangler/)
- API Token: SrXIuzVq-PF8G3jeDXTZ9WH26NMJRIQZCysvP5CE
- Account ID: 599cb66ab5c235bb62eb59dc77ed2f42