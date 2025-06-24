// Test file for Claude Code integration

async function testClaudeCode() {
  const baseUrl = 'http://localhost:8787'
  
  // Test Claude Code execution
  console.log('Testing Claude Code execution...')
  const claudeResponse = await fetch(`${baseUrl}/container/claude`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Anthropic-Api-Key': process.env.ANTHROPIC_API_KEY || '',
      'X-Workspace-Id': 'test-workspace'
    },
    body: JSON.stringify({
      prompt: 'Write a simple Python function that returns the factorial of a number'
    })
  })
  
  const claudeResult = await claudeResponse.json()
  console.log('Claude Code result:', claudeResult)
  
  // Test code execution
  console.log('\nTesting code execution...')
  const codeResponse = await fetch(`${baseUrl}/container/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Anthropic-Api-Key': process.env.ANTHROPIC_API_KEY || '',
      'X-Workspace-Id': 'test-workspace'
    },
    body: JSON.stringify({
      language: 'python',
      code: 'print("Hello from Cozy Container!")'
    })
  })
  
  const codeResult = await codeResponse.json()
  console.log('Code execution result:', codeResult)
  
  // Test file operations
  console.log('\nTesting file operations...')
  const fileResponse = await fetch(`${baseUrl}/container/file`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Anthropic-Api-Key': process.env.ANTHROPIC_API_KEY || '',
      'X-Workspace-Id': 'test-workspace'
    },
    body: JSON.stringify({
      operation: 'write',
      path: 'test.txt',
      content: 'Hello from Cozy!'
    })
  })
  
  const fileResult = await fileResponse.json()
  console.log('File operation result:', fileResult)
}

// Run tests
testClaudeCode().catch(console.error)