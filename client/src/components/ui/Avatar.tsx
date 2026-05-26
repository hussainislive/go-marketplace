import { cn, getInitials } from '../../utils/format'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: 'w-7 h-7 text-[11px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover bg-background-soft', sizes[size], className)}
      />
    )
  }
  return (
    <div
      className={cn(
        'rounded-full bg-brand-gradient text-white flex items-center justify-center font-semibold',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
