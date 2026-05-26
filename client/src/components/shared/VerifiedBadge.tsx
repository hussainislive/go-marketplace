import { BadgeCheck } from 'lucide-react'
import { cn } from '../../utils/format'

export function VerifiedBadge({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <span title="Verified seller" className={cn('inline-flex text-brand-pink', className)}>
      <BadgeCheck size={size} fill="currentColor" className="text-white" stroke="#C82C8C" />
    </span>
  )
}
