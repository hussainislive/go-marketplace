import { Router } from 'express'
import * as adController from '../controllers/ad.controller'
import { authenticate } from '../middleware/authenticate'
import { validate } from '../middleware/validate'
import { uploadImages } from '../middleware/upload'
import { createAdSchema, updateAdSchema, adStatusSchema } from '../validators/ad.validator'

const router = Router()

router.get('/', adController.getAds)
router.post('/', authenticate, uploadImages, validate(createAdSchema), adController.createAd)
router.get('/featured', adController.getFeaturedAds)
router.get('/me', authenticate, adController.getMyAds)
router.get('/:id', adController.getAdById)
router.put('/:id', authenticate, uploadImages, validate(updateAdSchema), adController.updateAd)
router.delete('/:id', authenticate, adController.deleteAd)
router.post('/:id/favorite', authenticate, adController.addFavorite)
router.delete('/:id/favorite', authenticate, adController.removeFavorite)
router.patch('/:id/status', authenticate, validate(adStatusSchema), adController.updateStatus)

export default router
