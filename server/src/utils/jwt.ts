import jwt from 'jsonwebtoken'

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface TokenPayload {
  userId: string
  role: UserRole
  email: string
}

export interface RefreshTokenPayload {
  userId: string
}

export function generateAccessToken(userId: string, role: UserRole, email: string): string {
  const secret = process.env.JWT_ACCESS_SECRET
  const expires = process.env.JWT_ACCESS_EXPIRES ?? '15m'
  if (!secret) throw new Error('JWT_ACCESS_SECRET not set')
  return jwt.sign({ userId, role, email }, secret, { expiresIn: expires } as jwt.SignOptions)
}

export function generateRefreshToken(userId: string): string {
  const secret = process.env.JWT_REFRESH_SECRET
  const expires = process.env.JWT_REFRESH_EXPIRES ?? '7d'
  if (!secret) throw new Error('JWT_REFRESH_SECRET not set')
  return jwt.sign({ userId }, secret, { expiresIn: expires } as jwt.SignOptions)
}

export function verifyAccessToken(token: string): TokenPayload {
  const secret = process.env.JWT_ACCESS_SECRET
  if (!secret) throw new Error('JWT_ACCESS_SECRET not set')
  return jwt.verify(token, secret) as TokenPayload
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) throw new Error('JWT_REFRESH_SECRET not set')
  return jwt.verify(token, secret) as RefreshTokenPayload
}
