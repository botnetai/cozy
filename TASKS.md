# Cozy Cloud Tasks

## Project Status
Building a browser-hosted Claude Code platform using Cloudflare Workers and Containers.

## Completed Tasks ✅

### Initial Setup
- [x] Initialize Turborepo monorepo structure
- [x] Set up workspace configuration with Bun
- [x] Configure ESLint and Prettier
- [x] Configure git repository

### Documentation
- [x] Create PROJECT_OVERVIEW.md with full architecture documentation
- [x] Create overview.md emphasizing Claude Code hosting as core feature
- [x] Create comprehensive TESTING.md guide
- [x] Create deployment scripts and documentation

### Frontend (apps/web)
- [x] Create apps/web with TanStack Start and React 19
- [x] Set up Tailwind CSS in web app
- [x] Create basic routes (/, /app, /pricing, /docs, /dashboard)
- [x] Configure wrangler.toml for Cloudflare Workers deployment
- [x] Create simplified worker entry for deployment

### Backend (apps/worker)
- [x] Create apps/worker with Hono and tRPC
- [x] Integrate @anthropic-ai/claude-code SDK
- [x] Create CozyContainer wrapper class for container management
- [x] Implement REST API endpoints for Claude Code execution
- [x] Implement tRPC procedures for typed API calls
- [x] Configure container bindings in wrangler.toml
- [x] Add TypeScript types for container operations

### Container Setup (sandbox-image)
- [x] Create Dockerfile with Node.js 22 and Python 3.12
- [x] Install Claude Code CLI globally
- [x] Install Python Claude Code SDK
- [x] Configure workspace permissions
- [x] Set up ANTHROPIC_API_KEY environment variable support
- [x] Create build scripts for container image

### Packages
- [x] Set up packages/tsconfig with shared TypeScript configurations
- [x] Create packages/ui with basic Button and Card components
- [x] Set up packages/sdk-js with TypeScript SDK structure
- [x] Set up packages/sdk-py with Python SDK structure

## Current Sprint - Claude Code Integration 🚀

### High Priority
- [x] **Integrate Claude Code SDK in Worker**
  - [x] Add @anthropic-ai/claude-code to Worker dependencies
  - [x] Create Claude Code execution endpoints in tRPC
  - [ ] Implement API key management and encryption
  - [ ] Set up WebSocket for streaming Claude output

- [x] **Update Container Image for Claude Code**
  - [x] Install Claude Code CLI globally in Dockerfile
  - [x] Add Python Claude Code SDK
  - [x] Configure proper workspace permissions
  - [x] Set up environment for ANTHROPIC_API_KEY injection

- [ ] **Build Claude Code IDE Interface**
  - [ ] Integrate Monaco editor with Claude suggestions
  - [ ] Add Xterm.js for terminal output
  - [ ] Create Claude chat interface component
  - [ ] Implement file tree with Claude file operations

- [x] **Container Binding Setup**
  - [x] Create CozyContainer wrapper class
  - [x] Add container execution methods
  - [x] Implement file operations in container
  - [x] Configure wrangler.toml container bindings

- [ ] **Container Lifecycle Management**
  - [ ] Implement getContainer() with Durable Objects
  - [ ] Add container start/stop/restart functionality
  - [ ] Create snapshot/restore for workspaces
  - [ ] Handle container sleep/wake based on activity

### Medium Priority
- [ ] **Authentication & User Management**
  - [ ] Implement BetterAuth with cookie sessions
  - [ ] Add GitHub OAuth for repo cloning
  - [ ] Create user settings for API key storage
  - [ ] Add session management for Claude conversations

- [ ] **D1 Database Setup**
  - [ ] Create users table with encrypted API keys
  - [ ] Add claude_sessions table for conversation history
  - [ ] Implement usage tracking table
  - [ ] Add workspace metadata storage

- [ ] **WebSocket Communication**
  - [ ] Set up WebSocket server in Worker
  - [ ] Stream Claude Code output to browser
  - [ ] Handle bidirectional communication
  - [ ] Add reconnection logic

### Low Priority
- [ ] **R2 Storage Implementation**
  - [ ] Set up workspace file storage
  - [ ] Implement container snapshot uploads
  - [ ] Add Claude session persistence
  - [ ] Create cleanup routines

- [ ] **Billing & Usage Tracking**
  - [ ] Create BillingMeter Durable Object
  - [ ] Track container CPU/memory usage
  - [ ] Count Claude API token usage
  - [ ] Integrate Stripe for payments

## Week-by-Week Roadmap 📅

### Week 1-2 (Current)
- Complete Claude Code SDK integration in Worker
- Update container image with Claude Code
- Basic IDE interface with Monaco and terminal

### Week 3-4
- Full container lifecycle management
- WebSocket streaming implementation
- Authentication system

### Week 5-6
- Database schema and models
- R2 storage for persistence
- Usage tracking foundation

### Week 7-8
- Billing integration
- Production deployment setup
- Performance optimization

### Week 9-10
- SDK releases (cozy-js, cozy-py)
- Documentation site
- Public beta launch

## Testing Checklist 🧪
- [x] Comprehensive testing guide created (TESTING.md)
- [x] Test scripts for Claude Code integration
- [x] Performance testing script
- [x] tRPC client testing script
- [x] Quick start script for easy testing
- [ ] Claude Code executes in container
- [ ] API key encryption/decryption works
- [ ] WebSocket streams output correctly
- [ ] File operations persist across sessions
- [ ] Container snapshots restore properly
- [ ] Usage tracking is accurate
- [ ] Billing calculations are correct

## Deployment Status 🚀

### Completed Deployments
- [✅] **cozy-backend** (Worker with Claude Code integration)
  - [x] Backend worker deployed at cozy-backend.botnet-599.workers.dev
  - [x] Container configuration in /apps/worker/wrangler.toml
  - [x] Container bindings configured
  - [x] API endpoints ready for Claude Code execution

### Container Deployment
- [🔄] **cozy-sandbox** (Cloudflare Container)
  - [x] Dockerfile created with Node.js 22 and Python 3.12
  - [x] Claude Code CLI and SDK installed
  - [x] Container configuration in wrangler.toml
  - [x] Created deployment documentation (CONTAINER_DEPLOYMENT.md)
  - [x] GitHub Actions workflow for automated deployment
  - [⚠️] Requires Docker for building/pushing (not available locally)
  
### Deployment Files Created
- `/apps/worker/wrangler.toml` - Worker config with container bindings
- `/sandbox-image/Dockerfile` - Container image definition
- `/deploy-container.sh` - Container deployment script
- `/.github/workflows/deploy-container.yml` - GitHub Actions workflow
- `/CONTAINER_DEPLOYMENT.md` - Deployment documentation
- Various deployment scripts (deploy-cozy.sh, deploy-with-token.sh)

### Target URLs
- Backend: https://cozy-backend.botnet-599.workers.dev ✅
- Container Registry: registry.cloudflare.com/599cb66ab5c235bb62eb59dc77ed2f42/cozy-sandbox

## Deployment Checklist 🚀
- [x] Environment variables configured
- [x] Cloudflare API token and account ID added
- [ ] Successfully deploy to Cloudflare Workers
- [ ] Cloudflare secrets set (D1, R2, KV)
- [ ] Container registry configured
- [ ] Domain and routing set up
- [ ] SSL certificates active
- [ ] Monitoring dashboards created
- [ ] Error tracking enabled

## Future Enhancements 💡
- [ ] Multi-cursor collaboration (Liveblocks)
- [ ] Claude conversation sharing
- [ ] GPU container support
- [ ] Enterprise SSO (SAML/OIDC)
- [ ] Self-hosted deployment option
- [ ] EU-only container regions
- [ ] VS Code extension
- [ ] IntelliJ plugin
- [ ] Mobile app (React Native)

## Notes 📝
- Using Cloudflare Containers beta (basic tier: 1 GiB / ¼ vCPU)
- Claude Code SDK requires Node.js 18+ in container
- API keys stored encrypted in D1 using libsodium
- WebSocket connections limited to 1 per user initially
- Container sleep after 5 minutes of inactivity