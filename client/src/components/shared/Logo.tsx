import logoUrl from '../../assets/logo.png'
import { cn } from '../../utils/format'

interface LogoProps {
  /** Tailwind height class — controls the rendered logo size. Default h-8. */
  className?: string
  /** Use on dark / brand-gradient backgrounds: renders the wordmark in white. */
  variant?: 'default' | 'white'
  alt?: string
}

// Single source of truth for the brand wordmark (logo.png). The "white" variant
// uses a CSS filter so the same asset stays visible on the pink-gradient panels.
export function Logo({ className, variant = 'default', alt = 'GO Marketplace' }: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt={alt}
      className={cn('w-auto h-8 select-none', variant === 'white' && 'brightness-0 invert', className)}
      draggable={false}
    />
  )
}
