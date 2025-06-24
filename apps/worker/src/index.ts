import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './trpc/router'
import { createContext } from './trpc/context'
import { CozyContainer } from './container'
import type { Env, ClaudeCodeRequest, CodeExecutionRequest, FileOperation, ContainerResponse } from './types'

const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('/*', cors())

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', environment: c.env.ENVIRONMENT })
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

    // Create container instance
    const container = new CozyContainer({ apiKey, workspaceId }, c.env.CONTAINER)
    await container.initialize()
    
    // Execute Claude Code
    const result = await container.executeClaudeCode(request.prompt)
    
    return c.json<ContainerResponse>({ 
      success: true, 
      data: { output: result },
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
    
    // Create container instance
    const container = new CozyContainer({ apiKey, workspaceId }, c.env.CONTAINER)
    await container.initialize()
    
    // Execute code
    const result = await container.executeCode(request.language, request.code)
    
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
    
    // Create container instance
    const container = new CozyContainer({ apiKey, workspaceId }, c.env.CONTAINER)
    await container.initialize()
    
    let result: any
    
    switch (request.operation) {
      case 'read':
        result = await container.readFile(request.path)
        break
      case 'write':
        if (!request.content) throw new Error('Content required for write operation')
        await container.writeFile(request.path, request.content)
        result = { message: 'File written successfully' }
        break
      case 'list':
        result = await container.listFiles(request.path)
        break
      case 'mkdir':
        await container.createDirectory(request.path)
        result = { message: 'Directory created successfully' }
        break
      default:
        throw new Error('Invalid file operation')
    }
    
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

export default app