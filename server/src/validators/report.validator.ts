import { z } from 'zod'

export const createReportSchema = z.object({
  adId: z.string().min(1, 'Ad ID is required'),
  reason: z.enum(['SPAM', 'FRAUD', 'INAPPROPRIATE', 'FAKE_LISTING', 'HARASSMENT', 'OTHER']),
  description: z.string().max(1000).optional(),
})

export const updateReportStatusSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED']),
})

export type CreateReportInput = z.infer<typeof createReportSchema>
export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>
