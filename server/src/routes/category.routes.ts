import { Router } from 'express'
import * as categoryController from '../controllers/category.controller'
import { authenticate } from '../middleware/authenticate'
import { authorize } from '../middleware/authorize'

const router = Router()

router.get('/', categoryController.getAll)
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), categoryController.create)
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), categoryController.update)
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), categoryController.remove)

export default router
