import { useMutation } from '@tanstack/react-query'
import api from '../lib/axios'
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

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<ApiResponse<AuthUser>>('/auth/login', payload)
      return data.data
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
      await api.post('/auth/logout')
    },
  })
}
