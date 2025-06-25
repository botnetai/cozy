#!/bin/bash

echo "Building TypeScript worker..."

# Build with Bun
bun build src/index.ts --target=browser --format=iife --outfile=temp-worker.js

# Extract the IIFE content (remove the wrapper)
BUNDLED_CODE=$(sed '1s/^(//' temp-worker.js | sed '$s/)();$//')

# Create the final worker file
cat > worker-final.js << 'EOF'
// Cloudflare Worker - Full TypeScript Version
let app;

(() => {
EOF

# Add the bundled code
echo "$BUNDLED_CODE" >> worker-final.js

# Add the export wrapper
cat >> worker-final.js << 'EOF'
  
  // Export the app
  app = src_default;
})();

// Export for Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  }
};
EOF

# Clean up
rm temp-worker.js

echo "✅ Build complete! Output: worker-final.js"