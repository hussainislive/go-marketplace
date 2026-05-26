import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { success, paginated } from '../utils/ApiResponse'
import * as adService from '../services/ad.service'
import { uploadToCloudinary } from '../utils/cloudinary'
import { searchAdsSchema } from '../validators/ad.validator'
import type { CreateAdInput, UpdateAdInput, AdStatusInput } from '../validators/ad.validator'

function param(req: Request, key: string): string {
  const val = req.params[key]
  return Array.isArray(val) ? val[0] : (val ?? '')
}

export const createAd = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateAdInput
  const files = req.files as Express.Multer.File[] | undefined
  const imageUrls: string[] = []

  if (files?.length) {
    const uploads = await Promise.all(files.map(f => uploadToCloudinary(f.buffer, 'ads')))
    imageUrls.push(...uploads.map(u => u.url))
  }

  const ad = await adService.createAd(req.user!.id, data, imageUrls)
  res.status(201).json(success('Ad created successfully', ad))
})

export const getAds = asyncHandler(async (req: Request, res: Response) => {
  const filters = searchAdsSchema.parse(req.query)
  const { ads, total } = await adService.getAds(filters)
  res.json(paginated('Ads retrieved', ads, total, filters.page, filters.limit))
})

export const getFeaturedAds = asyncHandler(async (_req: Request, res: Response) => {
  const ads = await adService.getFeaturedAds()
  res.json(success('Featured ads retrieved', ads))
})

export const getAdById = asyncHandler(async (req: Request, res: Response) => {
  const ad = await adService.getAdById(param(req, 'id'))
  res.json(success('Ad retrieved', ad))
})

export const updateAd = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as UpdateAdInput
  const files = req.files as Express.Multer.File[] | undefined
  const imageUrls: string[] = []

  if (files?.length) {
    const uploads = await Promise.all(files.map(f => uploadToCloudinary(f.buffer, 'ads')))
    imageUrls.push(...uploads.map(u => u.url))
  }

  const updateData = imageUrls.length > 0 ? { ...data, images: imageUrls } : data
  const ad = await adService.updateAd(param(req, 'id'), req.user!.id, updateData)
  res.json(success('Ad updated', ad))
})

export const deleteAd = asyncHandler(async (req: Request, res: Response) => {
  await adService.deleteAd(param(req, 'id'), req.user!.id)
  res.json(success('Ad deleted'))
})

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const result = await adService.toggleFavorite(req.user!.id, param(req, 'id'))
  res.json(success(result.favorited ? 'Added to favorites' : 'Removed from favorites', result))
})

export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  const result = await adService.toggleFavorite(req.user!.id, param(req, 'id'))
  res.json(success('Removed from favorites', result))
})

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as AdStatusInput
  const ad = await adService.updateAdStatus(param(req, 'id'), req.user!.id, status)
  res.json(success('Ad status updated', ad))
})

export const getMyAds = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const status = req.query.status as string | undefined
  const { ads, total } = await adService.getMyAds(req.user!.id, status, page, limit)
  res.json(paginated('My ads retrieved', ads, total, page, limit))
})

export const getFavorites = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const { ads, total } = await adService.getFavorites(req.user!.id, page, limit)
  res.json(paginated('Favorites retrieved', ads, total, page, limit))
})
