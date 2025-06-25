# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Cozy project.

## Workflows

### build-container.yml

Automatically builds and pushes the Cozy sandbox container image to Cloudflare's container registry.

**Triggers:**
- Push to `main` branch when files in `sandbox-image/` are modified
- Pull requests that modify `sandbox-image/` files
- Manual workflow dispatch

**Required Secrets:**
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_API_TOKEN`: API token with Workers Scripts:Edit and Cloudflare Images:Edit permissions

**What it does:**
1. Checks out the repository
2. Sets up Docker buildx for efficient builds
3. Installs Node.js and Wrangler CLI
4. Builds the Docker image locally
5. Tags the image with:
   - `cozy-sandbox:latest`
   - `cozy-sandbox:<commit-sha>`
6. Pushes all tags to Cloudflare Registry
7. Lists all available images in the registry

## Setting Up GitHub Secrets

1. Go to your GitHub repository settings
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add the following secrets:
   - Name: `CLOUDFLARE_ACCOUNT_ID`
     Value: `599cb66ab5c235bb62eb59dc77ed2f42`
   - Name: `CLOUDFLARE_API_TOKEN`
     Value: Your Cloudflare API token

## Manual Workflow Dispatch

To manually trigger the container build:

1. Go to Actions tab in GitHub
2. Select "Build and Push Container to Cloudflare Registry"
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Monitoring Builds

- Check the Actions tab for build status
- Green checkmark = successful build and push
- Red X = build or push failed
- Click on a workflow run to see detailed logs

## Troubleshooting

If the workflow fails:

1. **Authentication errors**: Verify GitHub secrets are set correctly
2. **Docker build errors**: Check the Dockerfile syntax and base image availability
3. **Push errors**: Ensure the API token has correct permissions
4. **Size limits**: Make sure the image is under 2 GB

## Future Enhancements

- Add container security scanning
- Implement automatic cleanup of old images
- Add notifications for failed builds
- Support for multi-platform builds