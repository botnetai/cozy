import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import superjson from 'superjson'
import type { Context } from './context'
import { CozyContainer } from '../container'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.name}!` }
    }),
  
  executeCode: publicProcedure
    .input(z.object({
      language: z.enum(['javascript', 'python', 'typescript']),
      code: z.string(),
      apiKey: z.string().optional(),
      workspaceId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // TODO: Get API key from user session if not provided
        const apiKey = input.apiKey || ''
        const workspaceId = input.workspaceId || 'default'
        
        const container = new CozyContainer({ apiKey, workspaceId }, ctx.env.CONTAINER)
        await container.initialize()
        
        const result = await container.executeCode(input.language, input.code)
        
        return {
          success: true,
          output: result.stdout,
          error: result.stderr,
          executionTime: Date.now(),
        }
      } catch (error) {
        return {
          success: false,
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error',
          executionTime: Date.now(),
        }
      }
    }),
  
  claudeCode: publicProcedure
    .input(z.object({
      prompt: z.string(),
      context: z.string().optional(),
      files: z.array(z.object({
        path: z.string(),
        content: z.string(),
      })).optional(),
      apiKey: z.string().optional(),
      workspaceId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // TODO: Get API key from user session if not provided
        const apiKey = input.apiKey || ''
        const workspaceId = input.workspaceId || 'default'
        
        const container = new CozyContainer({ apiKey, workspaceId }, ctx.env.CONTAINER)
        await container.initialize()
        
        // Write files if provided
        if (input.files) {
          for (const file of input.files) {
            await container.writeFile(file.path, file.content)
          }
        }
        
        const result = await container.executeClaudeCode(input.prompt)
        
        return {
          success: true,
          output: result,
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        return {
          success: false,
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        }
      }
    }),
  
  fileOperation: publicProcedure
    .input(z.object({
      operation: z.enum(['read', 'write', 'list', 'mkdir']),
      path: z.string(),
      content: z.string().optional(),
      apiKey: z.string().optional(),
      workspaceId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const apiKey = input.apiKey || ''
        const workspaceId = input.workspaceId || 'default'
        
        const container = new CozyContainer({ apiKey, workspaceId }, ctx.env.CONTAINER)
        await container.initialize()
        
        let result: any
        
        switch (input.operation) {
          case 'read':
            result = await container.readFile(input.path)
            break
          case 'write':
            if (!input.content) throw new Error('Content required for write operation')
            await container.writeFile(input.path, input.content)
            result = 'File written successfully'
            break
          case 'list':
            result = await container.listFiles(input.path)
            break
          case 'mkdir':
            await container.createDirectory(input.path)
            result = 'Directory created successfully'
            break
        }
        
        return {
          success: true,
          data: result,
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        return {
          success: false,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        }
      }
    }),
})

export type AppRouter = typeof appRouter