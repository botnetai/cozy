import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '../components/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome to Cozy
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              The modern container runtime platform for developers. Build, deploy, and scale
              your applications with ease.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/app">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/docs">
                <Button size="lg" variant="secondary">
                  Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Cozy?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to build and deploy modern applications
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
                <CardDescription>
                  Optimized performance with minimal overhead
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built on modern infrastructure with edge computing capabilities
                  for the best possible performance.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Developer Friendly</CardTitle>
                <CardDescription>
                  Simple APIs and intuitive workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Designed with developers in mind. Get up and running in minutes
                  with our comprehensive documentation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Secure by Default</CardTitle>
                <CardDescription>
                  Enterprise-grade security built-in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your applications are protected with industry-leading security
                  practices and automatic updates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Ready to get started?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of developers building with Cozy
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link to="/app">
                <Button size="lg" variant="primary">
                  Start Building Today
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}