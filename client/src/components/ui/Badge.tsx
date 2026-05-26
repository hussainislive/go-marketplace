import type { ReactNode } from 'react'
import { cn } from '../../utils/format'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default' | 'gradient'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-status-success/12 text-status-success',
  warning: 'bg-status-warning/12 text-[#B45309]',
  error: 'bg-status-error/12 text-status-error',
  info: 'bg-status-info/12 text-status-info',
  default: 'bg-background-soft text-text-primary/70',
  gradient: 'bg-brand-gradient text-white',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-badge px-2.5 py-1 text-label font-semibold leading-none',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
