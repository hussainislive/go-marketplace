import { Heart } from 'lucide-react'
import { useFavorites } from '../../api/favorites'
import { AdCard } from '../../components/shared/AdCard'
import { AdGridSkeleton } from '../../components/shared/AdCardSkeleton'
import { EmptyState } from '../../components/shared/EmptyState'

export default function FavoritesPage() {
  const favorites = useFavorites()

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Saved Listings</h1>

      {favorites.isLoading ? (
        <AdGridSkeleton count={8} />
      ) : favorites.data && favorites.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.data.map(ad => (
            <AdCard key={ad.id} ad={ad} initialFavorited />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No saved listings yet"
          description="Tap the heart on any listing to save it here for later."
          ctaLabel="Browse listings"
          ctaHref="/search"
        />
      )}
    </div>
  )
}
