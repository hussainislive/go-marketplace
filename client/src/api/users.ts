import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'
import type { ApiResponse, DashboardStats, UserProfile, PaginatedResponse, Ad } from '../types'
import type { AuthUser } from '../store/authSlice'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<DashboardStats>>('/users/me/stats')
      return data.data
    },
  })
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<UserProfile>>('/users/me')
      return data.data
    },
  })
}

export function usePublicProfile(id: string | undefined) {
  return useQuery({
    queryKey: ['profile', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<UserProfile>>(`/users/${id}/profile`)
      return data.data
    },
  })
}

export function useUserAds(id: string | undefined) {
  return useQuery({
    queryKey: ['userAds', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Ad>>(`/users/${id}/ads`)
      return data
    },
  })
}

export interface UpdateProfilePayload {
  name?: string
  phone?: string
  bio?: string
  city?: string
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await api.put<ApiResponse<AuthUser>>('/users/me', payload)
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useUpdateAvatar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData()
      fd.append('avatar', file)
      const { data } = await api.put<ApiResponse<AuthUser>>('/users/me/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
