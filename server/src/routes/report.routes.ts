import { Router } from 'express'
import * as reportController from '../controllers/report.controller'
import { authenticate } from '../middleware/authenticate'
import { authorize } from '../middleware/authorize'
import { validate } from '../middleware/validate'
import { createReportSchema, updateReportStatusSchema } from '../validators/report.validator'

const router = Router()

router.post('/', authenticate, validate(createReportSchema), reportController.createReport)
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), reportController.getReports)
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(updateReportStatusSchema),
  reportController.updateReportStatus
)

export default router
