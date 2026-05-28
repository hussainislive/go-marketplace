import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { ApiError } from '../utils/ApiError'

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  // Accept token from Authorization header (Bearer) first, then fall back to cookie.
  // This makes auth work in Safari where cross-site cookies are blocked.
  const authHeader = req.headers.authorization
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
  const token = headerToken ?? (req.cookies?.accessToken as string | undefined)

  if (!token) return next(ApiError.unauthorized('Authentication required'))

  try {
    const payload = verifyAccessToken(token)
    req.user = { id: payload.userId, role: payload.role, email: payload.email }
    next()
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'))
  }
}
