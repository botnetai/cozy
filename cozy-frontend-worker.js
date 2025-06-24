export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // API proxy to backend
    if (url.pathname.startsWith('/api/')) {
      const backendUrl = `https://cozy-backend.botnet-599.workers.dev${url.pathname.replace('/api', '')}`;
      return fetch(backendUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
    }

    // Main app HTML
    return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cozy Cloud - Browser-Hosted Claude Code</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
    }
    
    .header {
      background: #1e293b;
      border-bottom: 1px solid #334155;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #38bdf8;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .hero {
      text-align: center;
      padding: 4rem 0;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      background: linear-gradient(to right, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero p {
      font-size: 1.25rem;
      color: #94a3b8;
      margin-bottom: 2rem;
    }
    
    .buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
      display: inline-block;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
    }
    
    .btn-primary:hover {
      background: #2563eb;
    }
    
    .btn-secondary {
      background: #334155;
      color: #e2e8f0;
    }
    
    .btn-secondary:hover {
      background: #475569;
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 4rem;
    }
    
    .feature {
      background: #1e293b;
      padding: 2rem;
      border-radius: 0.75rem;
      border: 1px solid #334155;
    }
    
    .feature h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #38bdf8;
    }
    
    .feature p {
      color: #94a3b8;
      line-height: 1.6;
    }
    
    .status {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-top: 2rem;
      text-align: center;
    }
    
    .status-indicator {
      display: inline-block;
      width: 10px;
      height: 10px;
      background: #10b981;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">⚡ Cozy Cloud</div>
    <nav>
      <a href="#" class="btn btn-secondary">Dashboard</a>
    </nav>
  </div>
  
  <div class="container">
    <div class="hero">
      <h1>Claude Code in Your Browser</h1>
      <p>No setup required. Just sign in and start coding with AI.</p>
      
      <div class="buttons">
        <a href="/dashboard" class="btn btn-primary">Get Started</a>
        <a href="/docs" class="btn btn-secondary">Documentation</a>
      </div>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>🤖 Claude Code SDK</h3>
        <p>Full access to Anthropic's Claude Code assistant with all tools and capabilities pre-installed.</p>
      </div>
      
      <div class="feature">
        <h3>☁️ Cloud Containers</h3>
        <p>Isolated development environments powered by Cloudflare Workers. Your code runs securely in the cloud.</p>
      </div>
      
      <div class="feature">
        <h3>🚀 Instant Setup</h3>
        <p>No local installation needed. Open your browser and start coding immediately with Claude's help.</p>
      </div>
    </div>
    
    <div class="status">
      <span class="status-indicator"></span>
      <span>All systems operational</span>
    </div>
  </div>
  
  <script>
    // Check backend health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('Backend status:', data);
      })
      .catch(err => {
        console.error('Backend health check failed:', err);
        document.querySelector('.status-indicator').style.background = '#ef4444';
        document.querySelector('.status span:last-child').textContent = 'Backend unavailable';
      });
  </script>
</body>
</html>
    `, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
};