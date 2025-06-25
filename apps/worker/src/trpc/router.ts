import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import superjson from 'superjson'
import type { Context } from './context'

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
  
  // Container endpoints will be implemented via direct HTTP routes
  // instead of tRPC for now, to match Cloudflare Containers pattern
})

export type AppRouter = typeof appRouter