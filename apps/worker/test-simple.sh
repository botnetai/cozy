#!/bin/bash

echo "Testing deployed worker..."
echo ""

# Test with different possible URLs
URLS=(
  "https://cozy-worker.botnet-599.workers.dev"
  "https://api.cozy.cloud"
  "https://cozy-worker.workers.dev"
)

for url in "${URLS[@]}"; do
  echo "Testing $url/health..."
  response=$(curl -s -w "\n%{http_code}" "$url/health" 2>/dev/null || echo "FAILED")
  
  if [[ "$response" != "FAILED" ]]; then
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    echo "HTTP Status: $http_code"
    if [[ "$http_code" == "200" ]]; then
      echo "Response: $body"
      echo "✅ Success!"
      break
    else
      echo "❌ Failed with status $http_code"
    fi
  else
    echo "❌ Connection failed"
  fi
  echo ""
done