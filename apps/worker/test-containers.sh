#!/bin/bash

# Test Cloudflare Container endpoints

ENDPOINT="https://api.cozy.cloud"
API_KEY="test-api-key"

echo "🧪 Testing Cloudflare Container endpoints..."
echo ""

# Test Claude Code endpoint
echo "1. Testing Claude Code endpoint..."
curl -X POST "$ENDPOINT/container/claude" \
  -H "Content-Type: application/json" \
  -H "X-Anthropic-Api-Key: $API_KEY" \
  -H "X-Workspace-Id: test-workspace" \
  -d '{
    "prompt": "Write a hello world function in Python"
  }' | jq .

echo ""

# Test code execution endpoint
echo "2. Testing code execution endpoint..."
curl -X POST "$ENDPOINT/container/execute" \
  -H "Content-Type: application/json" \
  -H "X-Workspace-Id: test-workspace" \
  -d '{
    "language": "python",
    "code": "print(\"Hello from Cloudflare Container!\")"
  }' | jq .

echo ""

# Test file operations endpoint
echo "3. Testing file operations endpoint..."
curl -X POST "$ENDPOINT/container/file" \
  -H "Content-Type: application/json" \
  -H "X-Workspace-Id: test-workspace" \
  -d '{
    "operation": "write",
    "path": "test.txt",
    "content": "Hello from Cloudflare Container!"
  }' | jq .

echo ""

# Test file read
echo "4. Testing file read..."
curl -X POST "$ENDPOINT/container/file" \
  -H "Content-Type: application/json" \
  -H "X-Workspace-Id: test-workspace" \
  -d '{
    "operation": "read",
    "path": "test.txt"
  }' | jq .

echo ""
echo "✅ Container tests complete!"