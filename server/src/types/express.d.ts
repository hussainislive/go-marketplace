import type { UserRole } from '../utils/jwt'

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string
      role: UserRole
      email: string
    }
  }
}

export {}
