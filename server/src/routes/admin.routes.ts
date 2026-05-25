import { Router } from 'express'
import * as adminController from '../controllers/admin.controller'
import { authenticate } from '../middleware/authenticate'
import { authorize } from '../middleware/authorize'

const adminGuard = [authenticate, authorize('ADMIN', 'SUPER_ADMIN')]

const router = Router()

router.get('/stats', ...adminGuard, adminController.getStats)
router.get('/users', ...adminGuard, adminController.getUsers)
router.patch('/users/:id/status', ...adminGuard, adminController.updateUserStatus)
router.delete('/users/:id', ...adminGuard, adminController.deleteUser)
router.get('/ads', ...adminGuard, adminController.getAds)
router.delete('/ads/:id', ...adminGuard, adminController.deleteAd)
router.patch('/ads/:id/feature', ...adminGuard, adminController.featureAd)

export default router
