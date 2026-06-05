import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('A valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

export type ContactInput = z.infer<typeof contactSchema>
