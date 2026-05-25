import type { UserRole } from '../utils/jwt'

export type { UserRole }

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface TokenPayload {
  userId: string
  role: UserRole
  email: string
}

export interface RefreshTokenPayload {
  userId: string
}

export interface AuthUser {
  id: string
  role: UserRole
  email: string
}
