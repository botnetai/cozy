import * as React from 'react'
import { Switch as BaseSwitch } from '@mui/base/Switch'
import { useTheme } from './ThemeProvider'
import { cn } from '../utils/cn'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid hydration mismatch by showing a placeholder during SSR
  if (!mounted) {
    return (
      <div className="h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-700" />
    )
  }

  return (
    <BaseSwitch
      checked={theme === 'dark'}
      onChange={(event) => setTheme(event.target.checked ? 'dark' : 'light')}
      slotProps={{
        root: {
          className: cn(
            'relative inline-flex h-6 w-11 items-center rounded-full',
            'bg-gray-200 dark:bg-gray-700',
            'transition-colors duration-200 ease-in-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          ),
        },
        thumb: {
          className: cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0',
            'transition-transform duration-200 ease-in-out',
            'translate-x-1 data-[checked]:translate-x-6'
          ),
        },
        input: {
          className: 'sr-only',
          'aria-label': 'Toggle theme',
        },
      }}
    />
  )
}