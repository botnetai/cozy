// Cloudflare Worker wrapper for TypeScript build
let app;

// The bundled code will be inserted here
(() => {
  // This will be replaced with the actual bundled code
  BUNDLED_CODE_PLACEHOLDER
  
  // Export the app
  app = src_default;
})();

// Export for Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  }
};