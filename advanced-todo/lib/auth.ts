import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true, // Enable email/password authentication
    requireEmailVerification: false, // Optional: can be enabled later
  },
  socialProviders: {
    google: {
      clientId: process.env['GOOGLE_CLIENT_ID'] || "",
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] || "",
      enabled: !!(process.env['GOOGLE_CLIENT_ID'] && process.env['GOOGLE_CLIENT_SECRET']),
    },
    apple: {
      clientId: process.env['APPLE_CLIENT_ID'] || "",
      clientSecret: process.env['APPLE_CLIENT_SECRET'] || "",
      enabled: !!(process.env['APPLE_CLIENT_ID'] && process.env['APPLE_CLIENT_SECRET']),
    },
  },
  secret: process.env['BETTER_AUTH_SECRET'],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      lockedUntil: {
        type: "date",
        input: false, // Users cannot set this field
      },
      failedLoginAttempts: {
        type: "number",
        input: false, // Users cannot set this field
      },
    },
  },
  // Note: BetterAuth includes built-in CSRF protection for state-changing requests
  // Additional CSRF hardening can be implemented at the middleware level if needed
})

// Infer types for type-safe session and user access
export type Session = typeof auth.$Infer.Session
export type User = Session['user']
