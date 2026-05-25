import prisma from '../config/database'
import { ApiError } from '../utils/ApiError'
import type { UpdateProfileInput } from '../validators/user.validator'

const safeUserSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  avatar: true,
  coverImage: true,
  bio: true,
  city: true,
  isVerified: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { ads: true, favorites: true } },
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: safeUserSelect })
  if (!user) throw ApiError.notFound('User not found')
  return user
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: safeUserSelect,
  })
}

export async function updateAvatar(userId: string, avatarUrl: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatar: avatarUrl },
    select: safeUserSelect,
  })
}

export async function getPublicProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      avatar: true,
      coverImage: true,
      bio: true,
      city: true,
      isVerified: true,
      createdAt: true,
      _count: { select: { ads: true } },
    },
  })
  if (!user) throw ApiError.notFound('User not found')
  return user
}

export async function getUserAds(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit
  const [ads, total] = await Promise.all([
    prisma.ad.findMany({
      where: { userId, status: 'ACTIVE' },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.ad.count({ where: { userId, status: 'ACTIVE' } }),
  ])
  return { ads, total }
}
