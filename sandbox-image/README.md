# Cozy Sandbox Container

This directory contains the Docker image configuration for the Cozy sandbox runtime environment.

## Features

- **Node.js 22**: Latest LTS version for JavaScript/TypeScript execution
- **Python 3.12**: Modern Python runtime with pip
- **Claude Code CLI**: Pre-installed globally for AI-powered coding assistance
- **Claude Code Python SDK**: Available in the Python environment
- **Security**: Runs as non-root user with limited permissions
- **Workspace**: Dedicated `/home/sandboxuser/workspace` directory

## Building the Container

### Local Build
```bash
bun run build:local
```

### Build and Push to Cloudflare Registry
```bash
# Set your Cloudflare account ID and API token
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export CLOUDFLARE_API_TOKEN="your-api-token"

# Login to registry
bun run login

# Build and push
bun run build
```

## Container Specifications

- Memory: 1 GiB
- CPU: ¼ vCPU
- Base Image: node:22-slim
- Python: 3.12
- User: sandboxuser (non-root)

## Pre-installed Packages

### Global Node.js packages
- tsx (TypeScript execution)
- esbuild (Fast bundler)
- @anthropic-ai/claude-code-cli

### Python packages
- numpy
- pandas
- requests
- anthropic
- claude-code

## Environment Variables

- `ANTHROPIC_API_KEY`: Injected at runtime for Claude Code access
- `NODE_ENV`: Set to "production" in container
- `WORKSPACE_ID`: Unique identifier for the workspace

## Usage in Worker

The container is bound to the Worker through `wrangler.toml`:

```toml
[[containers]]
binding = "CONTAINER"
image = "cozy-sandbox"
tag = "latest"
```

Access it in your Worker code:

```typescript
const container = new CozyContainer({ apiKey, workspaceId }, env.CONTAINER)
await container.executeClaudeCode("Write a hello world function")
```