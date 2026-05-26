import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/format'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padded?: boolean
}

export function Card({ hover, padded = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-background-card rounded-card shadow-card',
        padded && 'p-6',
        hover && 'transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
