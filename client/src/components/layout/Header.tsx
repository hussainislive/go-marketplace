import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Heart, MessageCircle, Bell, Menu, X, Plus, LogOut, LayoutDashboard } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { openAuthModal } from '../../store/uiSlice'
import { logout as logoutAction } from '../../store/authSlice'
import { useLogout } from '../../api/auth'
import { Avatar } from '../ui/Avatar'
import { cn } from '../../utils/format'

export function Header() {
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAppSelector(s => s.auth)
  const unreadCount = useAppSelector(s => s.notification.unreadCount)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const logout = useLogout()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  function handleSell() {
    if (isAuthenticated) navigate('/dashboard/create')
    else dispatch(openAuthModal('login'))
  }

  async function handleLogout() {
    await logout.mutateAsync().catch(() => undefined)
    dispatch(logoutAction())
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <nav
      className={cn(
        'h-[72px] sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border transition-shadow',
        scrolled && 'shadow-card'
      )}
    >
      <div className="max-w-container mx-auto h-full px-5 lg:px-margin-desktop flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-brand-gradient shrink-0">
          GO
        </Link>

        {/* Search — desktop */}
        <form onSubmit={submitSearch} className="hidden md:block flex-1 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/40" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for anything..."
              className="w-full h-11 pl-11 pr-4 rounded-badge bg-background-soft border border-border focus:bg-white focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none text-body transition-all"
            />
          </div>
        </form>

        {/* Right actions — desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <>
              <Link to="/favorites" className="p-2.5 rounded-full hover:bg-background-soft text-text-primary/70 transition-colors">
                <Heart size={20} />
              </Link>
              <Link to="/messages" className="p-2.5 rounded-full hover:bg-background-soft text-text-primary/70 transition-colors">
                <MessageCircle size={20} />
              </Link>
              <Link to="/notifications" className="relative p-2.5 rounded-full hover:bg-background-soft text-text-primary/70 transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-status-error text-white text-[10px] font-semibold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <button onClick={handleSell} className="ml-1 inline-flex items-center gap-1.5 bg-brand-gradient text-white px-5 py-2.5 rounded-button font-medium text-body hover:shadow-card-hover transition-all active:scale-95">
                <Plus size={18} /> SELL NOW
              </button>
              <div className="relative ml-1">
                <button onClick={() => setMenuOpen(o => !o)} className="block">
                  <Avatar src={user?.avatar} name={user?.name ?? 'U'} size="sm" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-card shadow-card-hover border border-border py-2 z-20">
                      <div className="px-4 py-2 border-b border-border-divider">
                        <p className="text-body font-semibold truncate">{user?.name}</p>
                        <p className="text-caption text-text-primary/50 truncate">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-body hover:bg-background-soft">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-body hover:bg-background-soft">
                          <LayoutDashboard size={16} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-body text-status-error hover:bg-background-soft">
                        <LogOut size={16} /> Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center bg-brand-gradient text-white px-5 py-2.5 rounded-button font-medium text-body hover:shadow-card-hover transition-all active:scale-95">
                Log in
              </Link>
              <Link to="/signup" className="inline-flex items-center bg-brand-gradient text-white px-5 py-2.5 rounded-button font-medium text-body hover:shadow-card-hover transition-all active:scale-95">
                Sign up
              </Link>
              <button onClick={handleSell} className="inline-flex items-center gap-1.5 bg-brand-gradient text-white px-5 py-2.5 rounded-button font-medium text-body hover:shadow-card-hover transition-all active:scale-95">
                <Plus size={18} /> SELL NOW
              </button>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={handleSell} className="inline-flex items-center gap-1 bg-brand-gradient text-white px-3.5 py-2 rounded-button font-medium text-label active:scale-95">
            <Plus size={16} /> Sell
          </button>
          <button onClick={() => setMobileOpen(o => !o)} className="p-2 rounded-full hover:bg-background-soft">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-border px-5 py-4 space-y-3">
          <form onSubmit={submitSearch}>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/40" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full h-11 pl-11 pr-4 rounded-badge bg-background-soft border border-border outline-none text-body"
              />
            </div>
          </form>
          {isAuthenticated ? (
            <div className="flex flex-col">
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="py-2.5 text-body">Dashboard</Link>
              <Link to="/messages" onClick={() => setMobileOpen(false)} className="py-2.5 text-body">Messages</Link>
              <Link to="/favorites" onClick={() => setMobileOpen(false)} className="py-2.5 text-body">Favorites</Link>
              <Link to="/notifications" onClick={() => setMobileOpen(false)} className="py-2.5 text-body">Notifications</Link>
              <button onClick={handleLogout} className="py-2.5 text-body text-status-error text-left">Log out</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-button bg-brand-gradient text-white font-medium text-body">
                Log in
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-button bg-brand-gradient text-white font-medium text-body">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
