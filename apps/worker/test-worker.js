#!/usr/bin/env node

const WORKER_URL = 'https://cozy-worker.botnet-599.workers.dev';

async function testEndpoint(path, options = {}) {
  console.log(`\n🧪 Testing ${options.method || 'GET'} ${path}...`);
  
  try {
    const response = await fetch(`${WORKER_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    
    const text = await response.text();
    console.log(`📡 Status: ${response.status}`);
    console.log(`📄 Response: ${text}`);
    
    try {
      const json = JSON.parse(text);
      console.log('✅ Valid JSON response');
      return json;
    } catch {
      console.log('❌ Non-JSON response');
      return text;
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Testing Cozy Worker...');
  console.log(`📍 URL: ${WORKER_URL}`);
  
  // Test health endpoint
  await testEndpoint('/health');
  
  // Test tRPC hello
  await testEndpoint('/trpc/hello', {
    method: 'POST',
    body: { name: 'Test User' }
  });
  
  // Test container endpoints (should return 501 - not implemented)
  await testEndpoint('/container/claude', {
    method: 'POST',
    headers: {
      'X-Anthropic-Api-Key': 'test-key',
      'X-Workspace-Id': 'test-workspace'
    },
    body: { prompt: 'Hello Claude' }
  });
  
  await testEndpoint('/container/execute', {
    method: 'POST',
    body: {
      language: 'javascript',
      code: 'console.log("Hello from container")'
    }
  });
  
  console.log('\n✅ All tests completed!');
}

runTests().catch(console.error);