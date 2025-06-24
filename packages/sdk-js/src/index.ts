import { createTRPCClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '../../worker/src/trpc/router'

export interface CozyClientOptions {
  apiUrl: string
  apiKey?: string
}

export class CozyClient {
  private trpc: ReturnType<typeof createTRPCClient<AppRouter>>
  
  constructor(options: CozyClientOptions) {
    this.trpc = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${options.apiUrl}/trpc`,
          headers: options.apiKey ? {
            'Authorization': `Bearer ${options.apiKey}`,
          } : undefined,
          transformer: superjson,
        }),
      ],
    })
  }
  
  async executeCode(language: 'javascript' | 'python' | 'typescript', code: string) {
    return await this.trpc.executeCode.mutate({ language, code })
  }
  
  async hello(name: string) {
    return await this.trpc.hello.query({ name })
  }
}

export function createClient(options: CozyClientOptions) {
  return new CozyClient(options)
}