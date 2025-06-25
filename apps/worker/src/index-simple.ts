import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './trpc/router'
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

// Claude Code execution endpoint (simplified - returns mock response)
app.post('/container/claude', async (c) => {
  const request = await c.req.json<ClaudeCodeRequest>()
  
  try {
    const apiKey = c.req.header('X-Anthropic-Api-Key') || ''
    
    if (!apiKey) {
      return c.json<ContainerResponse>({ 
        success: false, 
        error: 'API key required',
        timestamp: new Date().toISOString()
      }, 401)
    }

    // Mock response for now
    return c.json<ContainerResponse>({ 
      success: true, 
      data: { 
        output: `Mock response: Would execute Claude Code with prompt: "${request.prompt}"`,
        note: 'Container support requires Docker to be running locally for deployment'
      },
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

// Code execution endpoint (simplified)
app.post('/container/execute', async (c) => {
  const request = await c.req.json<CodeExecutionRequest>()
  
  try {
    // Mock response for now
    return c.json<ContainerResponse>({ 
      success: true, 
      data: {
        stdout: `Mock output: Would execute ${request.language} code`,
        stderr: '',
        exitCode: 0,
        note: 'Container support requires Docker to be running locally for deployment'
      },
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

// File operations endpoint (simplified)
app.post('/container/file', async (c) => {
  const request = await c.req.json<FileOperation>()
  
  try {
    // Mock response for now
    let result: any
    
    switch (request.operation) {
      case 'read':
        result = { 
          content: 'Mock file content',
          note: 'Container support requires Docker to be running locally for deployment'
        }
        break
      case 'write':
        result = { 
          message: 'Mock: File would be written',
          note: 'Container support requires Docker to be running locally for deployment'
        }
        break
      case 'list':
        result = { 
          files: ['mock-file1.txt', 'mock-file2.js'],
          note: 'Container support requires Docker to be running locally for deployment'
        }
        break
      case 'mkdir':
        result = { 
          message: 'Mock: Directory would be created',
          note: 'Container support requires Docker to be running locally for deployment'
        }
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