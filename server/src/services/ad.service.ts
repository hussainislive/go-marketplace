import { Prisma } from '@prisma/client'
import prisma from '../config/database'
import { ApiError } from '../utils/ApiError'
import { createNotification } from './notification.service'
import { cacheGetOrSet, CACHE_KEYS } from '../utils/cache'
import type { CreateAdInput, UpdateAdInput, SearchAdsInput } from '../validators/ad.validator'

type AdStatus = 'ACTIVE' | 'SOLD' | 'DEACTIVATED' | 'PENDING'
type Condition = 'NEW' | 'USED' | 'REFURBISHED'

const FEATURED_TTL = 5 * 60 // 5 minutes
const ADS_LIST_TTL = 60 // 60 seconds — short, so new ads appear quickly

const adInclude = {
  category: { select: { id: true, name: true, slug: true, icon: true } },
  user: { select: { id: true, name: true, avatar: true, isVerified: true, city: true } },
  _count: { select: { favorites: true } },
}

export async function createAd(userId: string, data: CreateAdInput, imageUrls: string[]) {
  return prisma.ad.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      negotiable: data.negotiable ?? false,
      condition: data.condition as Condition,
      city: data.city,
      categoryId: data.categoryId,
      userId,
      images: imageUrls,
    },
    include: adInclude,
  })
}

export async function getAds(filters: SearchAdsInput) {
  // Cache each unique filter combination for a short window. The key is a stable
  // hash of the normalized filters so identical queries share a cache entry.
  const filtersHash = JSON.stringify(filters)
  return cacheGetOrSet(CACHE_KEYS.adsList(filtersHash), ADS_LIST_TTL, () => queryAds(filters))
}

async function queryAds(filters: SearchAdsInput) {
  const { q, category, city, minPrice, maxPrice, condition, sort, page, limit } = filters
  const skip = (page - 1) * limit

  const where: Prisma.AdWhereInput = { status: 'ACTIVE' }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (category) where.category = { slug: category }
  if (city) where.city = { contains: city, mode: 'insensitive' }
  if (minPrice) where.price = { gte: minPrice }
  if (maxPrice) {
    const existing = where.price as Record<string, string> | undefined
    where.price = { ...(existing ?? {}), lte: maxPrice }
  }
  if (condition) where.condition = condition as Condition

  const orderBy: Prisma.AdOrderByWithRelationInput =
    sort === 'price_asc'
      ? { price: 'asc' }
      : sort === 'price_desc'
        ? { price: 'desc' }
        : sort === 'oldest'
          ? { createdAt: 'asc' }
          : { createdAt: 'desc' }

  const [ads, total] = await Promise.all([
    prisma.ad.findMany({ where, skip, take: limit, orderBy, include: adInclude }),
    prisma.ad.count({ where }),
  ])

  return { ads, total }
}

export async function getFeaturedAds() {
  return cacheGetOrSet(CACHE_KEYS.featuredAds, FEATURED_TTL, () =>
    prisma.ad.findMany({
      where: { isFeatured: true, status: 'ACTIVE' },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: adInclude,
    })
  )
}

export async function getAdById(id: string) {
  const ad = await prisma.ad.findUnique({ where: { id }, include: adInclude })
  if (!ad) throw ApiError.notFound('Ad not found')
  await prisma.ad.update({ where: { id }, data: { views: { increment: 1 } } })
  return ad
}

export async function updateAd(id: string, userId: string, data: UpdateAdInput & { images?: string[] }) {
  const ad = await prisma.ad.findUnique({ where: { id } })
  if (!ad) throw ApiError.notFound('Ad not found')
  if (ad.userId !== userId) throw ApiError.forbidden('Not authorized to edit this ad')

  return prisma.ad.update({
    where: { id },
    data: {
      ...data,
      condition: data.condition as Condition | undefined,
    },
    include: adInclude,
  })
}

export async function deleteAd(id: string, userId: string): Promise<void> {
  const ad = await prisma.ad.findUnique({ where: { id } })
  if (!ad) throw ApiError.notFound('Ad not found')
  if (ad.userId !== userId) throw ApiError.forbidden('Not authorized to delete this ad')
  await prisma.ad.delete({ where: { id } })
}

export async function toggleFavorite(
  userId: string,
  adId: string
): Promise<{ favorited: boolean }> {
  const ad = await prisma.ad.findUnique({ where: { id: adId } })
  if (!ad) throw ApiError.notFound('Ad not found')

  const existing = await prisma.favorite.findUnique({
    where: { userId_adId: { userId, adId } },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { userId_adId: { userId, adId } } })
    return { favorited: false }
  }

  await prisma.favorite.create({ data: { userId, adId } })

  if (ad.userId !== userId) {
    await createNotification(
      ad.userId,
      'FAVORITE',
      'Someone favorited your listing',
      `Your ad "${ad.title}" was saved by a buyer`,
      { adId }
    )
  }

  return { favorited: true }
}

export async function getFavorites(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit
  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { ad: { include: adInclude } },
    }),
    prisma.favorite.count({ where: { userId } }),
  ])
  return { ads: favorites.map(f => f.ad), total }
}

export async function updateAdStatus(id: string, userId: string, status: AdStatus) {
  const ad = await prisma.ad.findUnique({ where: { id } })
  if (!ad) throw ApiError.notFound('Ad not found')
  if (ad.userId !== userId) throw ApiError.forbidden('Not authorized')

  return prisma.ad.update({ where: { id }, data: { status }, include: adInclude })
}

export async function getMyAds(userId: string, status: string | undefined, page: number, limit: number) {
  const skip = (page - 1) * limit
  const where: Prisma.AdWhereInput = { userId }
  if (status) where.status = status as AdStatus

  const [ads, total] = await Promise.all([
    prisma.ad.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: adInclude }),
    prisma.ad.count({ where }),
  ])

  return { ads, total }
}
