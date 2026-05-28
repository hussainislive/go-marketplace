import { Prisma } from '@prisma/client'
import prisma from '../config/database'
import { ApiError } from '../utils/ApiError'

type UserStatus = 'ACTIVE' | 'BANNED' | 'PENDING'
type AdStatus = 'ACTIVE' | 'SOLD' | 'DEACTIVATED' | 'PENDING'

export async function getStats() {
  const [totalUsers, totalAds, activeAds, pendingReports] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.ad.count(),
    prisma.ad.count({ where: { status: 'ACTIVE' } }),
    prisma.report.count({ where: { status: 'PENDING' } }),
  ])

  const adsByCategory = await prisma.category.findMany({
    select: { name: true, _count: { select: { ads: true } } },
    orderBy: { ads: { _count: 'desc' } },
    take: 10,
  })

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const recentUsers = await prisma.user.groupBy({
    by: ['createdAt'],
    where: { createdAt: { gte: sevenDaysAgo } },
    _count: { id: true },
  })

  return { totalUsers, totalAds, activeAds, pendingReports, adsByCategory, recentUsers }
}

export async function getUsers(
  filters: { q?: string; status?: UserStatus; page: number; limit: number }
) {
  const { q, status, page, limit } = filters
  const skip = (page - 1) * limit

  const where: Prisma.UserWhereInput = {}
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (status) where.status = status

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        isVerified: true,
        city: true,
        createdAt: true,
        _count: { select: { ads: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  return { users, total }
}

export async function updateUserStatus(id: string, status: UserStatus) {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw ApiError.notFound('User not found')
  return prisma.user.update({ where: { id }, data: { status } })
}

export async function deleteUser(id: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw ApiError.notFound('User not found')

  // Delete related records in FK-safe order before removing the user.
  const userAds = await prisma.ad.findMany({ where: { userId: id }, select: { id: true } })
  const adIds = userAds.map(a => a.id)

  await prisma.$transaction([
    // Reports filed by the user, against the user's ads, or against the user
    prisma.report.deleteMany({
      where: { OR: [{ reportedById: id }, { adId: { in: adIds } }] },
    }),
    // Favorites by the user or on the user's ads
    prisma.favorite.deleteMany({
      where: { OR: [{ userId: id }, { adId: { in: adIds } }] },
    }),
    // Messages sent or received by the user
    prisma.message.deleteMany({
      where: { OR: [{ senderId: id }, { recipientId: id }] },
    }),
    // Conversation memberships
    prisma.conversationParticipant.deleteMany({ where: { userId: id } }),
    // Notifications for the user
    prisma.notification.deleteMany({ where: { userId: id } }),
    // The user's ads
    prisma.ad.deleteMany({ where: { userId: id } }),
    // Finally the user
    prisma.user.delete({ where: { id } }),
  ])
}

export async function getAdminAds(
  filters: { status?: AdStatus; page: number; limit: number }
) {
  const { status, page, limit } = filters
  const skip = (page - 1) * limit
  const where = status ? { status } : {}

  const [ads, total] = await Promise.all([
    prisma.ad.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { favorites: true, reports: true } },
      },
    }),
    prisma.ad.count({ where }),
  ])

  return { ads, total }
}

export async function adminDeleteAd(id: string): Promise<void> {
  const ad = await prisma.ad.findUnique({ where: { id } })
  if (!ad) throw ApiError.notFound('Ad not found')
  await prisma.ad.delete({ where: { id } })
}

export async function toggleFeatureAd(id: string, isFeatured: boolean) {
  const ad = await prisma.ad.findUnique({ where: { id } })
  if (!ad) throw ApiError.notFound('Ad not found')
  return prisma.ad.update({ where: { id }, data: { isFeatured } })
}
