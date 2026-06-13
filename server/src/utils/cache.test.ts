import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the Redis client so the cache helper can be tested in isolation, without
// a live Redis connection or loading the env-validation module. vi.hoisted lets
// the shared store/mock exist before the hoisted vi.mock factory runs.
const { store, mockRedis } = vi.hoisted(() => {
  const s = new Map<string, unknown>()
  return {
    store: s,
    mockRedis: {
      get: vi.fn(async (k: string) => (s.has(k) ? s.get(k) : null)),
      set: vi.fn(async (k: string, v: unknown) => {
        s.set(k, v)
      }),
      del: vi.fn(async (...keys: string[]) => {
        keys.forEach(k => s.delete(k))
      }),
    },
  }
})

vi.mock('../config/redis', () => ({ redis: mockRedis }))

import { cacheGetOrSet, cacheInvalidate, CACHE_KEYS } from './cache'

beforeEach(() => {
  store.clear()
  vi.clearAllMocks()
})

describe('cacheGetOrSet', () => {
  it('runs the fetcher and stores the result on a cache MISS', async () => {
    const fetcher = vi.fn(async () => ({ value: 42 }))
    const result = await cacheGetOrSet('k1', 60, fetcher)

    expect(result).toEqual({ value: 42 })
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(mockRedis.set).toHaveBeenCalledWith('k1', { value: 42 }, { ex: 60 })
  })

  it('returns the cached value without calling the fetcher on a HIT', async () => {
    store.set('k2', { value: 'cached' })
    const fetcher = vi.fn(async () => ({ value: 'fresh' }))

    const result = await cacheGetOrSet('k2', 60, fetcher)

    expect(result).toEqual({ value: 'cached' })
    expect(fetcher).not.toHaveBeenCalled()
  })
})

describe('cacheInvalidate', () => {
  it('deletes the given keys', async () => {
    store.set('a', 1)
    store.set('b', 2)
    await cacheInvalidate('a', 'b')
    expect(store.has('a')).toBe(false)
    expect(store.has('b')).toBe(false)
  })
})

describe('CACHE_KEYS', () => {
  it('builds stable keys', () => {
    expect(CACHE_KEYS.categories).toBe('categories:all')
    expect(CACHE_KEYS.featuredAds).toBe('ads:featured')
    expect(CACHE_KEYS.adsList('{"page":1}')).toBe('ads:list:{"page":1}')
  })
})
