import * as React from 'react'
import { Button as BaseButton, ButtonProps as BaseButtonProps } from '@mui/base/Button'
import { cn } from '../utils/cn'

interface ButtonProps extends BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', slotProps, ...props }, ref) => {
    return (
      <BaseButton
        ref={ref}
        slotProps={{
          ...slotProps,
          root: {
            ...slotProps?.root,
            className: cn(
              'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              {
                'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
                'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
                'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
              },
              {
                'h-9 px-3 text-sm': size === 'sm',
                'h-10 px-4': size === 'md',
                'h-11 px-8': size === 'lg',
              },
              className,
              slotProps?.root?.className
            ),
          },
        }}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'