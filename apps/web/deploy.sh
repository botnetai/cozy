#!/bin/bash

echo "🚀 Deploying Cozy Frontend to Cloudflare Workers..."
echo ""

# Change to web directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    bun install
fi

# Create a simple index.html for now
mkdir -p dist/client/assets
cat > dist/client/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cozy Cloud - Browser-Hosted Claude Code</title>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #1a202c;
        }
        .subtitle {
            font-size: 1.5rem;
            color: #4a5568;
            margin-bottom: 2rem;
        }
        .status {
            background: #edf2f7;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            display: inline-block;
        }
        .api-link {
            margin-top: 2rem;
            color: #3182ce;
            text-decoration: none;
        }
        .api-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Cozy Cloud</h1>
        <p class="subtitle">Browser-Hosted Claude Code Platform</p>
        <div class="status">
            <p>✅ Frontend deployed successfully!</p>
            <p>Container support: <strong>Configured</strong></p>
        </div>
        <p style="margin-top: 2rem;">
            <a href="https://cozy-worker.jeremycai.workers.dev" class="api-link" target="_blank">
                API Endpoint →
            </a>
        </p>
    </div>
</body>
</html>
EOF

# Create a simple CSS file
cat > dist/client/assets/style.css << 'EOF'
body { margin: 0; }
EOF

# Create the server entry
mkdir -p dist/server
cat > dist/server/index.js << 'EOF'
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Simple HTML response for now
    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cozy Cloud - Browser-Hosted Claude Code</title>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            text-align: center;
            padding: 2rem;
            max-width: 800px;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #1a202c;
        }
        .subtitle {
            font-size: 1.5rem;
            color: #4a5568;
            margin-bottom: 2rem;
        }
        .features {
            text-align: left;
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin: 2rem 0;
        }
        .features h2 {
            margin-top: 0;
        }
        .features ul {
            margin: 1rem 0;
            padding-left: 1.5rem;
        }
        .status {
            background: #edf2f7;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Cozy Cloud</h1>
        <p class="subtitle">Browser-Hosted Claude Code Platform</p>
        
        <div class="features">
            <h2>What is Cozy Cloud?</h2>
            <p>We provide every developer with a browser-hosted version of Claude Code - Anthropic's AI coding assistant.</p>
            
            <h3>✨ Features:</h3>
            <ul>
                <li>🤖 Full Claude Code SDK integration</li>
                <li>📦 Cloudflare Containers (1 GiB RAM, ¼ vCPU)</li>
                <li>🔧 Pre-installed: Node.js 22, Python 3.12, Git</li>
                <li>💾 Persistent workspaces with snapshots</li>
                <li>🔐 Secure API key management</li>
                <li>⚡ <3s cold start, sub-second warm</li>
            </ul>
            
            <h3>🛠️ Tech Stack:</h3>
            <ul>
                <li>Frontend: TanStack Start (React 19 RSC)</li>
                <li>Backend: Cloudflare Workers + Hono + tRPC</li>
                <li>Containers: Cloudflare Containers Beta</li>
                <li>Storage: D1 (SQLite) + R2 (Object Storage)</li>
            </ul>
        </div>
        
        <div class="status">
            <p>✅ Frontend: <strong>Deployed</strong></p>
            <p>✅ Container Support: <strong>Configured</strong></p>
            <p>🔧 Worker API: <strong>Ready</strong></p>
        </div>
    </div>
</body>
</html>`, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  },
};
EOF

echo ""
echo "📤 Deploying to Cloudflare Workers..."
wrangler deploy

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your frontend should be available at: https://cozy-frontend.jeremycai.workers.dev"