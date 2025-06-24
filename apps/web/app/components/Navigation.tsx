import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '../utils/cn'

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">Cozy</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/app"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  'text-muted-foreground'
                )}
              >
                Dashboard
              </Link>
              <Link
                to="/docs"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  'text-muted-foreground'
                )}
              >
                Documentation
              </Link>
              <Link
                to="/pricing"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  'text-muted-foreground'
                )}
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}