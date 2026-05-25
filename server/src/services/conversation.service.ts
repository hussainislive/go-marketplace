import prisma from '../config/database'
import { ApiError } from '../utils/ApiError'
import { createNotification } from './notification.service'

type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'VOICE_NOTE'

const conversationSelect = {
  id: true,
  adId: true,
  createdAt: true,
  participants: {
    include: {
      user: { select: { id: true, name: true, avatar: true, isVerified: true } },
    },
  },
  messages: {
    take: 1,
    orderBy: { createdAt: 'desc' as const },
    select: { id: true, content: true, createdAt: true, isRead: true, senderId: true },
  },
}

export async function getConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    orderBy: { createdAt: 'desc' },
    select: conversationSelect,
  })
}

export async function startConversation(
  userId: string,
  otherUserId: string,
  adId: string | undefined,
  initialMessage: string
) {
  if (userId === otherUserId) throw ApiError.badRequest('Cannot message yourself')

  const existing = await prisma.conversation.findFirst({
    where: {
      adId: adId ?? null,
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: otherUserId } } },
      ],
    },
  })

  const conversation = existing
    ? existing
    : await prisma.conversation.create({
        data: {
          adId,
          participants: {
            create: [{ userId }, { userId: otherUserId }],
          },
        },
      })

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: userId,
      recipientId: otherUserId,
      content: initialMessage,
    },
  })

  await createNotification(
    otherUserId,
    'MESSAGE',
    'New message',
    initialMessage.substring(0, 80),
    { conversationId: conversation.id }
  )

  return { conversation, message }
}

export async function getMessages(conversationId: string, userId: string, page: number, limit: number) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  })
  if (!participant) throw ApiError.forbidden('Not a participant in this conversation')

  const skip = (page - 1) * limit
  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    }),
    prisma.message.count({ where: { conversationId } }),
  ])

  return { messages: messages.reverse(), total }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string | undefined,
  mediaUrl: string | undefined,
  mediaType: MediaType | undefined
) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: senderId } },
  })
  if (!participant) throw ApiError.forbidden('Not a participant in this conversation')

  const recipients = await prisma.conversationParticipant.findMany({
    where: { conversationId, userId: { not: senderId } },
  })

  const recipientId = recipients[0]?.userId

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      recipientId,
      content,
      mediaUrl,
      mediaType,
    },
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
    },
  })

  if (recipientId && content) {
    await createNotification(
      recipientId,
      'MESSAGE',
      'New message',
      content.substring(0, 80),
      { conversationId }
    )
  }

  return message
}

export async function markMessagesRead(conversationId: string, userId: string): Promise<void> {
  await prisma.message.updateMany({
    where: { conversationId, recipientId: userId, isRead: false },
    data: { isRead: true },
  })
}
