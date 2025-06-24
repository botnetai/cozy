# Cozy Cloud Tasks

## Project Status
Building a browser-hosted Claude Code platform using Cloudflare Workers and Containers.

## Completed Tasks ✅
- [x] Initialize Turborepo monorepo structure
- [x] Set up workspace configuration with Bun
- [x] Create apps/worker with Hono and tRPC
- [x] Create apps/web with TanStack Start and React 19
- [x] Set up packages/tsconfig with shared TypeScript configurations
- [x] Create packages/ui with basic Button and Card components
- [x] Set up packages/sdk-js with TypeScript SDK structure
- [x] Set up packages/sdk-py with Python SDK structure
- [x] Create sandbox-image with Dockerfile for container runtime
- [x] Configure ESLint and Prettier
- [x] Set up Tailwind CSS in web app
- [x] Create basic routes (/, /app, /pricing, /docs, /dashboard)
- [x] Configure git repository
- [x] Create PROJECT_OVERVIEW.md with full architecture documentation
- [x] Create overview.md emphasizing Claude Code hosting

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
- [ ] Claude Code executes in container
- [ ] API key encryption/decryption works
- [ ] WebSocket streams output correctly
- [ ] File operations persist across sessions
- [ ] Container snapshots restore properly
- [ ] Usage tracking is accurate
- [ ] Billing calculations are correct

## Deployment Checklist 🚀
- [ ] Environment variables configured
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