import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().min(7).max(20).optional(),
  bio: z.string().max(500).optional(),
  city: z.string().min(2).max(80).optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
