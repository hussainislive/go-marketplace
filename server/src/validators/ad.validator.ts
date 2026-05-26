import { z } from 'zod'

// Multipart/form-data sends every field as a string, so `negotiable` arrives
// as "true"/"false". Coerce it to a real boolean before validation.
const booleanFromString = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform(v => v === true || v === 'true')

export const createAdSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number'),
  negotiable: booleanFromString.optional().default(false),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']),
  city: z.string().min(2, 'City is required').max(80),
  categoryId: z.string().min(1, 'Category is required'),
})

export const updateAdSchema = createAdSchema.partial()

export const searchAdsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']).optional(),
  sort: z.enum(['newest', 'oldest', 'price_asc', 'price_desc']).optional().default('newest'),
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('20').transform(Number),
})

export const adStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SOLD', 'DEACTIVATED']),
})

export type CreateAdInput = z.infer<typeof createAdSchema>
export type UpdateAdInput = z.infer<typeof updateAdSchema>
export type SearchAdsInput = z.infer<typeof searchAdsSchema>
export type AdStatusInput = z.infer<typeof adStatusSchema>
