import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import prisma from '../config/database'
import { ApiError } from '../utils/ApiError'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email'
import type { RegisterInput } from '../validators/auth.validator'

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export async function register(data: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw ApiError.conflict('Email already registered')

  const passwordHash = await bcrypt.hash(data.password, 12)
  const verificationToken = crypto.randomBytes(32).toString('hex')
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: passwordHash,
      verificationToken: hashToken(verificationToken),
      verificationExpires,
    },
    select: { id: true, email: true, name: true, role: true, isVerified: true, createdAt: true },
  })

  await sendVerificationEmail(data.email, data.name, verificationToken).catch(() => null)

  return user
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) throw ApiError.unauthorized('Invalid email or password')
  if (user.status === 'BANNED') throw ApiError.forbidden('Account is banned')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw ApiError.unauthorized('Invalid email or password')

  const accessToken = generateAccessToken(user.id, user.role, user.email)
  const refreshToken = generateRefreshToken(user.id)

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashToken(refreshToken) },
  })

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    isVerified: user.isVerified,
    city: user.city,
  }

  return { user: safeUser, accessToken, refreshToken }
}

export async function logout(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  })
}

export async function refreshTokens(token: string) {
  const payload = verifyRefreshToken(token)

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user || !user.refreshToken) throw ApiError.unauthorized('Invalid refresh token')
  if (user.refreshToken !== hashToken(token)) throw ApiError.unauthorized('Invalid refresh token')

  const accessToken = generateAccessToken(user.id, user.role, user.email)
  const newRefreshToken = generateRefreshToken(user.id)

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashToken(newRefreshToken) },
  })

  return { accessToken, refreshToken: newRefreshToken }
}

export async function verifyEmail(token: string) {
  const hashedToken = hashToken(token)
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: hashedToken,
      verificationExpires: { gt: new Date() },
    },
  })
  if (!user) throw ApiError.badRequest('Invalid or expired verification token')

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationExpires: null,
    },
  })
}

export async function forgotPassword(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return // silently return to not reveal if email exists

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: hashToken(resetToken), resetTokenExpires },
  })

  await sendPasswordResetEmail(email, user.name, resetToken).catch(() => null)
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const hashedToken = hashToken(token)
  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpires: { gt: new Date() },
    },
  })
  if (!user) throw ApiError.badRequest('Invalid or expired reset token')

  const passwordHash = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: passwordHash,
      resetToken: null,
      resetTokenExpires: null,
      refreshToken: null,
    },
  })
}
