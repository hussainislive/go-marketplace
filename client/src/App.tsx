import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './routes'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { setUser, logout } from './store/authSlice'
import { setConnected, userOnline, userOffline } from './store/socketSlice'
import { incrementUnread } from './store/notificationSlice'
import { connectSocket, disconnectSocket, socket } from './lib/socket'
import api from './lib/axios'

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
    api
      .get('/users/me')
      .then(res => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        dispatch(setUser(res.data.data))
      })
      .catch(() => {
        dispatch(logout())
      })
  }, [dispatch])

  return null
}

export default function App() {
  return (
    <>
      <AuthBootstrap />
      <SocketManager />
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
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
    </>
  )
}
