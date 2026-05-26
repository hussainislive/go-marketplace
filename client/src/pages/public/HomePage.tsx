import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { useFeaturedAds, useInfiniteAds } from '../../api/ads'
import { useCategories } from '../../api/categories'
import { AdCard } from '../../components/shared/AdCard'
import { AdGridSkeleton } from '../../components/shared/AdCardSkeleton'
import { CategoryCard } from '../../components/shared/CategoryCard'
import { Button } from '../../components/ui/Button'

const TRENDING = ['iPhone', 'Toyota', 'Apartment', 'Laptop', 'Sofa']

export default function HomePage() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const navigate = useNavigate()

  const featured = useFeaturedAds()
  const categories = useCategories()
  const latest = useInfiniteAds()

  function explore(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    navigate(`/search?${params.toString()}`)
  }

  const latestAds = latest.data?.pages.flatMap(p => p.data) ?? []

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-gradient pt-20 pb-32 px-5 md:px-margin-desktop relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-white/5 blur-3xl rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] bg-black/10 blur-2xl rounded-full" />
        <div className="max-w-container mx-auto text-center relative z-10">
          <h1 className="text-[40px] leading-[1.15] md:text-hero font-bold text-white mb-5">
            Find Anything Near You
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            Buy. Sell. Connect. Your local marketplace for everything from electronics to homes.
          </p>
        </div>
      </section>

      {/* Floating search card */}
      <div className="max-w-container mx-auto px-5 md:px-margin-desktop -mt-16 relative z-20 mb-20">
        <form
          onSubmit={explore}
          className="bg-white rounded-card shadow-modal p-5 md:p-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center"
        >
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/40" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full h-13 py-3.5 pl-12 pr-4 bg-background-soft border border-border rounded-input focus:bg-white focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none text-body transition-all"
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="h-13 py-3.5 px-4 md:w-52 bg-background-soft border border-border rounded-input outline-none text-body focus:border-brand-pink appearance-none"
          >
            <option value="">All Categories</option>
            {categories.data?.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <Button type="submit" size="lg" className="md:px-10">Explore</Button>
        </form>
        <div className="flex flex-wrap items-center gap-2 mt-4 justify-center">
          <span className="text-caption text-text-primary/50">Trending:</span>
          {TRENDING.map(t => (
            <button
              key={t}
              onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
              className="px-3 py-1 rounded-badge border border-border text-caption text-text-primary/70 hover:border-brand-pink hover:text-brand-pink transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-container mx-auto px-5 md:px-margin-desktop mb-20">
        <h2 className="text-2xl md:text-section font-semibold text-text-primary mb-8">Browse Categories</h2>
        {categories.isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-card bg-border-divider animate-pulse" />
                <div className="h-3 w-14 bg-border-divider rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.data?.map(c => <CategoryCard key={c.id} category={c} />)}
          </div>
        )}
      </section>

      {/* Featured */}
      <section className="max-w-container mx-auto px-5 md:px-margin-desktop mb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-section font-semibold text-text-primary">Featured Now</h2>
          <Link to="/search" className="text-body font-medium text-brand-pink hover:text-brand-purple inline-flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        {featured.isLoading ? (
          <AdGridSkeleton count={4} />
        ) : featured.data && featured.data.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.data.map(ad => <AdCard key={ad.id} ad={ad} />)}
          </div>
        ) : (
          <p className="text-body text-text-primary/50">No featured listings yet.</p>
        )}
      </section>

      {/* Latest */}
      <section className="max-w-container mx-auto px-5 md:px-margin-desktop mb-24">
        <h2 className="text-2xl md:text-section font-semibold text-text-primary mb-8">Latest Listings</h2>
        {latest.isLoading ? (
          <AdGridSkeleton count={8} />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {latestAds.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </div>
            {latest.hasNextPage && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="secondary"
                  loading={latest.isFetchingNextPage}
                  onClick={() => void latest.fetchNextPage()}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
