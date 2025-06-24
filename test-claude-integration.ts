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