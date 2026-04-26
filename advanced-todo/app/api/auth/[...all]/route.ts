import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextResponse } from "next/server"
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
    // Basic IP validation - check if it looks like an IP address
    if (firstIp && /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(firstIp)) {
      ipAddress = firstIp
    } else if (firstIp && /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(firstIp)) {
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
  const isOAuthPath = pathname.includes("/sign-in") || pathname.includes("/oauth")
  const isFailedLoginStatus = [400, 401, 403, 422].includes(response.status)
  return (isEmailLoginPath || isOAuthPath) && isFailedLoginStatus
}

async function logFailedLoginAttempt(req: Request) {
  // Non-blocking security logging
  setImmediate(async () => {
    try {
      const { ipAddress, userAgent } = getRequestMetadata(req)

      await db.securityLog.create({
        data: {
          eventType: "login_attempt",
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
