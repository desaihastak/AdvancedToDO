import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MAX_SESSION_AGE = 60 * 60 * 24 * 7 * 1000 // 7 days
const REFRESH_THRESHOLD = 60 * 60 * 24 * 1000 // 1 day

export async function middleware(req: NextRequest) {
  // Validate session for dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Validate session freshness
    const sessionAge = Date.now() - new Date(session.session.expiresAt).getTime()
    if (sessionAge > MAX_SESSION_AGE) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Check if session should be refreshed
    const lastRefreshed = new Date(session.session.updatedAt).getTime()
    if (Date.now() - lastRefreshed > REFRESH_THRESHOLD) {
      // Session refresh would be handled by BetterAuth automatically on next request
      // This is a passive check to ensure sessions are refreshed periodically
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
