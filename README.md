# Cozy - Container Runtime Platform

A modern container runtime platform built with Cloudflare Workers, providing secure code execution environments.

## Project Structure

This is a Turborepo monorepo with the following structure:

```
apps/
├── worker/     # Cloudflare Worker with Hono, tRPC, and container orchestration
└── web/        # TanStack Start React app (React 19 RSC)

packages/
├── sdk-js/     # JavaScript/TypeScript SDK
├── sdk-py/     # Python SDK
├── ui/         # Shared UI components
└── tsconfig/   # Shared TypeScript configurations

sandbox-image/  # Docker container image for code runtime
```

## Getting Started

### Prerequisites

- Bun (latest version)
- Docker (for building sandbox images)
- Cloudflare account (for Worker deployment)

### Installation

```bash
bun install
```

### Development

Run all apps in development mode:

```bash
bun dev
```

### Build

Build all packages:

```bash
bun build
```

## Apps

### Worker (`apps/worker`)

The main API built with:
- Hono framework
- tRPC for type-safe APIs
- Cloudflare Workers with container bindings

### Web (`apps/web`)

The web application built with:
- TanStack Start (React 19 with RSC)
- Tailwind CSS
- TypeScript

## SDKs

### JavaScript SDK (`packages/sdk-js`)

```typescript
import { createClient } from '@cozy/sdk-js'

const client = createClient({
  apiUrl: 'https://api.cozy.dev',
  apiKey: 'your-api-key'
})

const result = await client.executeCode('javascript', 'console.log("Hello!")')
```

### Python SDK (`packages/sdk-py`)

```python
from cozy import CozyClient

client = CozyClient(api_url="https://api.cozy.dev", api_key="your-api-key")
result = client.execute_code(language="python", code="print('Hello!')")
```

## License

MIT