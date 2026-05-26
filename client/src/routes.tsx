import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from './store/hooks'
import { PublicLayout } from './components/layout/PublicLayout'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { AdminLayout } from './components/layout/AdminLayout'

// ── Lazy-loaded pages ────────────────────────────────────────────────────────
const HomePage           = lazy(() => import('./pages/public/HomePage'))
const SearchPage         = lazy(() => import('./pages/public/SearchPage'))
const AdDetailPage       = lazy(() => import('./pages/public/AdDetailPage'))
const LoginPage          = lazy(() => import('./pages/public/LoginPage'))
const SignupPage         = lazy(() => import('./pages/public/SignupPage'))
const VerifyEmailPage    = lazy(() => import('./pages/public/VerifyEmailPage'))

const DashboardPage      = lazy(() => import('./pages/dashboard/DashboardPage'))
const CreateAdPage       = lazy(() => import('./pages/dashboard/CreateAdPage'))
const EditAdPage         = lazy(() => import('./pages/dashboard/EditAdPage'))
const MyAdsPage          = lazy(() => import('./pages/dashboard/MyAdsPage'))
const MessagesPage       = lazy(() => import('./pages/dashboard/MessagesPage'))
const NotificationsPage  = lazy(() => import('./pages/dashboard/NotificationsPage'))
const FavoritesPage      = lazy(() => import('./pages/dashboard/FavoritesPage'))
const ProfilePage        = lazy(() => import('./pages/dashboard/ProfilePage'))
const SettingsPage       = lazy(() => import('./pages/dashboard/SettingsPage'))

const AdminDashboardPage  = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminUsersPage      = lazy(() => import('./pages/admin/AdminUsersPage'))
const AdminListingsPage   = lazy(() => import('./pages/admin/AdminListingsPage'))
const AdminReportsPage    = lazy(() => import('./pages/admin/AdminReportsPage'))
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'))

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-[3px] border-brand-pink border-t-transparent animate-spin" />
    </div>
  )
}

function L({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

// ── Protected route guard ────────────────────────────────────────────────────
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAppSelector(s => s.auth)
  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/" replace />
  return <Outlet />
}

// ── Admin route guard ────────────────────────────────────────────────────────
function AdminRoute() {
  const { user, isLoading } = useAppSelector(s => s.auth)
  if (isLoading) return <PageLoader />
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return <Navigate to="/" replace />
  return <Outlet />
}

export const router = createBrowserRouter([
  // ── Auth pages (no layout chrome) ──────────────────────────────────────────
  { path: '/login', element: <L><LoginPage /></L> },
  { path: '/signup', element: <L><SignupPage /></L> },
  { path: '/verify-email', element: <L><VerifyEmailPage /></L> },

  // ── Public (Header + Footer) ───────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <L><HomePage /></L> },
      { path: '/search', element: <L><SearchPage /></L> },
      { path: '/ads/:id', element: <L><AdDetailPage /></L> },
    ],
  },

  // ── Protected dashboard (sidebar) ──────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <L><DashboardPage /></L> },
          { path: '/dashboard/ads', element: <L><MyAdsPage /></L> },
          { path: '/dashboard/create', element: <L><CreateAdPage /></L> },
          { path: '/dashboard/ads/:id/edit', element: <L><EditAdPage /></L> },
          { path: '/notifications', element: <L><NotificationsPage /></L> },
          { path: '/favorites', element: <L><FavoritesPage /></L> },
          { path: '/profile', element: <L><ProfilePage /></L> },
          { path: '/settings', element: <L><SettingsPage /></L> },
        ],
      },
      // Messages is full-height — no dashboard padding wrapper
      { path: '/messages', element: <L><MessagesPage /></L> },
    ],
  },

  // ── Admin (dark sidebar) ───────────────────────────────────────────────────
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <L><AdminDashboardPage /></L> },
          { path: '/admin/users', element: <L><AdminUsersPage /></L> },
          { path: '/admin/listings', element: <L><AdminListingsPage /></L> },
          { path: '/admin/reports', element: <L><AdminReportsPage /></L> },
          { path: '/admin/categories', element: <L><AdminCategoriesPage /></L> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])
