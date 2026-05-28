import { Router, Request, Response, NextFunction } from 'express'
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

const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL
)

// Return a clean error instead of crashing when Google OAuth is not configured.
function requireGoogle(_req: Request, res: Response, next: NextFunction): void {
  if (!googleConfigured) {
    res.status(503).json({ success: false, message: 'Google sign-in is not available right now.' })
    return
  }
  next()
}

router.post('/register', authLimiter, validate(registerSchema), authController.register)
router.post('/login', authLimiter, validate(loginSchema), authController.login)
router.post('/logout', authenticate, authController.logout)
router.post('/refresh', authController.refresh)
router.post('/resend-verification', authLimiter, validate(forgotPasswordSchema), authController.resendVerification)

router.get('/google', requireGoogle, passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get(
  '/google/callback',
  requireGoogle,
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
)

router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail)
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword)

export default router
