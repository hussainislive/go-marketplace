import { z } from 'zod'

export const sendMessageSchema = z.object({
  content: z.string().max(2000).optional(),
}).refine(data => data.content, {
  message: 'Message must have content or a media file',
})

export const startConversationSchema = z.object({
  otherUserId: z.string().min(1, 'Recipient is required'),
  adId: z.string().optional(),
  message: z.string().min(1, 'Initial message is required').max(2000),
})

export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type StartConversationInput = z.infer<typeof startConversationSchema>
