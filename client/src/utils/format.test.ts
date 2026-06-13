import { describe, it, expect } from 'vitest'
import { formatPrice, formatDuration, cn, cdnImage, getInitials, apiErrorMessage } from './format'

describe('formatPrice', () => {
  it('formats a number as USD with no decimals', () => {
    expect(formatPrice(1500)).toBe('$1,500')
  })
  it('accepts numeric strings', () => {
    expect(formatPrice('2000')).toBe('$2,000')
  })
})

describe('formatDuration', () => {
  it('formats seconds as m:ss', () => {
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(9)).toBe('0:09')
  })
})

describe('cn', () => {
  it('joins truthy class names and drops falsy ones', () => {
    expect(cn('a', false, 'b', null, undefined, 'c')).toBe('a b c')
  })
})

describe('getInitials', () => {
  it('returns up to two uppercase initials', () => {
    expect(getInitials('Hussain Ahmed')).toBe('HA')
    expect(getInitials('madonna')).toBe('M')
  })
})

describe('apiErrorMessage', () => {
  it('pulls the message from an axios-style error', () => {
    const err = { response: { data: { message: 'Email taken' } } }
    expect(apiErrorMessage(err, 'fallback')).toBe('Email taken')
  })
  it('falls back when no message is present', () => {
    expect(apiErrorMessage(new Error('x'), 'fallback')).toBe('fallback')
  })
})

describe('cdnImage', () => {
  it('injects Cloudinary transforms after /upload/', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1/photo.jpg'
    expect(cdnImage(url, 600)).toContain('/upload/f_auto,q_auto,c_fill,w_600/')
  })
  it('does not double-transform an already-transformed Cloudinary url', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/photo.jpg'
    expect(cdnImage(url, 600)).toBe(url)
  })
  it('adds sizing query params to Unsplash urls', () => {
    const out = cdnImage('https://images.unsplash.com/photo-123', 400)
    expect(out).toContain('w=400')
    expect(out).toContain('auto=format')
  })
  it('returns unknown hosts unchanged and empty for nullish input', () => {
    expect(cdnImage('https://example.com/a.png', 400)).toBe('https://example.com/a.png')
    expect(cdnImage(null, 400)).toBe('')
  })
})
