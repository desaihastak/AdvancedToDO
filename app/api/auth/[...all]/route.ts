import { NextResponse } from "next/server"
import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isRateLimited as redisIsRateLimited } from "@/lib/rate-limiter"

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 10

const handler = toNextJsHandler(auth)

function getRequestMetadata(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for")
  let ipAddress = "unknown"
  if (forwardedFor) {
    const ips = forwardedFor.split(",")
    const firstIp = ips[0]?.trim()
    // Improved IP validation - supports IPv4 and IPv6
    if (firstIp && isValidIPv4(firstIp)) {
      ipAddress = firstIp
    } else if (firstIp && isValidIPv6(firstIp)) {
      ipAddress = firstIp
    }
  }
  return {
    ipAddress,
    userAgent: req.headers.get("user-agent") || null,
    path: new URL(req.url).pathname,
    email: null as string | null,
  }
}

function isValidIPv4(ip: string): boolean {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/
  if (!ipv4Pattern.test(ip)) return false
  const octets = ip.split('.')
  return octets.every(octet => {
    const num = parseInt(octet, 10)
    return num >= 0 && num <= 255
  })
}

function isValidIPv6(ip: string): boolean {
  // IPv6 validation - supports full, compressed, and mixed formats
  const ipv6Patterns = [
    /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, // Full IPv6
    /^([0-9a-fA-F]{1,4}:){1,7}:$/, // Compressed with trailing ::
    /^:(:[0-9a-fA-F]{1,4}){1,7}$/, // Compressed with leading ::
    /^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/, // Partial compression
    /^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$/, // Multiple compression
    /^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$/, // Multiple compression
    /^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$/, // Multiple compression
    /^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$/, // Multiple compression
    /^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$/, // Multiple compression
    /^:((:[0-9a-fA-F]{1,4}){1,7}|:)/, // All compressed
    /^::ffff:(\d{1,3}\.){3}\d{1,3}$/, // IPv4-mapped IPv6
  ]
  return ipv6Patterns.some(pattern => pattern.test(ip))
}

async function isRateLimited(req: Request) {
  const { ipAddress, path } = getRequestMetadata(req)
  const identifier = `${ipAddress}:${path}`

  // Use Redis-based rate limiting for better performance and scalability
  let result
  try {
    result = await redisIsRateLimited(identifier, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS)
  } catch {
    // Redis failure - fallback to allowing request but log warning
    console.warn("Redis rate limiting failed, allowing request")
    result = { success: true }
  }
  
  if (!result.success) {
    // Log rate limit event to database for audit trail (non-blocking)
    setImmediate(async () => {
      try {
        await db.securityLog.create({
          data: {
            eventType: "auth_rate_limited",
            success: false,
            ipAddress,
            userAgent: getRequestMetadata(req).userAgent,
          },
        })
      } catch (error) {
        console.error("Failed to log rate limit event:", error)
      }
    })
    return true
  }

  return false
}

function shouldLogFailedLoginAttempt(req: Request, response: Response) {
  const pathname = new URL(req.url).pathname
  const isEmailLoginPath = pathname.includes("/sign-in/email")
  const isOAuthPath = pathname.includes("/sign-in/social") || pathname.includes("/oauth")
  const isFailedLoginStatus = [400, 401, 403, 422].includes(response.status)
  return (isEmailLoginPath || isOAuthPath) && isFailedLoginStatus
}

async function logFailedLoginAttempt(req: Request) {
  // Non-blocking security logging
  setImmediate(async () => {
    try {
      const { ipAddress, userAgent } = getRequestMetadata(req)
      const pathname = new URL(req.url).pathname
      
      // Determine event type based on the request path
      let eventType = "login_attempt"
      if (pathname.includes("/sign-in/email")) {
        eventType = "email_login_attempt"
      } else if (pathname.includes("/sign-in/social")) {
        eventType = "oauth_login_attempt"
      } else if (pathname.includes("/sign-up/email")) {
        eventType = "registration_attempt"
      }

      await db.securityLog.create({
        data: {
          eventType,
          success: false,
          ipAddress,
          userAgent,
        },
      })
    } catch (error) {
      console.error("Security logging failed:", error)
    }
  })
}

async function withErrorHandler(handler: (req: Request) => Promise<Response>, req: Request) {
  try {
    if (await isRateLimited(req)) {
      return NextResponse.json(
        { error: { message: "Too many authentication attempts. Please try again shortly.", code: "RATE_LIMITED" } },
        { status: 429 }
      )
    }

    return await handler(req)
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json(
      { error: { message: "Authentication error occurred", code: "AUTH_ERROR" } },
      { status: 500 }
    )
  }
}

// Security functions for account lockout and failed attempt tracking
// These can be integrated into the auth flow for enhanced security
// _isAccountLocked and _incrementFailedAttempts are reserved for future use

export async function GET(req: Request) {
  return withErrorHandler(handler.GET, req)
}

export async function POST(req: Request) {
  const response = await withErrorHandler(handler.POST, req)

  if (shouldLogFailedLoginAttempt(req, response)) {
    await logFailedLoginAttempt(req)
  }

  return response
}
