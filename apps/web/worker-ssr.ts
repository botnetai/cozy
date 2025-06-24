import type { Env } from '@cloudflare/workers-types'
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

// @ts-ignore - This will be available at runtime
import entryServer from './dist/server/entry-server.js'

const assetManifest = JSON.parse(manifestJSON)

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url)

    // Handle API proxy requests
    if (url.pathname.startsWith('/api/')) {
      const apiUrl = 'https://cozy-backend.botnet-599.workers.dev' + url.pathname.slice(4) + url.search
      
      const apiRequest = new Request(apiUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      })
      
      const response = await fetch(apiRequest)
      const modifiedResponse = new Response(response.body, response)
      
      modifiedResponse.headers.set('Access-Control-Allow-Origin', '*')
      modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Anthropic-Api-Key, X-Workspace-Id')
      
      return modifiedResponse
    }
    
    // Handle OPTIONS requests for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Anthropic-Api-Key, X-Workspace-Id',
        },
      })
    }

    // Try to serve static assets first
    try {
      // Check if it's a static asset request
      if (
        url.pathname.startsWith('/assets/') ||
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.json') ||
        url.pathname.endsWith('.ico') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.jpeg') ||
        url.pathname.endsWith('.gif') ||
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.woff') ||
        url.pathname.endsWith('.woff2')
      ) {
        return await getAssetFromKV(
          {
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        )
      }
    } catch (e) {
      // If static asset not found, continue to SSR
    }

    // Handle SSR for all other requests
    try {
      // Pass the request to TanStack Start's server handler
      const response = await entryServer.default(request, {
        env,
        ctx,
      })

      return response
    } catch (error) {
      console.error('SSR Error:', error)
      // Fallback to client-side rendering if SSR fails
      try {
        const html = await getAssetFromKV(
          {
            request: new Request(new URL('/index.html', request.url)),
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        )
        return html
      } catch (e) {
        return new Response('Error loading application', { status: 500 })
      }
    }
  },
}