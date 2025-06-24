# Cozy Cloud Testing Guide

This guide provides comprehensive instructions for testing the Cozy Cloud platform, including the container runtime, Claude Code integration, and API endpoints.

## Prerequisites

1. **Required Software**
   - Bun (latest version) - Install from https://bun.sh
   - Docker Desktop - For building and running containers
   - Cloudflare account - For worker deployment
   - Anthropic API key - For Claude Code functionality

2. **Environment Setup**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd cozy

   # Install dependencies using Bun
   bun install

   # Set up environment variables
   export ANTHROPIC_API_KEY="your-anthropic-api-key"
   export CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"
   export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
   ```

## Building and Running the Container

### 1. Build the Container Locally

```bash
# Navigate to the sandbox-image directory
cd sandbox-image

# Build the container locally
bun run build:local

# Or build using the script directly
./build.sh
```

### 2. Push to Cloudflare Registry (for production)

```bash
# Login to Cloudflare registry
bun run login

# Build and push to registry
bun run build
```

### 3. Verify Container Build

```bash
# List Docker images to confirm build
docker images | grep cozy-sandbox

# Test the container locally
docker run -it --rm \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  -e WORKSPACE_ID=test-workspace \
  cozy-sandbox:latest \
  /bin/bash

# Inside container, verify Claude Code is installed
claude-code --version
python -c "import claude_code; print('Claude Code Python SDK installed')"
```

## Starting the Development Server

### 1. Start All Services

```bash
# From the root directory, start all services
bun dev
```

This will start:
- Worker API on http://localhost:8787
- Web app on http://localhost:3000

### 2. Start Individual Services

```bash
# Start only the worker
cd apps/worker
bun dev

# Start only the web app
cd apps/web
bun dev
```

## Testing Claude Code Integration

### 1. Basic API Test

```bash
# Test health endpoint
curl http://localhost:8787/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

### 2. Claude Code Execution Test

Create a file `test-claude-integration.ts`:

```typescript
// test-claude-integration.ts
async function testClaudeIntegration() {
  const baseUrl = 'http://localhost:8787'
  
  // Test 1: Execute Claude Code
  console.log('🧪 Test 1: Claude Code Execution')
  try {
    const response = await fetch(`${baseUrl}/container/claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Anthropic-Api-Key': process.env.ANTHROPIC_API_KEY || '',
        'X-Workspace-Id': 'test-workspace-' + Date.now()
      },
      body: JSON.stringify({
        prompt: 'Create a Python function that calculates the fibonacci sequence up to n terms'
      })
    })
    
    const result = await response.json()
    console.log('✅ Claude response:', result)
  } catch (error) {
    console.error('❌ Claude test failed:', error)
  }

  // Test 2: Direct Code Execution
  console.log('\n🧪 Test 2: Direct Code Execution')
  try {
    const response = await fetch(`${baseUrl}/container/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Anthropic-Api-Key': process.env.ANTHROPIC_API_KEY || '',
        'X-Workspace-Id': 'test-workspace-' + Date.now()
      },
      body: JSON.stringify({
        language: 'python',
        code: `
def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    else:
        fib_seq = [0, 1]
        for i in range(2, n):
            fib_seq.append(fib_seq[-1] + fib_seq[-2])
        return fib_seq

print(fibonacci(10))
        `
      })
    })
    
    const result = await response.json()
    console.log('✅ Execution result:', result)
  } catch (error) {
    console.error('❌ Execution test failed:', error)
  }

  // Test 3: File Operations
  console.log('\n🧪 Test 3: File Operations')
  try {
    const workspaceId = 'test-workspace-' + Date.now()
    
    // Write file
    const writeResponse = await fetch(`${baseUrl}/container/file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Anthropic-Api-Key': process.env.ANTHROPIC_API_KEY || '',
        'X-Workspace-Id': workspaceId
      },
      body: JSON.stringify({
        operation: 'write',
        path: 'test-data.json',
        content: JSON.stringify({ message: 'Hello from Cozy!', timestamp: new Date() }, null, 2)
      })
    })
    
    const writeResult = await writeResponse.json()
    console.log('✅ File write result:', writeResult)
    
    // Read file
    const readResponse = await fetch(`${baseUrl}/container/file`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Anthropic-Api-Key': process.env.ANTHROPIC_API_KEY || '',
        'X-Workspace-Id': workspaceId
      },
      body: JSON.stringify({
        operation: 'read',
        path: 'test-data.json'
      })
    })
    
    const readResult = await readResponse.json()
    console.log('✅ File read result:', readResult)
  } catch (error) {
    console.error('❌ File operation test failed:', error)
  }

  // Test 4: TypeScript Execution
  console.log('\n🧪 Test 4: TypeScript Execution')
  try {
    const response = await fetch(`${baseUrl}/container/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Anthropic-Api-Key': process.env.ANTHROPIC_API_KEY || '',
        'X-Workspace-Id': 'test-workspace-' + Date.now()
      },
      body: JSON.stringify({
        language: 'typescript',
        code: `
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

console.log('Users:', users);
console.log('First user:', users[0]);
        `
      })
    })
    
    const result = await response.json()
    console.log('✅ TypeScript execution result:', result)
  } catch (error) {
    console.error('❌ TypeScript test failed:', error)
  }
}

// Run the tests
console.log('🚀 Starting Cozy Cloud integration tests...\n')
testClaudeIntegration()
  .then(() => console.log('\n✅ All tests completed!'))
  .catch(console.error)
```

Run the test:
```bash
bun run test-claude-integration.ts
```

### 3. Using the Existing Test Script

```bash
# Run the existing test script
cd apps/worker
bun run test-claude.ts
```

## Testing with tRPC Client

Create a file `test-trpc-client.ts`:

```typescript
// test-trpc-client.ts
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from './apps/worker/src/trpc/router'

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8787/trpc',
      headers() {
        return {
          'X-Anthropic-Api-Key': process.env.ANTHROPIC_API_KEY || '',
          'X-Workspace-Id': 'test-workspace-' + Date.now()
        }
      }
    })
  ],
  transformer: superjson
})

async function testTRPCClient() {
  // Test health check
  const health = await client.health.query()
  console.log('Health check:', health)

  // Test Claude Code execution
  const claudeResult = await client.container.executeClaudeCode.mutate({
    prompt: 'Write a function to reverse a string in JavaScript'
  })
  console.log('Claude result:', claudeResult)

  // Test code execution
  const codeResult = await client.container.executeCode.mutate({
    language: 'javascript',
    code: 'console.log("Hello from tRPC!")'
  })
  console.log('Code result:', codeResult)
}

testTRPCClient().catch(console.error)
```

## Testing the Web Application

1. **Access the Web App**
   ```bash
   # Start the development server
   bun dev

   # Open in browser
   open http://localhost:3000
   ```

2. **Test Features**
   - Navigate through pages (Dashboard, Docs, Pricing)
   - Test the Claude Code playground (if implemented)
   - Verify API integration

## Common Issues and Troubleshooting

### 1. Container Build Fails

```bash
# Check Docker daemon is running
docker info

# Clean Docker cache and rebuild
docker system prune -a
cd sandbox-image
bun run build:local
```

### 2. Worker Fails to Start

```bash
# Check wrangler configuration
cd apps/worker
cat wrangler.toml

# Verify container binding
# Ensure [[containers]] section exists with proper configuration

# Try running with debug logging
WRANGLER_LOG=debug bun dev
```

### 3. Claude Code Not Working

```bash
# Verify API key
echo $ANTHROPIC_API_KEY

# Test API key directly
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-sonnet-20240229",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 4. File Operations Failing

```bash
# Check container permissions
docker run -it --rm cozy-sandbox:latest ls -la /home/sandboxuser/workspace

# Verify workspace directory exists and is writable
docker run -it --rm cozy-sandbox:latest \
  sh -c "touch /home/sandboxuser/workspace/test.txt && echo 'Success'"
```

## Performance Testing

Create a file `test-performance.ts`:

```typescript
// test-performance.ts
async function runPerformanceTest() {
  const baseUrl = 'http://localhost:8787'
  const iterations = 10
  const results = []

  console.log(`Running ${iterations} iterations...`)

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    
    await fetch(`${baseUrl}/container/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Anthropic-Api-Key': process.env.ANTHROPIC_API_KEY || '',
        'X-Workspace-Id': `perf-test-${i}`
      },
      body: JSON.stringify({
        language: 'javascript',
        code: 'console.log("Performance test " + ' + i + ')'
      })
    })
    
    const end = performance.now()
    const duration = end - start
    results.push(duration)
    console.log(`Iteration ${i + 1}: ${duration.toFixed(2)}ms`)
  }

  const avg = results.reduce((a, b) => a + b, 0) / results.length
  const min = Math.min(...results)
  const max = Math.max(...results)

  console.log('\nPerformance Summary:')
  console.log(`Average: ${avg.toFixed(2)}ms`)
  console.log(`Min: ${min.toFixed(2)}ms`)
  console.log(`Max: ${max.toFixed(2)}ms`)
}

runPerformanceTest().catch(console.error)
```

## Next Steps

1. **Set up CI/CD testing pipeline**
2. **Add unit tests for individual components**
3. **Implement integration tests**
4. **Add monitoring and logging**
5. **Create load testing scenarios**

## Support

If you encounter issues:
1. Check the logs in `apps/worker` and `apps/web`
2. Verify all environment variables are set
3. Ensure Docker and Cloudflare services are running
4. Review the error messages and stack traces
5. Check the TASKS.md file for known issues

For additional help, refer to:
- [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
- [Claude Code documentation](https://docs.anthropic.com/claude-code)
- [TanStack Start documentation](https://tanstack.com/start)