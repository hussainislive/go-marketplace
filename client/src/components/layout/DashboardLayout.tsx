import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  MessageCircle,
  Heart,
  Bell,
  User,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { logout as logoutAction } from '../../store/authSlice'
import { useLogout } from '../../api/auth'
import { Avatar } from '../ui/Avatar'
import { cn } from '../../utils/format'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/ads', label: 'My Ads', icon: ListChecks },
  { to: '/dashboard/create', label: 'Post an Ad', icon: PlusCircle },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useAppSelector(s => s.auth)
  const unreadCount = useAppSelector(s => s.notification.unreadCount)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const logout = useLogout()

  async function handleLogout() {
    await logout.mutateAsync().catch(() => undefined)
    dispatch(logoutAction())
    navigate('/')
  }

  const SidebarContent = (
    <>
      <div className="px-6 py-6">
        <Link to="/" className="text-2xl font-bold text-brand-gradient">GO</Link>
      </div>
      <div className="px-4 pb-4 flex items-center gap-3 border-b border-border-divider mx-2">
        <Avatar src={user?.avatar} name={user?.name ?? 'U'} size="md" />
        <div className="min-w-0">
          <p className="text-body font-semibold truncate">{user?.name}</p>
          <p className="text-caption text-text-primary/50 truncate">{user?.email}</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-button text-body font-medium transition-all',
                isActive
                  ? 'bg-brand-gradient text-white shadow-card'
                  : 'text-text-primary/70 hover:bg-background-soft'
              )
            }
          >
            <item.icon size={19} />
            <span className="flex-1">{item.label}</span>
            {item.label === 'Notifications' && unreadCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-status-error text-white text-[10px] font-semibold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-border-divider">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-button text-body font-medium text-status-error hover:bg-background-soft transition-colors"
        >
          <LogOut size={19} /> Log out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-background-soft flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-border sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 z-50 flex flex-col w-64 h-screen bg-white border-r border-border">
            {SidebarContent}
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 h-14 bg-white border-b border-border flex items-center justify-between px-4">
          <button onClick={() => setDrawerOpen(true)} className="p-2 -ml-2">
            <Menu size={22} />
          </button>
          <Link to="/" className="text-xl font-bold text-brand-gradient">GO</Link>
          <div className="w-8" />
        </header>
        <div className="flex-1 p-5 lg:p-8 max-w-[1100px] w-full mx-auto">
          <Outlet />
        </div>
      </div>

      {/* close icon for accessibility when drawer open */}
      {drawerOpen && (
        <button onClick={() => setDrawerOpen(false)} className="lg:hidden fixed top-3 right-3 z-50 p-2 text-white">
          <X size={24} />
        </button>
      )}
    </div>
  )
}
