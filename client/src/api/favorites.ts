import { useQuery } from '@tanstack/react-query'
import api from '../lib/axios'
import type { PaginatedResponse, Ad } from '../types'

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Ad>>('/ads/favorites')
      return data.data
    },
  })
}
