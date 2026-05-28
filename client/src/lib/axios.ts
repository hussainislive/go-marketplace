import axios from 'axios'
import { store } from '../store'
import { logout } from '../store/authSlice'

// In-memory token store — persists across navigation but not page reload.
// For page reload we restore from sessionStorage (tab-scoped, not cross-tab).
let _accessToken: string | null = sessionStorage.getItem('_at')
let _refreshToken: string | null = sessionStorage.getItem('_rt')

export function setTokens(access: string, refresh: string) {
  _accessToken = access
  _refreshToken = refresh
  sessionStorage.setItem('_at', access)
  sessionStorage.setItem('_rt', refresh)
}

export function clearTokens() {
  _accessToken = null
  _refreshToken = null
  sessionStorage.removeItem('_at')
  sessionStorage.removeItem('_rt')
}

export function getAccessToken() {
  return _accessToken
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token to every request as Authorization header
api.interceptors.request.use(config => {
  const token = _accessToken
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = []

function processQueue(error: unknown) {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(undefined)))
  failedQueue = []
}

const NO_REFRESH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/users/me']

function isNoRefresh(url?: string): boolean {
  if (!url) return false
  return NO_REFRESH_PATHS.some(p => url.includes(p))
}

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isNoRefresh(originalRequest.url as string | undefined)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch(e => Promise.reject(e))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Send refresh token in body so Safari (which blocks cross-site cookies) can refresh
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL as string}/auth/refresh`,
          { refreshToken: _refreshToken },
          { withCredentials: true }
        )
        const { accessToken, refreshToken } = data.data as { accessToken: string; refreshToken: string }
        setTokens(accessToken, refreshToken)
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        clearTokens()
        store.dispatch(logout())
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
