import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from '../ui/PageTransition'
import {
  LayoutDashboard,
  Users,
  Package,
  Flag,
  FolderTree,
  Menu,
  LogOut,
  ArrowLeft,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout as logoutAction } from '../../store/authSlice'
import { useLogout } from '../../api/auth'
import { Avatar } from '../ui/Avatar'
import { cn } from '../../utils/format'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/listings', label: 'Listings', icon: Package },
  { to: '/admin/reports', label: 'Reports', icon: Flag },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
]

export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const { user } = useAppSelector(s => s.auth)
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
      <div className="px-6 py-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-brand-gradient">GO</Link>
        <span className="text-label font-semibold text-white/50 uppercase tracking-wide">Admin</span>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-button text-body font-medium transition-all',
                isActive ? 'bg-brand-gradient text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'
              )
            }
          >
            <item.icon size={19} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-button text-body font-medium text-white/60 hover:bg-white/8 hover:text-white transition-colors">
          <ArrowLeft size={19} /> Back to site
        </Link>
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <Avatar src={user?.avatar} name={user?.name ?? 'A'} size="sm" />
          <div className="min-w-0">
            <p className="text-body font-semibold text-white truncate">{user?.name}</p>
            <p className="text-caption text-white/40 truncate">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-button text-body font-medium text-status-error hover:bg-white/8 transition-colors">
          <LogOut size={19} /> Log out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-background-soft flex">
      <aside className="hidden lg:flex flex-col w-60 bg-[#111827] sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {drawerOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 z-50 flex flex-col w-64 h-screen bg-[#111827]">
            {SidebarContent}
          </aside>
        </>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 h-14 bg-[#111827] flex items-center justify-between px-4">
          <button onClick={() => setDrawerOpen(true)} className="p-2 -ml-2 text-white">
            <Menu size={22} />
          </button>
          <span className="text-xl font-bold text-brand-gradient">GO Admin</span>
          <div className="w-8" />
        </header>
        <div className="flex-1 p-5 lg:p-8 w-full">
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
