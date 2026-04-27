import { NextResponse } from "next/server"

import { isRateLimited as redisIsRateLimited } from "@/lib/rate-limiter"

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 20

export async function GET(req: Request) {
  // Rate limiting for providers endpoint
  const identifier = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  try {
    const result = await redisIsRateLimited(identifier, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS)
    if (!result.success) {
      return NextResponse.json(
        { error: { message: "Too many requests", code: "RATE_LIMITED" } },
        { status: 429 }
      )
    }
  } catch {
    // Redis failure - allow request but log warning
    console.warn("Redis rate limiting failed, allowing providers request")
  }

  // Validate environment variables with null checks to prevent trim errors
  const googleClientId = process.env['GOOGLE_CLIENT_ID']
  const googleClientSecret = process.env['GOOGLE_CLIENT_SECRET']
  const appleClientId = process.env['APPLE_CLIENT_ID']
  const appleClientSecret = process.env['APPLE_CLIENT_SECRET']

  // Check if credentials are set and not placeholder values
  const isGoogleConfigured = googleClientId?.trim() && 
                           googleClientSecret?.trim() &&
                           !googleClientId.includes('your-google-client-id') &&
                           !googleClientSecret.includes('your-google-client-secret')
  
  const isAppleConfigured = appleClientId?.trim() &&
                          appleClientSecret?.trim() &&
                          !appleClientId.includes('your-apple-client-id') &&
                          !appleClientSecret.includes('your-apple-client-secret')

  return NextResponse.json({
    google: isGoogleConfigured,
    apple: isAppleConfigured,
  })
}
