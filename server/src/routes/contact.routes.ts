import { Router } from 'express'
import * as contactController from '../controllers/contact.controller'
import { validate } from '../middleware/validate'
import { authLimiter } from '../middleware/rateLimiter'
import { contactSchema } from '../validators/contact.validator'

const router = Router()

// Public endpoint — anyone can send a message to the developer.
// Rate-limited (10 / 15 min) to prevent spam/abuse.
router.post('/', authLimiter, validate(contactSchema), contactController.sendContact)

export default router
