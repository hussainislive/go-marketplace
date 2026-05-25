import { Router } from 'express'
import passport from 'passport'
import * as authController from '../controllers/auth.controller'
import { validate } from '../middleware/validate'
import { authenticate } from '../middleware/authenticate'
import { authLimiter } from '../middleware/rateLimiter'
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator'

const router = Router()

router.post('/register', authLimiter, validate(registerSchema), authController.register)
router.post('/login', authLimiter, validate(loginSchema), authController.login)
router.post('/logout', authenticate, authController.logout)
router.post('/refresh', authController.refresh)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
)

router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail)
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword)

export default router
