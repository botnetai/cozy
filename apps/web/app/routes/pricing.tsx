import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pricing')({
  component: Pricing,
})

function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Pricing</h1>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Free</h2>
            <p className="text-3xl font-bold mb-4">$0<span className="text-sm text-gray-600">/month</span></p>
            <ul className="space-y-2 text-gray-600">
              <li>✓ 100 container runs/month</li>
              <li>✓ Basic runtime environment</li>
              <li>✓ Community support</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-500">
            <h2 className="text-2xl font-bold mb-4">Pro</h2>
            <p className="text-3xl font-bold mb-4">$29<span className="text-sm text-gray-600">/month</span></p>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Unlimited container runs</li>
              <li>✓ Advanced runtime features</li>
              <li>✓ Priority support</li>
              <li>✓ Custom environments</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Enterprise</h2>
            <p className="text-3xl font-bold mb-4">Custom</p>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Everything in Pro</li>
              <li>✓ Dedicated infrastructure</li>
              <li>✓ SLA guarantees</li>
              <li>✓ 24/7 support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}