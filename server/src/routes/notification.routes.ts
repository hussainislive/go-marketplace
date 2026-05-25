import { Router } from 'express'
import * as notificationController from '../controllers/notification.controller'
import { authenticate } from '../middleware/authenticate'

const router = Router()

router.get('/', authenticate, notificationController.getNotifications)
router.patch('/:id/read', authenticate, notificationController.markRead)
router.post('/read-all', authenticate, notificationController.markAllRead)

export default router
