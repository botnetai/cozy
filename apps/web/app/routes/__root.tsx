import { createRootRoute } from '@tanstack/react-router'
import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/start'
import * as React from 'react'
import { ThemeProvider } from '../components/ThemeProvider'
import { Navigation } from '../components/Navigation'
import '../styles/globals.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Cozy - Container Runtime Platform',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html suppressHydrationWarning>
      <head>
        <Meta />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('cozy-ui-theme') || 'dark'
                document.documentElement.classList.add(theme)
              } catch {}
            `,
          }}
        />
      </head>
      <body>
        <div id="root">
          <ThemeProvider defaultTheme="dark">
            <div className="min-h-screen bg-background">
              <Navigation />
              <main>
                <Outlet />
              </main>
            </div>
          </ThemeProvider>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}