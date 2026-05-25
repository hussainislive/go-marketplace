import { Prisma } from '@prisma/client'
import prisma from '../config/database'
import { ApiError } from '../utils/ApiError'

type NotificationType = 'MESSAGE' | 'FAVORITE' | 'LISTING_UPDATE' | 'ADMIN_ANNOUNCEMENT'

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  metadata?: Record<string, unknown>
) {
  return prisma.notification.create({
    data: { userId, type, title, body, metadata: metadata as Prisma.InputJsonValue | undefined },
  })
}

export async function getNotifications(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit
  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where: { userId } }),
  ])
  return { notifications, total }
}

export async function markRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } })
  if (!notification) throw ApiError.notFound('Notification not found')
  if (notification.userId !== userId) throw ApiError.forbidden('Not authorized')

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  })
}

export async function markAllRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  })
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({ where: { userId, isRead: false } })
}
