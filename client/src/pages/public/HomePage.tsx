import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, ArrowRight, Shield, Zap, Users, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Easing } from 'framer-motion'

const EASE_OUT: Easing = 'easeOut'
import { useFeaturedAds, useInfiniteAds } from '../../api/ads'
import { useCategories } from '../../api/categories'
import { AdCard } from '../../components/shared/AdCard'
import { AdGridSkeleton } from '../../components/shared/AdCardSkeleton'
import { CategoryCard } from '../../components/shared/CategoryCard'
import { Button } from '../../components/ui/Button'

const TRENDING = ['iPhone', 'Toyota', 'Apartment', 'Laptop', 'Sofa']

const WHY_GO = [
  {
    icon: Shield,
    title: 'Safe & Trusted',
    desc: 'Verified sellers, secure messaging, and built-in safety tips so you can buy with confidence.',
  },
  {
    icon: Zap,
    title: 'Fast Listings',
    desc: 'Post an ad in under 2 minutes. Add photos, set your price, and reach thousands of local buyers.',
  },
  {
    icon: Users,
    title: 'Real Community',
    desc: 'Chat directly with sellers, ask questions, negotiate prices, and close deals — all in one place.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    city: 'Dubai',
    avatar: 'S',
    rating: 5,
    text: 'I sold my old laptop in less than a day! The chat feature made negotiating super easy.',
  },
  {
    name: 'James K.',
    city: 'London',
    avatar: 'J',
    rating: 5,
    text: 'Found an amazing apartment deal here. The filters saved me so much time.',
  },
  {
    name: 'Fatima A.',
    city: 'Riyadh',
    avatar: 'F',
    rating: 5,
    text: 'GO Marketplace is my go-to for buying and selling. The interface is beautiful and so easy to use.',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.4, ease: EASE_OUT },
}

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
        <motion.div
          className="max-w-container mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <h1 className="text-[40px] leading-[1.15] md:text-hero font-bold text-white mb-5">
            Find Anything Near You
          </h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            Buy. Sell. Connect. Your local marketplace for everything from electronics to homes.
          </p>
        </motion.div>
      </section>

      {/* Floating search card */}
      <div className="max-w-container mx-auto px-5 md:px-margin-desktop -mt-16 relative z-20 mb-20">
        <motion.form
          onSubmit={explore}
          className="bg-white rounded-card shadow-modal p-5 md:p-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT }}
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
        </motion.form>
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
        <motion.h2 {...fadeUp} className="text-2xl md:text-section font-semibold text-text-primary mb-8">Browse Categories</motion.h2>
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
            {categories.data?.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.25, delay: i * 0.04, ease: EASE_OUT }}
              >
                <CategoryCard category={c} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      <section className="max-w-container mx-auto px-5 md:px-margin-desktop mb-20">
        <div className="flex justify-between items-end mb-8">
          <motion.h2 {...fadeUp} className="text-2xl md:text-section font-semibold text-text-primary">Featured Now</motion.h2>
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
        <motion.h2 {...fadeUp} className="text-2xl md:text-section font-semibold text-text-primary mb-8">Latest Listings</motion.h2>
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

      {/* Why GO */}
      <section className="bg-white py-20 px-5 md:px-margin-desktop">
        <div className="max-w-container mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl md:text-section font-semibold text-text-primary">Why GO Marketplace?</h2>
            <p className="text-body text-text-primary/55 mt-3 max-w-xl mx-auto">
              Built for buyers and sellers who want a smarter, safer, and faster marketplace experience.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {WHY_GO.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35, delay: i * 0.1, ease: EASE_OUT }}
                className="flex flex-col items-start p-6 rounded-card bg-background-soft"
              >
                <div className="w-12 h-12 rounded-button bg-brand-gradient flex items-center justify-center mb-5">
                  <item.icon size={22} className="text-white" />
                </div>
                <h3 className="text-card-title font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-body text-text-primary/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-5 md:px-margin-desktop bg-background-soft">
        <div className="max-w-container mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-2xl md:text-section font-semibold text-text-primary">What Our Users Say</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35, delay: i * 0.1, ease: EASE_OUT }}
                className="bg-white rounded-card shadow-card p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} size={16} className="fill-status-warning text-status-warning" />
                  ))}
                </div>
                <p className="text-body text-text-primary/75 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-semibold text-body">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-body font-semibold text-text-primary">{t.name}</p>
                    <p className="text-caption text-text-primary/50">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-brand-gradient py-16 px-5 md:px-margin-desktop">
        <motion.div {...fadeUp} className="max-w-container mx-auto text-center">
          <h2 className="text-2xl md:text-section font-bold text-white mb-4">Ready to start selling?</h2>
          <p className="text-white/80 text-lg mb-8">Join thousands of sellers on GO Marketplace today.</p>
          <Link to="/dashboard/create">
            <Button size="lg" className="bg-white text-brand-pink! hover:bg-white/90 border-0 px-10">
              Post Your First Ad
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
