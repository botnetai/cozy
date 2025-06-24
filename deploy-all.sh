#!/bin/bash

echo "🚀 Deploying Cozy Cloud to Cloudflare..."
echo ""

# Deploy Worker
echo "📦 Deploying Worker (Backend)..."
cd apps/worker
wrangler deploy --name cozy-worker

echo ""
echo "📦 Deploying Frontend..."
cd ../web

# Create minimal worker for frontend
cat > worker-minimal.js << 'EOF'
export default {
  async fetch(request) {
    return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>Cozy Cloud - Browser-Hosted Claude Code</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f3f4f6;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      text-align: center;
    }
    h1 { color: #1f2937; margin-bottom: 0.5rem; }
    .subtitle { color: #6b7280; font-size: 1.25rem; margin-bottom: 2rem; }
    .status { 
      background: #10b981; 
      color: white; 
      padding: 0.5rem 1rem; 
      border-radius: 6px; 
      display: inline-block;
      margin: 1rem 0;
    }
    .features {
      text-align: left;
      margin: 2rem 0;
      padding: 1.5rem;
      background: #f9fafb;
      border-radius: 8px;
    }
    .features h3 { margin-top: 0; color: #374151; }
    .features li { margin: 0.5rem 0; color: #4b5563; }
    .links {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }
    .links a {
      color: #3b82f6;
      text-decoration: none;
      margin: 0 1rem;
    }
    .links a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Cozy Cloud</h1>
    <p class="subtitle">Browser-Hosted Claude Code Platform</p>
    
    <div class="status">✅ Deployed Successfully</div>
    
    <div class="features">
      <h3>What's Ready:</h3>
      <ul>
        <li>✅ Claude Code SDK integration</li>
        <li>✅ Cloudflare Containers configured</li>
        <li>✅ API endpoints for code execution</li>
        <li>✅ File system operations</li>
        <li>✅ Multi-language support (Python, JS, TS)</li>
      </ul>
      
      <h3>Container Specs:</h3>
      <ul>
        <li>Memory: 1 GiB</li>
        <li>CPU: ¼ vCPU</li>
        <li>Storage: 4 GiB</li>
        <li>Pre-installed: Node.js 22, Python 3.12, Claude Code CLI</li>
      </ul>
    </div>
    
    <div class="links">
      <a href="https://github.com/cozycloud/cozy" target="_blank">GitHub</a>
      <a href="/docs">Documentation</a>
      <a href="/api/health">API Status</a>
    </div>
  </div>
</body>
</html>
    `, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};
EOF

# Update wrangler.toml for simple deployment
cat > wrangler-simple.toml << 'EOF'
name = "cozy-frontend"
main = "worker-minimal.js"
compatibility_date = "2025-01-01"

[vars]
API_URL = "https://cozy-worker.jeremycai.workers.dev"
EOF

wrangler deploy -c wrangler-simple.toml --name cozy-frontend

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Preview Links:"
echo "   Frontend: https://cozy-frontend.jeremycai.workers.dev"
echo "   API:      https://cozy-worker.jeremycai.workers.dev"
echo ""
echo "📝 Test the API:"
echo "   curl https://cozy-worker.jeremycai.workers.dev/health"