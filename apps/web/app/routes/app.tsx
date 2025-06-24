import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Cozy App</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            This is where the main application interface will be.
          </p>
        </div>
      </div>
    </div>
  )
}