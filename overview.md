# Cozy Cloud - Browser-Hosted Claude Code Platform

## Executive Summary

**Cozy Cloud provides every developer with a browser-hosted version of Claude Code.**

We're building a platform that runs [Claude Code](https://claude.ai/code) - Anthropic's official AI coding assistant - directly in your browser through isolated containers. Developers can bring their own GitHub repos and use Claude Code in browser terminals that spin up in seconds, run anywhere in the world, and cost pennies.

### What is Claude Code?

Claude Code is Anthropic's AI-powered coding assistant that can:
- Read, write, and edit code across multiple files
- Execute commands and run code
- Search through codebases
- Create and manage development workflows
- Provide intelligent code analysis and suggestions

### How Cozy Cloud Hosts Claude Code

Cozy Cloud integrates the [Claude Code SDK](https://docs.anthropic.com/en/docs/claude-code) into Cloudflare Containers, providing:
- **Instant Access**: No local installation of Claude Code CLI required
- **Browser-Based**: Full Claude Code functionality through a web interface
- **Persistent Workspaces**: Your code and Claude sessions persist across browser sessions
- **BYOK (Bring Your Own Key)**: Users provide their own Anthropic API key
- **GitHub Integration**: Clone and work on your repos seamlessly

## Key Innovation

Instead of requiring developers to:
1. Install Node.js locally
2. Install Claude Code CLI (`npm install -g @anthropic-ai/claude-code`)
3. Set up API keys in terminal
4. Manage local file system access

**Cozy Cloud provides all of this pre-configured in a browser-based container**, making Claude Code accessible from any device with a web browser.

## Market Position

### Competitors
- **Replit**: General-purpose cloud IDE
- **Lovable**: AI-first development platform
- **Jules.google**: Google's AI coding assistant
- **OpenAI Codex**: OpenAI's code generation API
- **Bolt.new**: StackBlitz's AI development platform
- **v0.dev**: Vercel's AI code generation tool

### Our Differentiator
We're the **first platform to offer hosted Claude Code** with full SDK capabilities, providing the complete Claude Code experience without local setup.

## Product Objectives

- ✅ **Authenticate and bring your own repo** - Clone from GitHub with one click
- ✅ **Instant first-run** - <3s cold start, sub-second warm starts
- ✅ **Full Linux environment** - Python 3.12, Node 22, Bash, Git, pip, npm, plus Claude Code SDK pre-installed
- ✅ **Zero local setup** - Run from browser, `cozy-js` SDK, or `cozy-py` SDK
- ✅ **Claude Code Integration** - Full Claude Code CLI and SDK functionality

## Architecture Overview

```
┌─────────┐           ┌──────────────────────┐
│ Browser │──HTTP────▶│  Worker (Hono)       │
└─────────┘           │  • SSR React         │
                      │  • tRPC API          │
                      │  • Auth & billing    │
                      └──────┬───────────────┘
                             │ getContainer()
                             ▼
                  ┌────────────────────────────┐
                  │ Cloudflare Container       │
                  │  • Debian-slim image       │
                  │  • 1 GiB / ¼ vCPU          │
                  │  • Claude Code SDK         │
                  │  • @anthropic-ai/claude-code│
                  │  • Git, Python, Node.js    │
                  └────────────────────────────┘
                             │ Claude Code output (WS)
                             ▼
                       Browser IDE Interface
```

### Claude Code Integration Details

Each container includes:
- **Claude Code CLI**: Pre-installed `@anthropic-ai/claude-code` package
- **SDK Runtime**: Both TypeScript and Python Claude Code SDKs
- **API Key Management**: Secure injection of user's Anthropic API key
- **Session Persistence**: Claude conversation history maintained across container restarts
- **Tool Access**: All Claude Code tools (Read, Write, Bash, Search, etc.) enabled

## Technical Stack

### Frontend - Claude Code IDE Interface
- **TanStack Start** (React 19 RSC) streamed from Worker
- **Monaco Editor** for code editing with Claude suggestions
- **Xterm.js** for terminal output from Claude Code
- **Tailwind UI Kit** for consistent design
- **Jotai** for Claude session state management
- **TanStack Query** for API state and Claude response caching

### Backend - Worker Layer
- **Hono Router** with zod schema validation
- **tRPC 12** for typed procedure calls
- **BetterAuth** for user authentication
- **Claude Code SDK Integration**:
  ```typescript
  import { query } from "@anthropic-ai/claude-code";
  
  // Execute Claude Code in container
  async for (const message of query({
    prompt: userPrompt,
    cwd: '/workspace',
    options: { maxTurns: 10 }
  })) {
    // Stream to browser via WebSocket
  }
  ```

### Container Runtime - Claude Code Environment
- **Base Image**: `ghcr.io/cozycloud/claude-code:latest`
  - Debian 12-slim foundation
  - Node.js 22 (for Claude Code CLI)
  - Python 3.12.3 (for Python SDK)
  - Git, npm, pip, pipx pre-installed
  - Claude Code CLI globally installed
- **Workspace**: `/workspace` mounted volume (4 GiB)
- **Environment Variables**:
  - `ANTHROPIC_API_KEY`: User's API key (encrypted)
  - `CLAUDE_SESSION_ID`: Persistent session identifier
  - `COZY_WORKSPACE_ID`: Workspace identifier

## Data & Storage

### D1 Database Schema
```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  anthropic_api_key_encrypted TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claude sessions
CREATE TABLE claude_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  workspace_id TEXT,
  conversation_history JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP
);

-- Usage tracking
CREATE TABLE usage (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  claude_tokens_used INTEGER,
  container_cpu_seconds REAL,
  container_gb_seconds REAL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### R2 Storage
- `workspaces/{user_id}/{workspace_id}/` - User code files
- `claude-sessions/{session_id}/` - Claude conversation snapshots
- `container-snapshots/{workspace_id}/{timestamp}.tar.gz` - Full container state

## Claude Code Features Supported

### Core Functionality
- ✅ **Multi-file editing** - Claude can read, write, and edit across your entire project
- ✅ **Command execution** - Run bash commands, install packages, execute code
- ✅ **Code search** - Use Grep and Glob tools to search codebases
- ✅ **Web fetch** - Claude can fetch and analyze web content
- ✅ **Persistent sessions** - Continue conversations across browser sessions
- ✅ **MCP support** - Extend Claude with Model Context Protocol servers

### Claude Code Tools Available
- `Read` - Read files from the workspace
- `Write` - Create and modify files
- `Edit` / `MultiEdit` - Make precise code changes
- `Bash` - Execute shell commands
- `Grep` / `Glob` - Search through code
- `WebSearch` / `WebFetch` - Access web resources
- `TodoRead` / `TodoWrite` - Task management
- Custom MCP tools via configuration

## Pricing & Billing

### Free Tier
- 200 CPU-minutes of Claude Code usage
- 2 GiB-hours memory
- 50 workspace snapshots/month
- Requires your own Anthropic API key

### Pro Tier - $20/month
- Unlimited CPU time for Claude Code
- 10 concurrent workspaces
- Unlimited snapshots
- Priority container startup
- Plus pay-as-you-go for excess usage

### Usage Calculation
```
Monthly Cost = Base Fee + Σ(
  container_cpu_seconds × $0.000020 +
  container_gb_seconds × $0.0000025 +
  claude_api_tokens × anthropic_rates
)
```

## Security & Compliance

### API Key Security
- User Anthropic API keys encrypted with AES-GCM
- Keys never logged or exposed in container
- Secure key injection at container runtime

### Container Isolation
- Each user gets isolated containers
- No cross-container communication
- Seccomp and AppArmor hardening
- Non-root container execution

### Data Privacy
- User code never leaves their container
- Claude conversations encrypted at rest
- GDPR-compliant data handling
- SOC-2 compliance roadmap (Q1 2026)

## Roadmap

### Phase 1: MVP (Weeks 0-2)
- [x] Turborepo setup with TanStack Start
- [ ] Basic Worker with Claude Code SDK integration
- [ ] Container image with Claude Code CLI
- [ ] Simple web IDE interface
- [ ] GitHub authentication

### Phase 2: Core Features (Weeks 3-5)
- [ ] Full Claude Code SDK integration
- [ ] WebSocket streaming for real-time output
- [ ] File tree and Monaco editor
- [ ] Workspace persistence
- [ ] Multi-file editing support

### Phase 3: Production Ready (Weeks 6-8)
- [ ] Snapshot/restore functionality
- [ ] Billing integration with Stripe
- [ ] Usage tracking and limits
- [ ] Public documentation site
- [ ] SDK releases (cozy-js, cozy-py)

### Phase 4: Scale (Weeks 9-10)
- [ ] Performance optimization
- [ ] Global container deployment
- [ ] Enterprise features
- [ ] Team collaboration
- [ ] Public beta launch

### Future Enhancements
- **Q3 2025**: Multi-cursor collaboration, shared Claude sessions
- **Q4 2025**: GPU containers for ML workloads, enterprise SSO
- **2026**: Self-hosted option, EU-only deployment option

## Open Questions

1. **Claude Rate Limits**: Should we implement API key pooling for organizations?
2. **Container Lifecycle**: Is 5-minute sleep optimal, or should we keep containers warm longer?
3. **Scaling Strategy**: When Cloudflare raises the 40 vCPU limit, do we still need E2B fallback?
4. **Pricing Model**: Should we charge for Claude API usage or let users handle it directly?

## Getting Started

```bash
# Clone the repository
git clone https://github.com/cozycloud/cozy.git
cd cozy

# Install dependencies with Bun
bun install

# Run development environment
bun dev

# Deploy to Cloudflare
bun run deploy
```

## Contact & Support

- Documentation: https://cozy.dev/docs
- GitHub: https://github.com/cozycloud/cozy
- Support: support@cozy.dev
- Discord: https://discord.gg/cozycloud

---

**Cozy Cloud**: Making Claude Code accessible to every developer, everywhere.