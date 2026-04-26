import type { Account, SecurityLog, Session, User } from "@prisma/client"

import type { Session as BetterAuthSession, User as BetterAuthUser } from "./auth"

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
