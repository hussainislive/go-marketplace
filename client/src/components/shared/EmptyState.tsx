import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Button } from '../ui/Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  onCta?: () => void
}

export function EmptyState({ icon: Icon, title, description, ctaLabel, ctaHref, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-20 h-20 rounded-full bg-background-soft flex items-center justify-center text-brand-pink mb-5">
        <Icon size={34} strokeWidth={1.5} />
      </div>
      <h3 className="text-card-title font-semibold text-text-primary">{title}</h3>
      {description && <p className="text-body text-text-primary/55 mt-1.5 max-w-sm">{description}</p>}
      {ctaLabel && (ctaHref || onCta) && (
        <div className="mt-6">
          {ctaHref ? (
            <Link to={ctaHref}>
              <Button>{ctaLabel}</Button>
            </Link>
          ) : (
            <Button onClick={onCta}>{ctaLabel}</Button>
          )}
        </div>
      )}
    </div>
  )
}
