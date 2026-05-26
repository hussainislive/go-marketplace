import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { success, paginated } from '../utils/ApiResponse'
import * as userService from '../services/user.service'
import { uploadToCloudinary } from '../utils/cloudinary'
import type { UpdateProfileInput } from '../validators/user.validator'

function param(req: Request, key: string): string {
  const val = req.params[key]
  return Array.isArray(val) ? val[0] : (val ?? '')
}

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getMe(req.user!.id)
  res.json(success('User retrieved', user))
})

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as UpdateProfileInput
  const user = await userService.updateProfile(req.user!.id, data)
  res.json(success('Profile updated', user))
})

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' })
    return
  }
  const { url } = await uploadToCloudinary(req.file.buffer, 'avatars')
  const user = await userService.updateAvatar(req.user!.id, url)
  res.json(success('Avatar updated', user))
})

export const getMyStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await userService.getMyStats(req.user!.id)
  res.json(success('Stats retrieved', stats))
})

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getPublicProfile(param(req, 'id'))
  res.json(success('Profile retrieved', user))
})

export const getUserAds = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const { ads, total } = await userService.getUserAds(param(req, 'id'), page, limit)
  res.json(paginated('Ads retrieved', ads, total, page, limit))
})
