import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

const assetManifest = JSON.parse(manifestJSON)

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    
    // Handle API proxy requests
    if (url.pathname.startsWith('/api/')) {
      const apiUrl = 'https://cozy-backend.botnet-599.workers.dev' + url.pathname.slice(4) + url.search
      
      // Forward the request to the backend
      const apiRequest = new Request(apiUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      })
      
      // Add CORS headers for the proxy
      const response = await fetch(apiRequest)
      const modifiedResponse = new Response(response.body, response)
      
      // Ensure CORS headers are set
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
    
    try {
      // Try to serve static assets
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
    } catch (e) {
      // If not a static asset, return 404
      return new Response('Not found', { status: 404 })
    }
  },
}