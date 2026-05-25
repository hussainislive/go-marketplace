import { Router } from 'express'
import * as userController from '../controllers/user.controller'
import { authenticate } from '../middleware/authenticate'
import { validate } from '../middleware/validate'
import { uploadAvatar } from '../middleware/upload'
import { updateProfileSchema } from '../validators/user.validator'

const router = Router()

router.get('/me', authenticate, userController.getMe)
router.put('/me', authenticate, validate(updateProfileSchema), userController.updateMe)
router.put('/me/avatar', authenticate, uploadAvatar, userController.uploadAvatar)
router.get('/:id/profile', userController.getProfile)
router.get('/:id/ads', userController.getUserAds)

export default router
