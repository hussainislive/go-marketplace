import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'
import type { Category, ApiResponse } from '../types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/categories')
      return data.data
    },
    staleTime: 1000 * 60 * 30, // categories rarely change
  })
}

export interface CategoryPayload {
  name: string
  icon: string
  slug: string
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CategoryPayload) => {
      const { data } = await api.post<ApiResponse<Category>>('/categories', payload)
      return data.data
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: CategoryPayload & { id: string }) => {
      const { data } = await api.put<ApiResponse<Category>>(`/categories/${id}`, payload)
      return data.data
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`)
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}
