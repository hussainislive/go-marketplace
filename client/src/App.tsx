import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { router } from './routes'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { setUser, logout } from './store/authSlice'
import { setConnected, userOnline, userOffline } from './store/socketSlice'
import { incrementUnread } from './store/notificationSlice'
import { connectSocket, disconnectSocket, socket } from './lib/socket'
import { AuthModal } from './components/shared/AuthModal'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import api, { setTokens, getAccessToken } from './lib/axios'

// Pick up tokens passed in the URL after Google OAuth redirect.
// Runs synchronously at module load so AuthBootstrap sees the tokens immediately.
;(function captureOAuthTokens() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const at = params.get('_at')
  const rt = params.get('_rt')
  if (at && rt) {
    setTokens(at, rt)
    params.delete('_at')
    params.delete('_rt')
    const cleaned = params.toString()
    const newUrl = window.location.pathname + (cleaned ? `?${cleaned}` : '') + window.location.hash
    window.history.replaceState({}, '', newUrl)
  }
})()

function SocketManager() {
  const { isAuthenticated, user } = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    connectSocket()

    socket.on('connect', () => dispatch(setConnected(true)))
    socket.on('disconnect', () => dispatch(setConnected(false)))
    socket.on('user:online', ({ userId, online }: { userId: string; online: boolean }) => {
      if (online) dispatch(userOnline(userId))
      else dispatch(userOffline(userId))
    })
    socket.on('notification:new', () => {
      dispatch(incrementUnread())
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('user:online')
      socket.off('notification:new')
      disconnectSocket()
      dispatch(setConnected(false))
    }
  }, [isAuthenticated, user, dispatch])

  return null
}

function AuthBootstrap() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function bootstrap() {
      // If we already have an access token in memory (sessionStorage survive reload),
      // try /users/me directly. Otherwise attempt a token refresh first so Safari
      // users (whose cookies are blocked) can still restore session via stored refreshToken.
      if (!getAccessToken()) {
        const storedRefresh = sessionStorage.getItem('_rt')
        if (storedRefresh) {
          try {
            const { data } = await api.post<{ data: { accessToken: string; refreshToken: string } }>(
              '/auth/refresh',
              { refreshToken: storedRefresh }
            )
            setTokens(data.data.accessToken, data.data.refreshToken)
          } catch {
            dispatch(logout())
            return
          }
        } else {
          dispatch(logout())
          return
        }
      }

      api
        .get('/users/me')
        .then(res => {
          dispatch(setUser(res.data.data))
        })
        .catch(() => {
          dispatch(logout())
        })
    }

    void bootstrap()
  }, [dispatch])

  return null
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthBootstrap />
        <SocketManager />
        <RouterProvider router={router} />
        <AuthModal />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            borderRadius: '14px',
            padding: '12px 16px',
          },
          success: { style: { background: '#22C55E', color: '#fff' } },
          error: { style: { background: '#EF4444', color: '#fff' } },
        }}
        />
      </HelmetProvider>
    </ErrorBoundary>
  )
}
