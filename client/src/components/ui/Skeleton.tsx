import { cn } from '../../utils/format'

type SkeletonVariant = 'card' | 'text' | 'avatar' | 'row' | 'rect'

interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
}

const base = 'animate-pulse bg-border-divider'

const variants: Record<SkeletonVariant, string> = {
  card: 'rounded-card h-64 w-full',
  text: 'rounded h-4 w-full',
  avatar: 'rounded-full h-10 w-10',
  row: 'rounded-lg h-14 w-full',
  rect: 'rounded-lg h-full w-full',
}

export function Skeleton({ variant = 'text', className }: SkeletonProps) {
  return <div className={cn(base, variants[variant], className)} />
}
