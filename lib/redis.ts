import Redis from 'ioredis'

let redis: Redis | null = null

export function getRedisClient(): Redis | null {
  if (!process.env['REDIS_URL']) {
    console.warn('REDIS_URL not set, Redis features disabled')
    return null
  }

  if (!redis) {
    try {
      redis = new Redis(process.env['REDIS_URL'], {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.error('Redis connection failed after 3 retries')
            return null
          }
          return Math.min(times * 50, 2000)
        },
      })
      
      redis.on('error', (err) => {
        console.error('Redis client error:', err)
      })
      
      redis.on('connect', () => {
        console.log('Redis client connected')
      })
      
      redis.on('disconnect', () => {
        console.warn('Redis client disconnected')
      })
    } catch (error) {
      console.error('Failed to create Redis client:', error)
      return null
    }
  }

  return redis
}

export async function closeRedisClient(): Promise<void> {
  if (redis) {
    await redis.quit()
    redis = null
  }
}
