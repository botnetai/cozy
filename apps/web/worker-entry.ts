import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';

const assetManifest = JSON.parse(manifestJSON);

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Serve static assets
    if (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
      try {
        return await getAssetFromKV(
          {
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        );
      } catch (e) {
        // Asset not found, continue to app
      }
    }

    // For now, return a simple HTML response
    // In production, this would render the React app
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cozy Cloud - Browser-Hosted Claude Code</title>
    <link rel="stylesheet" href="/assets/style.css">
  </head>
  <body>
    <div id="root">
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
        <div style="text-align: center;">
          <h1 style="font-size: 3rem; margin-bottom: 1rem;">🚀 Cozy Cloud</h1>
          <p style="font-size: 1.5rem; color: #666;">Browser-Hosted Claude Code Platform</p>
          <p style="margin-top: 2rem;">Frontend deployed successfully!</p>
        </div>
      </div>
    </div>
  </body>
</html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  },
};