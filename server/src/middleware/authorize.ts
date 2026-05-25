import { Request, Response, NextFunction } from 'express'
import type { UserRole } from '../utils/jwt'
import { ApiError } from '../utils/ApiError'

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(ApiError.unauthorized('Authentication required'))
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'))
    }
    next()
  }
}
