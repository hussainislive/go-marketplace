import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, Search as SearchIcon, PackageSearch } from 'lucide-react'
import { useAds } from '../../api/ads'
import { useCategories } from '../../api/categories'
import { AdCard } from '../../components/shared/AdCard'
import { AdGridSkeleton } from '../../components/shared/AdCardSkeleton'
import { EmptyState } from '../../components/shared/EmptyState'
import { Seo } from '../../components/shared/Seo'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { PriceRangeSlider } from '../../components/ui/PriceRangeSlider'
import { cn } from '../../utils/format'

const PRICE_MIN = 0
const PRICE_MAX = 100000
const CONDITIONS = [
  { value: '', label: 'Any condition' },
  { value: 'NEW', label: 'New' },
  { value: 'USED', label: 'Used' },
  { value: 'REFURBISHED', label: 'Refurbished' },
]
const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const [mobileFilters, setMobileFilters] = useState(false)
  const categories = useCategories()

  const filters = {
    q: params.get('q') ?? undefined,
    category: params.get('category') ?? undefined,
    city: params.get('city') ?? undefined,
    minPrice: params.get('minPrice') ?? undefined,
    maxPrice: params.get('maxPrice') ?? undefined,
    condition: params.get('condition') ?? undefined,
    sort: params.get('sort') ?? 'newest',
    page: Number(params.get('page')) || 1,
  }

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice ? Number(filters.minPrice) : PRICE_MIN,
    filters.maxPrice ? Number(filters.maxPrice) : PRICE_MAX,
  ])
  const [cityInput, setCityInput] = useState(filters.city ?? '')

  useEffect(() => {
    setCityInput(filters.city ?? '')
  }, [filters.city])

  const ads = useAds(filters)

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setParams(next)
  }

  function commitPrice([lo, hi]: [number, number]) {
    const next = new URLSearchParams(params)
    if (lo > PRICE_MIN) next.set('minPrice', String(lo)); else next.delete('minPrice')
    if (hi < PRICE_MAX) next.set('maxPrice', String(hi)); else next.delete('maxPrice')
    next.delete('page')
    setParams(next)
  }

  function clearAll() {
    const next = new URLSearchParams()
    if (filters.q) next.set('q', filters.q)
    setParams(next)
    setPriceRange([PRICE_MIN, PRICE_MAX])
  }

  const activeFilterCount = ['category', 'city', 'minPrice', 'maxPrice', 'condition'].filter(k =>
    params.get(k)
  ).length

  const FiltersPanel = (
    <div className="space-y-6">
      <div>
        <label className="block text-label font-semibold text-text-primary mb-2">Category</label>
        <Select
          options={[
            { value: '', label: 'All categories' },
            ...(categories.data?.map(c => ({ value: c.slug, label: c.name })) ?? []),
          ]}
          value={filters.category ?? ''}
          onChange={e => updateParam('category', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-label font-semibold text-text-primary mb-2">Location</label>
        <form
          onSubmit={e => { e.preventDefault(); updateParam('city', cityInput) }}
        >
          <div className="relative">
            <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-primary/40" />
            <input
              value={cityInput}
              onChange={e => setCityInput(e.target.value)}
              onBlur={() => updateParam('city', cityInput)}
              placeholder="Enter city"
              className="w-full h-11 pl-10 pr-4 rounded-input bg-background-soft border border-border outline-none text-body focus:bg-white focus:border-brand-pink"
            />
          </div>
        </form>
      </div>

      <div>
        <label className="block text-label font-semibold text-text-primary mb-3">Price range</label>
        <PriceRangeSlider
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={priceRange}
          onChange={setPriceRange}
          onCommit={commitPrice}
          step={500}
        />
      </div>

      <div>
        <label className="block text-label font-semibold text-text-primary mb-2">Condition</label>
        <Select
          options={CONDITIONS}
          value={filters.condition ?? ''}
          onChange={e => updateParam('condition', e.target.value)}
        />
      </div>

      {activeFilterCount > 0 && (
        <Button variant="ghost" fullWidth onClick={clearAll}>Clear all filters</Button>
      )}
    </div>
  )

  return (
    <div className="max-w-container mx-auto px-5 md:px-margin-desktop py-8">
      <Seo
        title="Search Listings"
        description="Search thousands of local listings on GO Marketplace. Filter by category, location, price and condition to find exactly what you need."
        path="/search"
      />
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {filters.q ? `Results for "${filters.q}"` : 'Browse Listings'}
          </h1>
          {ads.data && <p className="text-body text-text-primary/55 mt-0.5">{ads.data.meta.total} ads found</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilters(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 h-11 rounded-button border border-border text-body font-medium"
          >
            <SlidersHorizontal size={17} /> Filters
            {activeFilterCount > 0 && (
              <span className="bg-brand-pink text-white text-caption rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
          <div className="w-44">
            <Select options={SORTS} value={filters.sort} onChange={e => updateParam('sort', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="bg-white rounded-card shadow-card p-5 sticky top-24">
            <h2 className="text-card-title font-semibold mb-5">Filters</h2>
            {FiltersPanel}
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {ads.isLoading ? (
            <AdGridSkeleton count={9} />
          ) : ads.data && ads.data.data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {ads.data.data.map(ad => <AdCard key={ad.id} ad={ad} />)}
              </div>
              {ads.data.meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: ads.data.meta.totalPages }).map((_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => { const n = new URLSearchParams(params); n.set('page', String(page)); setParams(n) }}
                        className={cn(
                          'w-10 h-10 rounded-button text-body font-medium transition-colors',
                          page === filters.page ? 'bg-brand-gradient text-white' : 'border border-border hover:border-brand-pink'
                        )}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="No listings found"
              description="Try adjusting your filters or search for something else."
              ctaLabel="Clear filters"
              onCta={clearAll}
            />
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setMobileFilters(false)} />
          <div className="w-[85%] max-w-sm bg-white h-full overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-card-title font-semibold">Filters</h2>
              <button onClick={() => setMobileFilters(false)} className="p-2 -mr-2"><X size={22} /></button>
            </div>
            {FiltersPanel}
            <Button fullWidth className="mt-6" onClick={() => setMobileFilters(false)}>Show results</Button>
          </div>
        </div>
      )}
    </div>
  )
}
