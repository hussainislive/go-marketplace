import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { success, paginated } from '../utils/ApiResponse'
import * as notificationService from '../services/notification.service'

function param(req: Request, key: string): string {
  const val = req.params[key]
  return Array.isArray(val) ? val[0] : (val ?? '')
}

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const { notifications, total } = await notificationService.getNotifications(req.user!.id, page, limit)
  res.json(paginated('Notifications retrieved', notifications, total, page, limit))
})

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await notificationService.markRead(param(req, 'id'), req.user!.id)
  res.json(success('Notification marked as read', notification))
})

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAllRead(req.user!.id)
  res.json(success('All notifications marked as read'))
})
