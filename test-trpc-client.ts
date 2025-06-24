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
  console.log('🧪 Testing tRPC Client...\n')

  // Test 1: Health check
  console.log('Test 1: Health Check')
  try {
    const health = await client.health.query()
    console.log('✅ Health check:', health)
  } catch (error) {
    console.error('❌ Health check failed:', error)
  }

  // Test 2: Claude Code execution
  console.log('\nTest 2: Claude Code Execution')
  try {
    const claudeResult = await client.container.executeClaudeCode.mutate({
      prompt: 'Write a function to reverse a string in JavaScript'
    })
    console.log('✅ Claude result:', claudeResult)
  } catch (error) {
    console.error('❌ Claude execution failed:', error)
  }

  // Test 3: Direct code execution
  console.log('\nTest 3: Direct Code Execution')
  try {
    const codeResult = await client.container.executeCode.mutate({
      language: 'javascript',
      code: 'console.log("Hello from tRPC!")'
    })
    console.log('✅ Code result:', codeResult)
  } catch (error) {
    console.error('❌ Code execution failed:', error)
  }

  // Test 4: File operations
  console.log('\nTest 4: File Operations')
  try {
    // Write file
    const writeResult = await client.container.writeFile.mutate({
      path: 'test-trpc.txt',
      content: 'Hello from tRPC client test!'
    })
    console.log('✅ Write result:', writeResult)

    // Read file
    const readResult = await client.container.readFile.query({
      path: 'test-trpc.txt'
    })
    console.log('✅ Read result:', readResult)
  } catch (error) {
    console.error('❌ File operations failed:', error)
  }

  console.log('\n✅ All tRPC tests completed!')
}

testTRPCClient().catch(console.error)