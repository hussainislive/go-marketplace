import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'
import type { Ad, PaginatedResponse, PaginationMeta, ApiResponse, AdStatus } from '../types'

export interface AdFilters {
  q?: string
  category?: string
  city?: string
  minPrice?: string
  maxPrice?: string
  condition?: string
  sort?: string
  page?: number
  limit?: number
}

function buildParams(filters: AdFilters): Record<string, string> {
  const params: Record<string, string> = {}
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params[k] = String(v)
  })
  return params
}

// Paginated ads list (search)
export function useAds(filters: AdFilters) {
  return useQuery({
    queryKey: ['ads', filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Ad>>('/ads', { params: buildParams(filters) })
      return data
    },
  })
}

// Infinite scroll for home "latest ads"
export function useInfiniteAds(filters: AdFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['ads', 'infinite', filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<PaginatedResponse<Ad>>('/ads', {
        params: buildParams({ ...filters, page: pageParam as number, limit: 12 }),
      })
      return data
    },
    getNextPageParam: (lastPage: PaginatedResponse<Ad>) => {
      const meta: PaginationMeta = lastPage.meta
      return meta.page < meta.totalPages ? meta.page + 1 : undefined
    },
  })
}

export function useFeaturedAds() {
  return useQuery({
    queryKey: ['ads', 'featured'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Ad[]>>('/ads/featured')
      return data.data
    },
  })
}

export function useAd(id: string | undefined) {
  return useQuery({
    queryKey: ['ad', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Ad>>(`/ads/${id}`)
      return data.data
    },
  })
}

export function useMyAds(status?: string) {
  return useQuery({
    queryKey: ['myAds', status],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Ad>>('/ads/me', {
        params: status ? { status } : {},
      })
      return data
    },
  })
}

export function useCreateAd() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post<ApiResponse<Ad>>('/ads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['ads'] })
      void qc.invalidateQueries({ queryKey: ['myAds'] })
    },
  })
}

export function useUpdateAd(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.put<ApiResponse<Ad>>(`/ads/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['ad', id] })
      void qc.invalidateQueries({ queryKey: ['myAds'] })
    },
  })
}

export function useUpdateAdStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AdStatus }) => {
      const { data } = await api.patch<ApiResponse<Ad>>(`/ads/${id}/status`, { status })
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['myAds'] })
    },
  })
}

export function useDeleteAd() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/ads/${id}`)
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['myAds'] })
      void qc.invalidateQueries({ queryKey: ['ads'] })
    },
  })
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ adId, favorited }: { adId: string; favorited: boolean }) => {
      if (favorited) {
        await api.delete(`/ads/${adId}/favorite`)
      } else {
        await api.post(`/ads/${adId}/favorite`)
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
