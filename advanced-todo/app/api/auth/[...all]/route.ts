import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextResponse } from "next/server"

const handler = toNextJsHandler(auth)

async function withErrorHandler(handler: (req: Request) => Promise<Response>, req: Request) {
  try {
    return await handler(req)
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json(
      { error: { message: "Authentication error occurred", code: "AUTH_ERROR" } },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  return withErrorHandler(handler.GET, req)
}

export async function POST(req: Request) {
  return withErrorHandler(handler.POST, req)
}
