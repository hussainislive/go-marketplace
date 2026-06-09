import { formatDistanceToNow, format } from 'date-fns'

export function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Pull the human-readable message out of an Axios error, falling back to a default.
export function apiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    if (res?.data?.message) return res.data.message
  }
  return fallback
}

// Return a CDN URL that delivers the image at roughly the display width and in a
// modern format, instead of full-resolution. Falls back to the original URL for
// anything we don't recognise, so behaviour never breaks for other hosts.
export function cdnImage(url: string | undefined | null, width: number): string {
  if (!url) return ''

  // Cloudinary: inject transforms right after "/upload/".
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (url.includes('/upload/f_auto')) return url // already transformed
    return url.replace('/upload/', `/upload/f_auto,q_auto,c_fill,w_${width}/`)
  }

  // Unsplash (used by seed data): supports query-string sizing.
  if (url.includes('images.unsplash.com')) {
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}auto=format&fit=crop&q=75&w=${width}`
  }

  return url
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
