import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin } from 'lucide-react'
import type { Ad } from '../../types'
import { formatPrice, formatRelativeTime, cn, cdnImage } from '../../utils/format'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { openAuthModal } from '../../store/uiSlice'
import { useToggleFavorite } from '../../api/ads'
import { Badge } from '../ui/Badge'

interface AdCardProps {
  ad: Ad
  initialFavorited?: boolean
}

export function AdCard({ ad, initialFavorited = false }: AdCardProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const { isAuthenticated } = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()
  const toggleFavorite = useToggleFavorite()

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      dispatch(openAuthModal('login'))
      return
    }
    const prev = favorited
    setFavorited(!prev) // optimistic
    toggleFavorite.mutate(
      { adId: ad.id, favorited: prev },
      { onError: () => setFavorited(prev) }
    )
  }

  return (
    <Link to={`/ads/${ad.id}`} className="group block">
      <div
        // content-visibility lets the browser skip rendering off-screen cards,
        // and a CSS-only hover lift avoids a JS animation per card while scrolling.
        style={{ contentVisibility: 'auto', containIntrinsicSize: '320px' }}
        className="bg-background-card rounded-card shadow-card overflow-hidden transition-[box-shadow,transform] duration-200 group-hover:shadow-card-hover group-hover:-translate-y-0.5"
      >
        {/* Image */}
        <div className="relative aspect-[16/9] bg-background-soft overflow-hidden">
          {ad.images[0] ? (
            <img
              src={cdnImage(ad.images[0], 600)}
              srcSet={`${cdnImage(ad.images[0], 400)} 400w, ${cdnImage(ad.images[0], 600)} 600w, ${cdnImage(ad.images[0], 800)} 800w`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
              alt={ad.title}
              loading="lazy"
              decoding="async"
              width={600}
              height={338}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-primary/30 text-caption">
              No image
            </div>
          )}

          {ad.isFeatured && (
            <div className="absolute top-3 left-3">
              <Badge variant="gradient">Featured</Badge>
            </div>
          )}

          <button
            onClick={handleFavorite}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shadow-card hover:scale-110 active:scale-95 transition-transform"
          >
            <Heart
              size={18}
              className={cn('transition-colors', favorited ? 'fill-brand-pink text-brand-pink' : 'text-text-primary/50')}
            />
          </button>

          {ad.condition && (
            <div className="absolute bottom-3 left-3">
              <span className="rounded-badge bg-black/60 px-2.5 py-1 text-caption font-medium text-white capitalize">
                {ad.condition.toLowerCase()}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-card-title font-bold text-brand-gradient">{formatPrice(ad.price)}</p>
          <h3 className="text-body font-semibold text-text-primary mt-1 line-clamp-1">{ad.title}</h3>
          <div className="flex items-center gap-1 text-caption text-text-primary/50 mt-2">
            <MapPin size={13} />
            <span className="truncate">{ad.city}</span>
            <span className="mx-1">·</span>
            <span className="whitespace-nowrap">{formatRelativeTime(ad.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
