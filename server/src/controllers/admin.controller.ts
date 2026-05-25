import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { success, paginated } from '../utils/ApiResponse'
import * as adminService from '../services/admin.service'

type UserStatus = 'ACTIVE' | 'BANNED' | 'PENDING'
type AdStatus = 'ACTIVE' | 'SOLD' | 'DEACTIVATED' | 'PENDING'

function param(req: Request, key: string): string {
  const val = req.params[key]
  return Array.isArray(val) ? val[0] : (val ?? '')
}

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getStats()
  res.json(success('Stats retrieved', stats))
})

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const q = req.query.q as string | undefined
  const status = req.query.status as UserStatus | undefined
  const { users, total } = await adminService.getUsers({ q, status, page, limit })
  res.json(paginated('Users retrieved', users, total, page, limit))
})

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as { status: UserStatus }
  const user = await adminService.updateUserStatus(param(req, 'id'), status)
  res.json(success('User status updated', user))
})

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteUser(param(req, 'id'))
  res.json(success('User deleted'))
})

export const getAds = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const status = req.query.status as AdStatus | undefined
  const { ads, total } = await adminService.getAdminAds({ status, page, limit })
  res.json(paginated('Ads retrieved', ads, total, page, limit))
})

export const deleteAd = asyncHandler(async (req: Request, res: Response) => {
  await adminService.adminDeleteAd(param(req, 'id'))
  res.json(success('Ad deleted'))
})

export const featureAd = asyncHandler(async (req: Request, res: Response) => {
  const { isFeatured } = req.body as { isFeatured: boolean }
  const ad = await adminService.toggleFeatureAd(param(req, 'id'), isFeatured)
  res.json(success('Ad feature status updated', ad))
})
