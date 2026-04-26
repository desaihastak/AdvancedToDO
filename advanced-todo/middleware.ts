import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { auth } from "@/lib/auth"

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

    // Proactive session refresh: if session is close to expiration threshold, refresh it
    const lastRefreshed = new Date(session.session.updatedAt).getTime()
    const timeSinceRefresh = Date.now() - lastRefreshed
    
    if (timeSinceRefresh > REFRESH_THRESHOLD) {
      // Trigger session refresh by making a request to BetterAuth
      // BetterAuth will automatically refresh the session cookie on subsequent requests
      // We add a header to indicate refresh should happen
      const response = NextResponse.next()
      response.headers.set('X-Session-Refresh', 'true')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
