# Container Deployment Guide

This guide covers the deployment of the Cozy sandbox container image to Cloudflare's container registry.

## Overview

The Cozy sandbox container provides a secure execution environment with:
- Node.js 22
- Python 3.12
- Claude Code CLI and SDK
- Common development tools

## Container Registry Details

- **Registry**: Cloudflare Container Registry (registry.cloudflare.com)
- **Container Name**: cozy-sandbox
- **Account ID**: 599cb66ab5c235bb62eb59dc77ed2f42
- **Max Image Size**: 2 GB
- **Total Registry Limit**: 50 GB

## Authentication

The Cloudflare API token must have the following permissions:
- Workers Scripts:Edit
- Account:Cloudflare Images:Edit

Set these environment variables:
```bash
export CLOUDFLARE_ACCOUNT_ID="599cb66ab5c235bb62eb59dc77ed2f42"
export CLOUDFLARE_API_TOKEN="your-api-token"
```

## Local Development

### Prerequisites
- Docker installed and running
- Wrangler CLI installed: `npm install -g wrangler`
- Cloudflare credentials configured

### Building and Pushing Manually

1. Navigate to the sandbox-image directory:
   ```bash
   cd sandbox-image
   ```

2. Run the build and push script:
   ```bash
   ./build-and-push.sh
   ```

This script will:
- Build the Docker image locally
- Tag it with multiple tags (latest, git hash, timestamp)
- Push all tags to Cloudflare Registry
- List all available images

### Using Wrangler Commands Directly

```bash
# Build and push in one command
wrangler containers build --push -t cozy-sandbox:latest .

# Or build locally and push separately
docker build -t cozy-sandbox:latest .
wrangler containers push cozy-sandbox:latest

# List images in registry
wrangler containers list

# Delete an image
wrangler containers delete cozy-sandbox:old-tag
```

## CI/CD with GitHub Actions

The container is automatically built and pushed when:
- Changes are pushed to the `main` branch in the `sandbox-image/` directory
- A pull request modifies files in `sandbox-image/`
- Manually triggered via GitHub Actions

### GitHub Secrets Required

Configure these secrets in your GitHub repository:
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token

### Workflow File

The workflow is defined in `.github/workflows/build-container.yml` and:
1. Sets up Docker buildx for multi-platform builds
2. Installs Wrangler CLI
3. Builds the container image
4. Tags with latest and commit SHA
5. Pushes to Cloudflare Registry
6. Lists available images

## Container Image Tags

The following tags are created for each build:
- `cozy-sandbox:latest` - Always points to the most recent build
- `cozy-sandbox:<git-hash>` - Tagged with the Git commit SHA
- `cozy-sandbox:<timestamp>` - Tagged with build timestamp (manual builds only)

## Using the Container in Workers

To use the container in a Cloudflare Worker, update your `wrangler.toml`:

```toml
name = "cozy-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# Container configuration
[containers]
image = "cozy-sandbox:latest"

# Or use a specific version
# image = "cozy-sandbox:abc123"
```

## Troubleshooting

### Docker Not Available
If Docker is not installed locally:
- Use GitHub Actions for building and pushing
- Or use a cloud-based Docker environment

### Authentication Errors
- Ensure your API token has the correct permissions
- Verify the account ID is correct
- Check that environment variables are properly set

### Image Size Limits
- Keep images under 2 GB
- Use multi-stage builds to reduce size
- Remove unnecessary packages and files

### Registry Space
- Monitor total registry usage with `wrangler containers list`
- Delete old images with `wrangler containers delete`
- Total limit is 50 GB per account

## Best Practices

1. **Version Control**: Always tag images with specific versions
2. **Security**: Never include secrets in the container image
3. **Size Optimization**: Use slim base images and multi-stage builds
4. **Testing**: Test containers locally before pushing
5. **Cleanup**: Regularly remove old, unused images

## Future Improvements

- Implement automated security scanning
- Add multi-platform builds (currently linux/amd64 only)
- Set up automatic cleanup of old images
- Add container signing for verification