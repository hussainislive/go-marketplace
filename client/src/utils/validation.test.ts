import { describe, it, expect } from 'vitest'
import { loginSchema, signupSchema, contactSchema } from './validation'

describe('loginSchema', () => {
  it('accepts a valid email + password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true)
  })
  it('rejects an invalid email', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'x' }).success).toBe(false)
  })
})

describe('signupSchema', () => {
  it('accepts a strong password', () => {
    const r = signupSchema.safeParse({ name: 'Jane', email: 'a@b.com', password: 'Passw0rd!' })
    expect(r.success).toBe(true)
  })
  it('rejects a weak password (no uppercase / number / symbol)', () => {
    const r = signupSchema.safeParse({ name: 'Jane', email: 'a@b.com', password: 'password' })
    expect(r.success).toBe(false)
  })
  it('rejects a too-short name', () => {
    const r = signupSchema.safeParse({ name: 'J', email: 'a@b.com', password: 'Passw0rd!' })
    expect(r.success).toBe(false)
  })
})

describe('contactSchema', () => {
  it('accepts a valid message', () => {
    const r = contactSchema.safeParse({ name: 'Jane', email: 'a@b.com', message: 'Hello there, this is a test.' })
    expect(r.success).toBe(true)
  })
  it('rejects a too-short message', () => {
    const r = contactSchema.safeParse({ name: 'Jane', email: 'a@b.com', message: 'hi' })
    expect(r.success).toBe(false)
  })
})
