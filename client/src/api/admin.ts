import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'
import type {
  ApiResponse,
  PaginatedResponse,
  AdminStats,
  AdminUser,
  Ad,
  UserStatus,
} from '../types'

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AdminStats>>('/admin/stats')
      return data.data
    },
  })
}

export interface AdminUserFilters {
  q?: string
  status?: UserStatus
  page?: number
}

export function useAdminUsers(filters: AdminUserFilters) {
  return useQuery({
    queryKey: ['adminUsers', filters],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (filters.q) params.q = filters.q
      if (filters.status) params.status = filters.status
      if (filters.page) params.page = String(filters.page)
      const { data } = await api.get<PaginatedResponse<AdminUser>>('/admin/users', { params })
      return data
    },
  })
}

export function useUpdateUserStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
      const { data } = await api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/status`, { status })
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`)
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })
}

export function useAdminAds(status?: string) {
  return useQuery({
    queryKey: ['adminAds', status],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Ad>>('/admin/ads', {
        params: status ? { status } : {},
      })
      return data
    },
  })
}

export function useAdminDeleteAd() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/ads/${id}`)
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['adminAds'] })
    },
  })
}

export function useFeatureAd() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const { data } = await api.patch<ApiResponse<Ad>>(`/admin/ads/${id}/feature`, { isFeatured })
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['adminAds'] })
    },
  })
}
