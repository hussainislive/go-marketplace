import { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { success } from '../utils/ApiResponse'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import * as authService from '../services/auth.service'
import type { RegisterInput, LoginInput } from '../validators/auth.validator'

const isProd = process.env.NODE_ENV === 'production'
const COOKIE_OPTS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
}

function setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie('accessToken', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 })
  res.cookie('refreshToken', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 })
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as RegisterInput
  const user = await authService.register(data)
  res.status(201).json(success('Registration successful. Please check your email to verify your account.', user))
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput
  const { user, accessToken, refreshToken } = await authService.login(email, password)
  setTokenCookies(res, accessToken, refreshToken)
  // Also return tokens in body so clients that can't use cross-site cookies (Safari) store them
  res.json(success('Login successful', { user, accessToken, refreshToken }))
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (req.user) await authService.logout(req.user.id)
  res.clearCookie('accessToken', COOKIE_OPTS)
  res.clearCookie('refreshToken', COOKIE_OPTS)
  res.json(success('Logged out successfully'))
})

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  // Accept refresh token from cookie OR from request body (for Safari)
  const token = (req.cookies?.refreshToken as string | undefined) ?? (req.body as { refreshToken?: string }).refreshToken
  if (!token) {
    res.status(401).json({ success: false, message: 'No refresh token' })
    return
  }
  const { accessToken, refreshToken } = await authService.refreshTokens(token)
  setTokenCookies(res, accessToken, refreshToken)
  res.json(success('Tokens refreshed', { accessToken, refreshToken }))
})

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body as { token: string }
  const { user, accessToken, refreshToken } = await authService.verifyEmail(token)
  setTokenCookies(res, accessToken, refreshToken)
  res.json(success('Email verified successfully', { user, accessToken, refreshToken }))
})

export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string }
  await authService.resendVerification(email)
  res.json(success('If that account exists and is unverified, a new verification email has been sent.'))
})

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string }
  await authService.forgotPassword(email)
  res.json(success('If that email exists, a reset link has been sent'))
})

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body as { token: string; password: string }
  await authService.resetPassword(token, password)
  res.json(success('Password reset successfully'))
})

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as { id: string; role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'; email: string }
  const accessToken = generateAccessToken(user.id, user.role, user.email)
  const refreshToken = generateRefreshToken(user.id)
  setTokenCookies(res, accessToken, refreshToken)
  const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173'
  // Pass tokens in URL fragment so client can pick them up even when cookies are blocked
  res.redirect(`${clientUrl}/dashboard?_at=${accessToken}&_rt=${refreshToken}`)
})
