import { createRootRoute } from '@tanstack/react-router'
import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import * as React from 'react'
import { ThemeProvider } from '../components/ThemeProvider'
import { Navigation } from '../components/Navigation'
import '../styles/globals.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Outlet />
        </main>
      </div>
      <ScrollRestoration />
    </ThemeProvider>
  )
}