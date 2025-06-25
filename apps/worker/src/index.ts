import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './trpc/router'
import { createContext } from './trpc/context'
import type { Env, ClaudeCodeRequest, CodeExecutionRequest, FileOperation, ContainerResponse } from './types'

const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('/*', cors())

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', environment: c.env.ENVIRONMENT })
})

// Container routes - direct container access for testing
app.get('/container/:id', async (c) => {
  const containerId = c.req.param('id')
  const id = c.env.MY_CONTAINER.idFromName(containerId)
  const container = c.env.MY_CONTAINER.get(id)
  return await container.fetch(c.req.raw)
})

// Load balancer route
app.get('/lb', async (c) => {
  // Simple random selection between 3 containers
  const randomId = Math.floor(Math.random() * 3)
  const id = c.env.MY_CONTAINER.idFromName(`lb-${randomId}`)
  const container = c.env.MY_CONTAINER.get(id)
  return await container.fetch(c.req.raw)
})

// tRPC endpoint
app.all('/trpc/*', async (c) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: async () => {
      return {
        env: c.env,
        request: c.req.raw,
      }
    },
  })
})

// Claude Code execution endpoint
app.post('/container/claude', async (c) => {
  const request = await c.req.json<ClaudeCodeRequest>()
  
  try {
    // TODO: Get API key from user session/database
    const apiKey = c.req.header('X-Anthropic-Api-Key') || ''
    const workspaceId = c.req.header('X-Workspace-Id') || 'default'
    
    if (!apiKey) {
      return c.json<ContainerResponse>({ 
        success: false, 
        error: 'API key required',
        timestamp: new Date().toISOString()
      }, 401)
    }

    // Get Durable Object ID
    const id = c.env.MY_CONTAINER.idFromName(workspaceId)
    const container = c.env.MY_CONTAINER.get(id)
    
    // Forward request to Durable Object
    const response = await container.fetch(new Request('http://container/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: request.prompt, apiKey })
    }))
    
    const result = await response.json()
    
    return c.json<ContainerResponse>({ 
      success: true, 
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return c.json<ContainerResponse>({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, 500)
  }
})

// Code execution endpoint
app.post('/container/execute', async (c) => {
  const request = await c.req.json<CodeExecutionRequest>()
  
  try {
    const apiKey = c.req.header('X-Anthropic-Api-Key') || ''
    const workspaceId = c.req.header('X-Workspace-Id') || 'default'
    
    // Get Durable Object ID
    const id = c.env.MY_CONTAINER.idFromName(workspaceId)
    const container = c.env.MY_CONTAINER.get(id)
    
    // Forward request to Durable Object
    const response = await container.fetch(new Request('http://container/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language: request.language, code: request.code })
    }))
    
    const result = await response.json()
    
    return c.json<ContainerResponse>({ 
      success: true, 
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return c.json<ContainerResponse>({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, 500)
  }
})

// File operations endpoint
app.post('/container/file', async (c) => {
  const request = await c.req.json<FileOperation>()
  
  try {
    const apiKey = c.req.header('X-Anthropic-Api-Key') || ''
    const workspaceId = c.req.header('X-Workspace-Id') || 'default'
    
    // Get Durable Object ID
    const id = c.env.MY_CONTAINER.idFromName(workspaceId)
    const container = c.env.MY_CONTAINER.get(id)
    
    // Forward request to Durable Object
    const response = await container.fetch(new Request('http://container/file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    }))
    
    const result = await response.json()
    
    return c.json<ContainerResponse>({ 
      success: true, 
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return c.json<ContainerResponse>({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, 500)
  }
})

// Export the Container class from the container module
export { CozySandboxContainer } from './container'

export default app