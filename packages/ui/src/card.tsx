import * as React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white rounded-lg shadow',
      bordered: 'bg-white rounded-lg border border-gray-200',
    }
    
    return (
      <div
        className={`${variants[variant]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      className={`px-6 py-4 ${className}`}
      ref={ref}
      {...props}
    />
  )
)

CardHeader.displayName = 'CardHeader'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      className={`px-6 py-4 ${className}`}
      ref={ref}
      {...props}
    />
  )
)

CardContent.displayName = 'CardContent'