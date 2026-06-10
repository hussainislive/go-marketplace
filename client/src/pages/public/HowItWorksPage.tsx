import { Link } from 'react-router-dom'
import { Search, MessageCircle, Handshake, UserPlus, Camera, ShieldCheck, Zap, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Seo } from '../../components/shared/Seo'

const BUY_STEPS = [
  { icon: Search, title: 'Browse & Search', desc: 'Explore thousands of listings. Filter by category, location, price, and condition to find exactly what you need.' },
  { icon: MessageCircle, title: 'Chat with Sellers', desc: 'Message sellers directly in real time. Ask questions, request photos, and negotiate — all inside the app.' },
  { icon: Handshake, title: 'Meet & Buy', desc: 'Agree on a price, arrange a safe meetup, inspect the item, and complete your purchase with confidence.' },
]

const SELL_STEPS = [
  { icon: UserPlus, title: 'Create an Account', desc: 'Sign up for free in under a minute and verify your email to unlock posting.' },
  { icon: Camera, title: 'Post Your Ad', desc: 'Add photos, set your price, write a description, and publish your listing in just a few steps.' },
  { icon: Zap, title: 'Connect & Sell', desc: 'Receive messages from interested buyers, chat instantly, and close the deal quickly.' },
]

const WHY = [
  { icon: ShieldCheck, title: 'Safe & Secure', desc: 'Verified sellers, secure messaging, and built-in safety tips for every transaction.' },
  { icon: Zap, title: 'Fast & Easy', desc: 'List an item or find a deal in minutes with a clean, intuitive experience.' },
  { icon: Heart, title: 'Local Community', desc: 'Connect with buyers and sellers near you and build trust within your community.' },
]

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.4 },
}

function StepCard({ icon: Icon, title, desc, index }: { icon: typeof Search; title: string; desc: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
      className="relative bg-white rounded-card shadow-card p-6"
    >
      <span className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-brand-gradient text-white text-body font-bold flex items-center justify-center shadow-card">
        {index + 1}
      </span>
      <div className="w-12 h-12 rounded-button bg-brand-gradient flex items-center justify-center mb-5">
        <Icon size={22} className="text-white" />
      </div>
      <h3 className="text-card-title font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-body text-text-primary/60 leading-relaxed">{desc}</p>
    </motion.div>
  )
}

export default function HowItWorksPage() {
  return (
    <div>
      <Seo
        title="How It Works"
        description="Learn how GO Marketplace works — browse listings, chat with sellers, post your ad in minutes, and buy or sell safely in your local area."
        path="/how-it-works"
      />
      {/* Hero */}
      <section className="bg-brand-gradient py-20 px-5 md:px-margin-desktop text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-container mx-auto">
          <h1 className="text-[36px] md:text-section font-bold text-white mb-4">How GO Marketplace Works</h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">
            Buying and selling has never been easier. Here's everything you need to know to get started.
          </p>
        </motion.div>
      </section>

      {/* For Buyers */}
      <section className="max-w-container mx-auto px-5 md:px-margin-desktop py-16">
        <motion.h2 {...fade} className="text-2xl md:text-section font-semibold text-text-primary mb-10 text-center">For Buyers</motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {BUY_STEPS.map((s, i) => <StepCard key={s.title} {...s} index={i} />)}
        </div>
      </section>

      {/* For Sellers */}
      <section className="bg-white py-16 px-5 md:px-margin-desktop">
        <div className="max-w-container mx-auto">
          <motion.h2 {...fade} className="text-2xl md:text-section font-semibold text-text-primary mb-10 text-center">For Sellers</motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {SELL_STEPS.map((s, i) => <StepCard key={s.title} {...s} index={i} />)}
          </div>
        </div>
      </section>

      {/* Why GO */}
      <section className="max-w-container mx-auto px-5 md:px-margin-desktop py-16">
        <motion.h2 {...fade} className="text-2xl md:text-section font-semibold text-text-primary mb-10 text-center">Why Choose GO</motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {WHY.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
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
      </section>

      {/* CTA */}
      <section className="bg-brand-gradient py-16 px-5 md:px-margin-desktop text-center">
        <motion.div {...fade} className="max-w-container mx-auto">
          <h2 className="text-2xl md:text-section font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-white/80 text-lg mb-8">Join thousands of buyers and sellers on GO Marketplace today.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/search" className="inline-flex items-center justify-center h-12 px-8 rounded-button bg-white text-brand-pink font-semibold text-body hover:bg-white/90 transition-colors active:scale-95">
              Browse Listings
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center h-12 px-8 rounded-button border-2 border-white text-white font-semibold text-body hover:bg-white/10 transition-colors active:scale-95">
              Create an Account
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
