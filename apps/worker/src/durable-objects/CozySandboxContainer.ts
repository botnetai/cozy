// Durable Object class for Cloudflare Containers

export class CozySandboxContainer {
  private state: DurableObjectState
  private env: any

  constructor(state: DurableObjectState, env: any) {
    this.state = state
    this.env = env
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    
    // Handle different paths for container operations
    switch (url.pathname) {
      case '/execute':
        return this.handleExecute(request)
      case '/claude':
        return this.handleClaude(request)
      case '/file':
        return this.handleFileOperation(request)
      case '/health':
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      default:
        return new Response('Not Found', { status: 404 })
    }
  }

  private async handleExecute(request: Request): Promise<Response> {
    try {
      const body = await request.json() as { language: string; code: string }
      
      // Forward to container
      const containerResponse = await fetch('http://localhost:8080/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language: body.language, code: body.code })
      })
      
      return containerResponse
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  private async handleClaude(request: Request): Promise<Response> {
    try {
      const body = await request.json() as { prompt: string; apiKey: string }
      
      // Forward to container with API key in headers
      const containerResponse = await fetch('http://localhost:8080/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Anthropic-Api-Key': body.apiKey
        },
        body: JSON.stringify({ prompt: body.prompt })
      })
      
      return containerResponse
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }

  private async handleFileOperation(request: Request): Promise<Response> {
    try {
      const fileOp = await request.json()
      
      // Forward to container
      const containerResponse = await fetch('http://localhost:8080/file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileOp)
      })
      
      return containerResponse
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}