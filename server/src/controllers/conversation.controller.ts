import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { success, paginated } from '../utils/ApiResponse'
import * as convService from '../services/conversation.service'
import { uploadToCloudinary } from '../utils/cloudinary'

type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'VOICE_NOTE'

function param(req: Request, key: string): string {
  const val = req.params[key]
  return Array.isArray(val) ? val[0] : (val ?? '')
}

export const getConversations = asyncHandler(async (req: Request, res: Response) => {
  const conversations = await convService.getConversations(req.user!.id)
  res.json(success('Conversations retrieved', conversations))
})

export const startConversation = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as {
    otherUserId: string
    adId?: string
    initialMessage?: string
    message?: string
  }
  const initialMessage = body.initialMessage ?? body.message ?? ''
  const result = await convService.startConversation(
    req.user!.id,
    body.otherUserId,
    body.adId,
    initialMessage
  )
  res.status(201).json(success('Conversation started', result))
})

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 50
  const { messages, total } = await convService.getMessages(param(req, 'id'), req.user!.id, page, limit)
  res.json(paginated('Messages retrieved', messages, total, page, limit))
})

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body as { content?: string }
  let mediaUrl: string | undefined
  let mediaType: MediaType | undefined

  if (req.file) {
    // 'auto' lets Cloudinary detect image / video / audio correctly
    // (audio/webm voice notes are stored under the video pipeline).
    const upload = await uploadToCloudinary(req.file.buffer, 'messages', 'auto')
    mediaUrl = upload.url

    const bodyMediaType = (req.body as { mediaType?: string }).mediaType
    if (bodyMediaType === 'VOICE_NOTE') {
      mediaType = 'VOICE_NOTE'
    } else if (req.file.mimetype.startsWith('image/')) {
      mediaType = 'IMAGE'
    } else if (req.file.mimetype.startsWith('video/')) {
      mediaType = 'VIDEO'
    } else {
      mediaType = 'AUDIO'
    }
  }

  const message = await convService.sendMessage(
    param(req, 'id'),
    req.user!.id,
    content,
    mediaUrl,
    mediaType
  )
  res.status(201).json(success('Message sent', message))
})

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  await convService.markMessagesRead(param(req, 'id'), req.user!.id)
  res.json(success('Messages marked as read'))
})
