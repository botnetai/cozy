import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'

const assetManifest = JSON.parse(manifestJSON)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    // Handle API proxy requests
    if (url.pathname.startsWith('/api/')) {
      const apiUrl = env.API_URL || 'https://cozy-worker.jeremycai.workers.dev'
      const proxyUrl = new URL(url.pathname.replace('/api', ''), apiUrl)
      proxyUrl.search = url.search
      
      return fetch(proxyUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
      })
    }
    
    try {
      // Try to serve static assets
      const response = await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
          // For SPAs, serve index.html for all non-asset routes
          mapRequestToAsset: (req) => {
            const parsedUrl = new URL(req.url)
            const pathname = parsedUrl.pathname
            
            // If it's a file with an extension, serve as is
            if (pathname.includes('.')) {
              return req
            }
            
            // Otherwise, serve index.html
            parsedUrl.pathname = '/index.html'
            return new Request(parsedUrl.toString(), req)
          },
        }
      )
      
      // Add cache headers for assets
      if (url.pathname.startsWith('/assets/')) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      }
      
      return response
    } catch (e) {
      // If asset not found, return 404
      return new Response('Not found', { status: 404 })
    }
  },
}