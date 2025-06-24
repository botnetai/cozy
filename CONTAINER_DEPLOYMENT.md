# Cloudflare Container Deployment Guide for Cozy Cloud

## Overview
This guide provides instructions for deploying the Cozy Cloud sandbox container to Cloudflare Workers with container support.

## Prerequisites
- Docker installed on your deployment machine
- Cloudflare API Token with appropriate permissions
- wrangler CLI installed (`bun install -g wrangler`)

## Container Configuration
The container configuration is already set up in `/apps/worker/wrangler.toml`:
```toml
[[containers]]
binding = "CONTAINER"
image = "cozy-sandbox"
tag = "latest"

[containers.limits]
memory = 1024  # 1 GiB
cpu = 0.25     # ¼ vCPU

[containers.env]
NODE_ENV = "production"
```

## Deployment Steps

### 1. Build and Push Container (requires Docker)
From a machine with Docker installed:

```bash
# Clone the repository if needed
git clone <repository-url>
cd cozy

# Set environment variables
export CLOUDFLARE_API_TOKEN="SrXIuzVq-PF8G3jeDXTZ9WH26NMJRIQZCysvP5CE"
export CLOUDFLARE_ACCOUNT_ID="599cb66ab5c235bb62eb59dc77ed2f42"

# Build the container
cd sandbox-image
docker build -t cozy-sandbox:latest .

# Tag for Cloudflare registry
docker tag cozy-sandbox:latest registry.cloudflare.com/$CLOUDFLARE_ACCOUNT_ID/cozy-sandbox:latest

# Login to Cloudflare registry
echo $CLOUDFLARE_API_TOKEN | docker login registry.cloudflare.com -u _json_key --password-stdin

# Push the image
docker push registry.cloudflare.com/$CLOUDFLARE_ACCOUNT_ID/cozy-sandbox:latest
```

### 2. Deploy the Worker
After the container is pushed:

```bash
# Navigate to worker directory
cd ../apps/worker

# Deploy with container bindings
wrangler deploy
```

## Container Features
The sandbox container includes:
- Node.js 22
- Python 3.12
- Claude Code CLI and SDK
- Common Python packages (numpy, pandas, requests)
- Non-root user for security
- 1 GiB memory and ¼ vCPU allocation

## Testing Container Execution
Once deployed, test the container integration:

```bash
# Test Claude Code execution endpoint
curl -X POST https://cozy-backend.botnet-599.workers.dev/api/claude/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello from container!\")",
    "language": "python"
  }'
```

## Troubleshooting

### Container Not Starting
- Check that the image was successfully pushed to the registry
- Verify the container binding name matches in both wrangler.toml and your Worker code
- Check Worker logs: `wrangler tail`

### Permission Issues
- Ensure the API token has the necessary permissions for container registry access
- Verify the account ID is correct

### Performance Issues
- Container cold starts take several minutes on first deployment
- Subsequent starts are faster due to caching
- Consider increasing memory/CPU limits if needed

## Alternative: Using GitHub Actions
If you cannot run Docker locally, consider setting up a GitHub Action for automated deployment:

```yaml
name: Deploy Container
on:
  push:
    branches: [main]
    paths:
      - 'sandbox-image/**'
      - 'apps/worker/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push container
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        run: |
          cd sandbox-image
          docker build -t cozy-sandbox:latest .
          docker tag cozy-sandbox:latest registry.cloudflare.com/$CLOUDFLARE_ACCOUNT_ID/cozy-sandbox:latest
          echo $CLOUDFLARE_API_TOKEN | docker login registry.cloudflare.com -u _json_key --password-stdin
          docker push registry.cloudflare.com/$CLOUDFLARE_ACCOUNT_ID/cozy-sandbox:latest
      
      - name: Deploy Worker
        run: |
          cd apps/worker
          npx wrangler deploy
```

## Next Steps
1. Deploy the container from a Docker-enabled environment
2. Test Claude Code execution in the container
3. Monitor performance and adjust resource limits as needed
4. Set up automated deployment pipeline