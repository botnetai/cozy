import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/docs')({
  component: Docs,
})

function Docs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Documentation</h1>
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p className="text-gray-600 mb-4">
                Welcome to the Cozy documentation. Get started with our platform in minutes.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
              <div className="bg-gray-100 p-4 rounded">
                <code className="text-sm">
                  npm install @cozy/sdk-js
                </code>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">API Reference</h2>
              <p className="text-gray-600">
                Comprehensive API documentation coming soon.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}