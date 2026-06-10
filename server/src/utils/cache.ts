import { redis } from '../config/redis'

// Cache-aside helper: return the cached value for `key`, or run `fetcher`, store
// its result with a TTL, and return it. Every Redis call is guarded so a cache
// outage NEVER breaks a request — it just falls through to the database.
export async function cacheGetOrSet<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  if (!redis) return fetcher()

  try {
    const cached = await redis.get<T>(key)
    if (cached !== null && cached !== undefined) return cached
  } catch (err) {
    console.error(`[cache] get failed for "${key}":`, err)
  }

  const fresh = await fetcher()

  try {
    await redis.set(key, fresh, { ex: ttlSeconds })
  } catch (err) {
    console.error(`[cache] set failed for "${key}":`, err)
  }

  return fresh
}

// Delete one or more cache keys (e.g. after a write). Never throws.
export async function cacheInvalidate(...keys: string[]): Promise<void> {
  if (!redis || keys.length === 0) return
  try {
    await redis.del(...keys)
  } catch (err) {
    console.error(`[cache] invalidate failed for [${keys.join(', ')}]:`, err)
  }
}

// Stable cache keys used across services.
export const CACHE_KEYS = {
  categories: 'categories:all',
  featuredAds: 'ads:featured',
  adsList: (filtersHash: string) => `ads:list:${filtersHash}`,
}
