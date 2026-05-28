import { useMutation } from '@tanstack/react-query'
import api, { setTokens, clearTokens } from '../lib/axios'
import type { ApiResponse } from '../types'
import type { AuthUser } from '../store/authSlice'

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

interface LoginResponseData {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<ApiResponse<LoginResponseData>>('/auth/login', payload)
      const { user, accessToken, refreshToken } = data.data
      setTokens(accessToken, refreshToken)
      return user
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<ApiResponse<{ id: string; email: string; name: string }>>(
        '/auth/register',
        payload
      )
      return data.data
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout').catch(() => undefined)
      clearTokens()
    },
  })
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async (email: string) => {
      await api.post('/auth/resend-verification', { email })
    },
  })
}
