# Cozy Project Overview

## Project Description
Cozy is a modern container runtime platform built on Cloudflare Workers that provides secure code execution environments. It allows developers to run code in isolated containers with a simple API and SDKs for multiple languages.

## Architecture

### Monorepo Structure (Turborepo)
- **apps/worker**: Cloudflare Worker API with Hono framework and tRPC
- **apps/web**: TanStack Start React app with React 19 and RSC
- **packages/sdk-js**: JavaScript/TypeScript SDK
- **packages/sdk-py**: Python SDK
- **packages/ui**: Shared UI components library
- **packages/tsconfig**: Shared TypeScript configurations
- **sandbox-image**: Docker container image for code runtime

### Tech Stack
- **Backend**: Cloudflare Workers, Hono, tRPC, Container bindings
- **Frontend**: TanStack Start, React 19, Tailwind CSS, TypeScript
- **Build Tools**: Turborepo, Bun, Vite, ESBuild
- **Infrastructure**: Cloudflare Workers, Docker containers

### Key Features
1. Secure code execution in isolated containers
2. Type-safe API with tRPC
3. Multi-language support (JavaScript, Python, TypeScript)
4. React 19 with Server Components
5. SDKs for JavaScript and Python
6. Shared UI component library

## Development Setup

### Prerequisites
- Bun (latest version)
- Docker (for container images)
- Cloudflare account

### Commands
- `bun install`: Install dependencies
- `bun dev`: Run all apps in development
- `bun build`: Build all packages
- `bun lint`: Run linting
- `bun format`: Format code

## Deployment
- Worker: Deploy to Cloudflare Workers using `wrangler deploy`
- Web: Build and deploy static assets to Cloudflare Workers
- Container: Build and push Docker images for sandbox runtime