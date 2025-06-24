import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to Cozy
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The modern container runtime platform for developers
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/app"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </a>
            <a
              href="/docs"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}