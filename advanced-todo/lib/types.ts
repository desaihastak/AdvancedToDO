// Shared type definitions combining Prisma and BetterAuth types
import type { Session as BetterAuthSession, User as BetterAuthUser } from "./auth"
import type { User, Session, Account, SecurityLog } from "@prisma/client"

// Prisma model types for type-safe database operations
export type UserRow = User
export type SessionRow = Session
export type AccountRow = Account
export type SecurityLogRow = SecurityLog

// Combined types for application use
export type AppUser = BetterAuthUser & UserRow
export type AppSession = BetterAuthSession & { user: AppUser }

// Type-safe query result types
export type UserWithSessions = UserRow & {
  sessions: SessionRow[]
}

export type SessionWithUser = SessionRow & {
  user: UserRow
}

export type SecurityLogWithUser = SecurityLogRow & {
  user: UserRow | null
}
