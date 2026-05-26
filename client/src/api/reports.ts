import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'
import type { ApiResponse, PaginatedResponse, Report, ReportReason, ReportStatus } from '../types'

export interface CreateReportPayload {
  adId: string
  reason: ReportReason
  description?: string
}

export function useCreateReport() {
  return useMutation({
    mutationFn: async (payload: CreateReportPayload) => {
      const { data } = await api.post<ApiResponse<Report>>('/reports', payload)
      return data.data
    },
  })
}

export function useReports(status?: ReportStatus) {
  return useQuery({
    queryKey: ['adminReports', status],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Report>>('/reports', {
        params: status ? { status } : {},
      })
      return data
    },
  })
}

export function useUpdateReportStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReportStatus }) => {
      const { data } = await api.patch<ApiResponse<Report>>(`/reports/${id}/status`, { status })
      return data.data
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['adminReports'] })
    },
  })
}
