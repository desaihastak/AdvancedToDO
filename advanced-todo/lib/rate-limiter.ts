import { getRedisClient } from './redis'

interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

/**
 * Check if a request should be rate limited using Redis
 * Falls back to allowing requests if Redis is not available
 */
export async function isRateLimited(
  identifier: string,
  windowMs: number,
  maxRequests: number
): Promise<RateLimitResult> {
  const redis = getRedisClient()
  
  if (!redis) {
    // Fallback: allow requests if Redis is not available
    console.warn('Redis not available, rate limiting disabled')
    return { success: true, remaining: maxRequests, reset: Date.now() + windowMs }
  }

  const key = `ratelimit:${identifier}`
  const windowSec = Math.ceil(windowMs / 1000)

  try {
    const pipeline = redis.pipeline()
    
    // Increment counter
    pipeline.incr(key)
    // Set expiration if this is the first request
    pipeline.expire(key, windowSec)
    
    const results = await pipeline.exec()
    
    if (!results || results[0]?.[0] !== null) {
      // Pipeline failed, allow request
      return { success: true, remaining: maxRequests, reset: Date.now() + windowMs }
    }

    const current = results[0][1] as number
    const remaining = Math.max(0, maxRequests - current)
    const success = current <= maxRequests
    const reset = Date.now() + windowMs * 1000

    return { success, remaining, reset }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // Allow request on error
    return { success: true, remaining: maxRequests, reset: Date.now() + windowMs }
  }
}

/**
 * Log a rate limit event
 */
export async function logRateLimitEvent(
  identifier: string,
  eventType: string
): Promise<void> {
  const redis = getRedisClient()
  
  if (!redis) {
    return
  }

  try {
    const key = `ratelimit:event:${identifier}:${eventType}`
    await redis.incr(key)
    await redis.expire(key, 3600) // Keep for 1 hour
  } catch (error) {
    console.error('Failed to log rate limit event:', error)
  }
}
