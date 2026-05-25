import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { openAuthModal } from './store/uiSlice'

// ── Lazy-loaded pages ────────────────────────────────────────────────────────
const HomePage           = lazy(() => import('./pages/public/HomePage'))
const SearchPage         = lazy(() => import('./pages/public/SearchPage'))
const AdDetailPage       = lazy(() => import('./pages/public/AdDetailPage'))
const LoginPage          = lazy(() => import('./pages/public/LoginPage'))
const SignupPage         = lazy(() => import('./pages/public/SignupPage'))

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

// ── Loading fallback ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-soft">
      <div className="w-8 h-8 rounded-full border-4 border-brand-pink border-t-transparent animate-spin" />
    </div>
  )
}

// ── Protected route guard ────────────────────────────────────────────────────
// Unauthenticated users → open AuthModal (not redirect)
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()

  if (isLoading) return <PageLoader />

  if (!isAuthenticated) {
    dispatch(openAuthModal('login'))
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

// ── Admin route guard ────────────────────────────────────────────────────────
// Non-admins → redirect to /
function AdminRoute() {
  const { user, isLoading } = useAppSelector(s => s.auth)

  if (isLoading) return <PageLoader />

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

// ── Router ───────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────────────────────────────────
  {
    path: '/',
    element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense>,
  },
  {
    path: '/search',
    element: <Suspense fallback={<PageLoader />}><SearchPage /></Suspense>,
  },
  {
    path: '/ads/:id',
    element: <Suspense fallback={<PageLoader />}><AdDetailPage /></Suspense>,
  },
  {
    path: '/login',
    element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>,
  },
  {
    path: '/signup',
    element: <Suspense fallback={<PageLoader />}><SignupPage /></Suspense>,
  },

  // ── Protected routes (auth required) ───────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>,
      },
      {
        path: '/dashboard/create',
        element: <Suspense fallback={<PageLoader />}><CreateAdPage /></Suspense>,
      },
      {
        path: '/dashboard/ads/:id/edit',
        element: <Suspense fallback={<PageLoader />}><EditAdPage /></Suspense>,
      },
      {
        path: '/dashboard/ads',
        element: <Suspense fallback={<PageLoader />}><MyAdsPage /></Suspense>,
      },
      {
        path: '/messages',
        element: <Suspense fallback={<PageLoader />}><MessagesPage /></Suspense>,
      },
      {
        path: '/notifications',
        element: <Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense>,
      },
      {
        path: '/favorites',
        element: <Suspense fallback={<PageLoader />}><FavoritesPage /></Suspense>,
      },
      {
        path: '/profile',
        element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>,
      },
      {
        path: '/settings',
        element: <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>,
      },
    ],
  },

  // ── Admin routes (SUPER_ADMIN / ADMIN only) ────────────────────────────────
  {
    element: <AdminRoute />,
    children: [
      {
        path: '/admin',
        element: <Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense>,
      },
      {
        path: '/admin/users',
        element: <Suspense fallback={<PageLoader />}><AdminUsersPage /></Suspense>,
      },
      {
        path: '/admin/listings',
        element: <Suspense fallback={<PageLoader />}><AdminListingsPage /></Suspense>,
      },
      {
        path: '/admin/reports',
        element: <Suspense fallback={<PageLoader />}><AdminReportsPage /></Suspense>,
      },
      {
        path: '/admin/categories',
        element: <Suspense fallback={<PageLoader />}><AdminCategoriesPage /></Suspense>,
      },
    ],
  },

  // ── 404 fallback ───────────────────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
