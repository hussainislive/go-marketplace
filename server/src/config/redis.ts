import { Redis } from '@upstash/redis'
import { env } from './env'

// Upstash Redis client over HTTP (REST). Returns null when the env vars are not
// set, so the app runs fine without caching (local dev, or if Redis is removed).
// Consumers must handle the null case — see utils/cache.ts.
function createRedis(): Redis | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('[redis] UPSTASH_REDIS_REST_URL/TOKEN not set — caching disabled')
    return null
  }
  return new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })
}

export const redis = createRedis()
