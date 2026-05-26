import { Link } from 'react-router-dom'
import { Globe, Share2, AtSign, Send } from 'lucide-react'

const columns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse Ads', to: '/search' },
      { label: 'Post an Ad', to: '/dashboard/create' },
      { label: 'Categories', to: '/search' },
      { label: 'Featured', to: '/search?sort=newest' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/' },
      { label: 'How It Works', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Blog', to: '/' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/' },
      { label: 'Safety Tips', to: '/' },
      { label: 'Contact Us', to: '/' },
      { label: 'Report a Problem', to: '/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', to: '/' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Cookie Policy', to: '/' },
    ],
  },
]

const socials = [Globe, Share2, AtSign, Send]

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white mt-auto">
      <div className="max-w-container mx-auto px-5 lg:px-margin-desktop py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-bold text-brand-gradient">GO</span>
            <p className="text-body text-white/60 mt-3 max-w-xs">
              Buy. Sell. Connect. The marketplace for everything near you.
            </p>
            <div className="flex gap-3 mt-5">
              {socials.map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-white/8 hover:bg-white/15 transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-label font-semibold uppercase tracking-wide text-white/80 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-body text-white/55 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-container mx-auto px-5 lg:px-margin-desktop py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-caption text-white/50">© 2026 GO Marketplace. All rights reserved.</p>
          <p className="text-caption text-white/50">Made with care for buyers & sellers everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
