export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        message: 'Cozy Worker is running',
        container: 'configured',
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Claude Code endpoint
    if (url.pathname === '/container/claude' && request.method === 'POST') {
      try {
        const { prompt, apiKey } = await request.json();
        
        return new Response(JSON.stringify({
          message: 'Claude Code endpoint ready',
          prompt: prompt,
          status: 'Container support configured',
          note: 'Full implementation requires container deployment'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Default response
    return new Response(JSON.stringify({
      message: 'Cozy Cloud API',
      endpoints: [
        'GET /health',
        'POST /container/claude',
        'POST /container/execute',
        'POST /container/file'
      ],
      documentation: 'https://cozy-frontend.botnet-599.workers.dev'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};