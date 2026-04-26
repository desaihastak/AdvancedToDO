# Critical Issues Action Plan
## Story 1.2: User Registration and Login
**Generated:** 2026-04-27
**Total Critical Issues:** 17

---

## Executive Summary

This action plan addresses 17 critical issues identified during code review that must be resolved before production deployment. Issues are categorized by severity and impact: Security (7), Performance (3), Stability (5), and Accessibility (2).

**Estimated Effort:** 2-3 days for all critical issues
**Priority:** BLOCKER - Must complete before production deployment

---

## SECURITY ISSUES (7)

### 1. Rate Limiting Uses Database Instead of Redis
**Location:** `advanced-todo/app/api/auth/[...all]/route.ts:531-572`
**Severity:** CRITICAL
**Impact:** Won't scale horizontally, bypassable under load, single point of failure

**Action Steps:**
1. Install Redis client: `pnpm add ioredis`
2. Create Redis client singleton in `lib/redis.ts`
3. Replace database-based rate limiting with Redis:
   ```typescript
   // lib/rate-limiter.ts
   import Redis from 'ioredis'
   
   const redis = new Redis(process.env.REDIS_URL)
   
   export async function isRateLimited(
     identifier: string,
     windowMs: number,
     maxRequests: number
   ): Promise<boolean> {
     const key = `ratelimit:${identifier}`
     const current = await redis.incr(key)
     if (current === 1) {
       await redis.expire(key, windowMs / 1000)
     }
     return current > maxRequests
   }
   ```
4. Update `app/api/auth/[...all]/route.ts` to use Redis rate limiter
5. Add Redis URL to environment variables
6. Add fallback to in-memory if Redis unavailable
7. Add monitoring for Redis connection health

**Files to Modify:**
- `lib/rate-limiter.ts` (NEW)
- `lib/redis.ts` (NEW)
- `app/api/auth/[...all]/route.ts`
- `.env.local`, `.env.example`

**Estimated Time:** 3 hours

---

### 2. OAuth Provider Discovery Endpoint Has No Authentication
**Location:** `advanced-todo/app/api/auth/providers/route.ts`
**Severity:** CRITICAL
**Impact:** Infrastructure probing vulnerability, attackers can enumerate OAuth configuration

**Action Steps:**
1. Add rate limiting to `/api/auth/providers` endpoint
2. Consider making the endpoint return static configuration instead of dynamic
3. Alternative: Move provider availability check to client-side with environment variables
4. If keeping dynamic endpoint, add authentication check:
   ```typescript
   export async function GET(req: Request) {
     // Verify request is from authenticated session or internal service
     const session = await auth.api.getSession({ headers: await headers() })
     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }
     return NextResponse.json({
       google: Boolean(process.env['GOOGLE_CLIENT_ID'] && process.env['GOOGLE_CLIENT_SECRET']),
       apple: Boolean(process.env['APPLE_CLIENT_ID'] && process.env['APPLE_CLIENT_SECRET']),
     })
   }
   ```
5. Add request signature validation for internal service calls

**Files to Modify:**
- `app/api/auth/providers/route.ts`

**Estimated Time:** 1 hour

---

### 3. Missing CSRF Token Validation on OAuth Callbacks
**Location:** `advanced-todo/app/api/auth/[...all]/route.ts`
**Severity:** CRITICAL
**Impact:** Request forgery risk, attackers can forge OAuth callback requests

**Action Steps:**
1. Enable BetterAuth's built-in CSRF protection:
   ```typescript
   // lib/auth.ts
   export const auth = betterAuth({
     advanced: {
       csrfProtection: {
         enabled: true,
       },
     },
     // ... existing config
   })
   ```
2. Verify CSRF tokens are validated on all state-changing requests
3. Test CSRF protection with forged requests
4. Document CSRF protection in security documentation

**Files to Modify:**
- `lib/auth.ts`

**Estimated Time:** 1 hour

---

### 4. No Account Lockout Mechanism
**Location:** `advanced-todo/app/api/auth/[...all]/route.ts`
**Severity:** CRITICAL
**Impact:** Brute force attacks still possible despite rate limiting

**Action Steps:**
1. Add account lockout field to user table:
   ```typescript
   // drizzle/schema.ts
   export const user = pgTable("user", {
     // ... existing fields
     lockedUntil: timestamp("locked_until"),
     failedLoginAttempts: integer("failed_login_attempts").default(0),
   })
   ```
2. Generate migration for lockout fields
3. Implement lockout logic in auth route:
   ```typescript
   // After failed login attempt
   const failedAttempts = await incrementFailedLoginAttempts(userId)
   if (failedAttempts >= MAX_ATTEMPTS) {
     await lockAccount(userId, LOCKOUT_DURATION_MS)
   }
   
   // Check lockout before authentication
   if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
     return NextResponse.json(
       { error: { message: "Account temporarily locked", code: "ACCOUNT_LOCKED" } },
       { status: 423 }
     )
   }
   ```
4. Add unlock mechanism (admin or time-based)
5. Add security logging for lockout events
6. Document lockout policy in security documentation

**Files to Modify:**
- `drizzle/schema.ts`
- `app/api/auth/[...all]/route.ts`
- Generate new migration

**Estimated Time:** 4 hours

---

### 5. Password Field Nullable - Security Risk
**Location:** `advanced-todo/drizzle/schema.ts:354`
**Severity:** CRITICAL
**Impact:** Allows null passwords, violates spec, security risk

**Action Steps:**
1. Update schema to make password field NOT NULL for email/password users:
   ```typescript
   // Option 1: Make nullable but validate at application level
   password: text("password"), // Keep nullable for OAuth-only users
   
   // Option 2: Separate user types (recommended)
   export const emailPasswordUser = pgTable("email_password_user", {
     id: text("id").primaryKey(),
     userId: text("user_id").references(() => user.id),
     passwordHash: text("password_hash").notNull(),
     // ... other fields
   })
   ```
2. Generate migration for schema change
3. Update registration validation to enforce password requirement
4. Add database constraint to prevent null passwords for email/password users
5. Backfill existing data if any

**Files to Modify:**
- `drizzle/schema.ts`
- Generate new migration
- `app/(auth)/register/page.tsx` (validation)

**Estimated Time:** 2 hours

---

### 6. Foreign Key Uses No Action Instead of Cascade
**Location:** `advanced-todo/drizzle/migrations/0001_familiar_menace.sql:18`
**Severity:** CRITICAL
**Impact:** Orphaned records when users deleted, data integrity issues

**Action Steps:**
1. Update foreign key constraint to use CASCADE:
   ```sql
   ALTER TABLE "security_logs" 
   DROP CONSTRAINT "security_logs_user_id_user_id_fk";
   
   ALTER TABLE "security_logs" 
   ADD CONSTRAINT "security_logs_user_id_user_id_fk" 
   FOREIGN KEY ("user_id") 
   REFERENCES "public"."user"("id") 
   ON DELETE CASCADE ON UPDATE CASCADE;
   ```
2. Generate new migration for constraint change
3. Apply migration to development database
4. Test cascade behavior with user deletion
5. Document cascade behavior in data model documentation
6. Apply same fix to other foreign key constraints (account, session tables)

**Files to Modify:**
- Generate new migration
- Apply to development database

**Estimated Time:** 1 hour

---

### 7. Dashboard Layout Doesn't Validate Session Freshness
**Location:** `advanced-todo/app/(dashboard)/layout.tsx:33-39`
**Severity:** CRITICAL
**Impact:** Stale sessions could be accepted, security risk

**Action Steps:**
1. Add session freshness validation:
   ```typescript
   export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
     const session = await auth.api.getSession({ headers: await headers() })
     
     if (!session) {
       redirect("/login")
     }
     
     // Validate session freshness
     const sessionAge = Date.now() - new Date(session.session.expiresAt).getTime()
     const MAX_SESSION_AGE = 60 * 60 * 24 * 7 * 1000 // 7 days
     if (sessionAge > MAX_SESSION_AGE) {
       redirect("/login")
     }
     
     // Additional: Check if session was recently refreshed
     const lastRefreshed = new Date(session.session.updatedAt).getTime()
     const REFRESH_THRESHOLD = 60 * 60 * 24 * 1000 // 1 day
     if (Date.now() - lastRefreshed > REFRESH_THRESHOLD) {
       // Trigger session refresh
       await auth.api.updateSession({ headers: await headers() })
     }
     
     return <div className="min-h-screen bg-linear-to-br from-violet-500 via-purple-500 to-indigo-600">{children}</div>
   }
   ```
2. Add session refresh logic
3. Test with expired sessions
4. Document session validation behavior

**Files to Modify:**
- `app/(dashboard)/layout.tsx`

**Estimated Time:** 2 hours

---

## PERFORMANCE ISSUES (3)

### 8. Security Logs Table Has No Indexes
**Location:** `advanced-todo/drizzle/schema.ts:363-371`
**Severity:** CRITICAL
**Impact:** Queries will be slow, security monitoring will degrade

**Action Steps:**
1. Add indexes to security_logs table as specified in spec:
   ```typescript
   export const securityLogs = pgTable("security_logs", {
     // ... existing fields
   }, (table) => ({
     userIdIdx: index("security_logs_user_id_idx").on(table.userId),
     timestampIdx: index("security_logs_timestamp_idx").on(table.timestamp),
     eventTypeIdx: index("security_logs_event_type_idx").on(table.eventType),
     compositeIdx: index("security_logs_user_timestamp_idx").on(table.userId, table.timestamp),
   }))
   ```
2. Generate migration for indexes
3. Apply migration to development database
4. Test query performance with and without indexes
5. Add index to migration that was already created (retroactive fix)

**Files to Modify:**
- `drizzle/schema.ts`
- Generate new migration
- Apply to development database

**Estimated Time:** 1 hour

---

### 9. Missing Indexes on UserId and Timestamp
**Location:** `advanced-todo/drizzle/migrations/0001_familiar_menace.sql`
**Severity:** CRITICAL
**Impact:** Spec explicitly requires these indexes, performance degradation

**Action Steps:**
1. Create new migration to add missing indexes:
   ```sql
   CREATE INDEX "security_logs_user_id_idx" ON "security_logs" ("user_id");
   CREATE INDEX "security_logs_timestamp_idx" ON "security_logs" ("timestamp");
   CREATE INDEX "security_logs_event_type_idx" ON "security_logs" ("event_type");
   CREATE INDEX "security_logs_user_timestamp_idx" ON "security_logs" ("user_id", "timestamp");
   ```
2. Apply migration to development database
3. Verify indexes are created
4. Test query performance improvements

**Files to Modify:**
- Generate new migration
- Apply to development database

**Estimated Time:** 1 hour

---

### 10. Dashboard Layout Uses auth.api.getSession on Every Request
**Location:** `advanced-todo/app/(dashboard)/layout.tsx:33-39`
**Severity:** CRITICAL
**Impact:** Performance bottleneck, unnecessary database queries

**Action Steps:**
1. Implement middleware-based session validation:
   ```typescript
   // middleware.ts
   import { auth } from "@/lib/auth"
   import { NextResponse } from "next/server"
   import type { NextRequest } from "next/server"
   
   export async function middleware(req: NextRequest) {
     if (req.nextUrl.pathname.startsWith("/dashboard")) {
       const session = await auth.api.getSession({ headers: req.headers })
       if (!session) {
         return NextResponse.redirect(new URL("/login", req.url))
       }
     }
     return NextResponse.next()
   }
   
   export const config = {
     matcher: ["/dashboard/:path*"],
   }
   ```
2. Remove session check from dashboard layout (middleware handles it)
3. Add session caching middleware
4. Test performance improvement
5. Document middleware behavior

**Files to Modify:**
- `middleware.ts` (NEW)
- `app/(dashboard)/layout.tsx` (simplify)

**Estimated Time:** 2 hours

---

## STABILITY ISSUES (5)

### 11. globals.css Imports shadcn/tailwind.css from Package-Internal Path
**Location:** `advanced-todo/app/globals.css:8`
**Severity:** CRITICAL
**Impact:** Fragile dependency, breaks on package updates, build failures

**Action Steps:**
1. Remove package-internal import:
   ```css
   /* REMOVE THIS LINE */
   @import "shadcn/tailwind.css";
   ```
2. Copy necessary shadcn base styles to local file:
   ```css
   /* app/globals.css - add at top */
   @layer base {
     :root {
       --radius: 0.625rem;
       /* ... other shadcn base variables */
     }
   }
   ```
3. Document which shadcn styles were copied
4. Add comment explaining why we don't use package-internal import
5. Test build without package-internal import

**Files to Modify:**
- `app/globals.css`

**Estimated Time:** 1 hour

---

### 12. Icon Component Uses Custom Color Names Not Defined in Tailwind Config
**Location:** `advanced-todo/lib/components/icons.tsx:255-262`
**Severity:** CRITICAL
**Impact:** Runtime styling failures, icons won't display correctly

**Action Steps:**
1. Define custom color names in Tailwind config:
   ```typescript
   // tailwind.config.ts
   export default {
     theme: {
       extend: {
         colors: {
           "royal-violet": "#7c3aed",
           "indigo-velvet": "#4f46e5",
           "lavender-purple": "#a78bfa",
           "indigo-ink": "#1e1b4b",
           // ... other Cosmic Violet theme colors
         },
       },
     },
   }
   ```
2. Update icon component to use standard Tailwind colors or defined custom colors
3. Test icon rendering with all color variants
4. Document custom color palette in design system documentation

**Files to Modify:**
- `tailwind.config.ts`
- `lib/components/icons.tsx`

**Estimated Time:** 2 hours

---

### 13. DATABASE_URL Environment Variable Undefined
**Location:** `advanced-todo/lib/db.ts:403`
**Severity:** CRITICAL
**Impact:** Application crashes on startup

**Action Steps:**
1. Add runtime validation with better error message:
   ```typescript
   // lib/db.ts
   const connectionString = process.env['DATABASE_URL']
   
   if (!connectionString) {
     throw new Error(
       "DATABASE_URL environment variable is required. " +
       "Please set it in your .env.local file."
     )
   }
   
   // Add validation for connection string format
   try {
     const url = new URL(connectionString)
     if (!url.protocol || !url.hostname) {
       throw new Error("Invalid DATABASE_URL format")
     }
   } catch {
     throw new Error("Invalid DATABASE_URL format. Expected: postgresql://...")
   }
   ```
2. Add environment variable validation script
3. Add pre-commit hook to check required environment variables
4. Document required environment variables in README

**Files to Modify:**
- `lib/db.ts`
- `.env.example`
- `README.md`

**Estimated Time:** 1 hour

---

### 14. gen_random_uuid() Not Available in PostgreSQL
**Location:** `advanced-todo/drizzle/migrations/0001_familiar_menace.sql:8`
**Severity:** CRITICAL
**Impact:** Migration fails, deployment blocked

**Action Steps:**
1. Add pgcrypto extension to migration:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   
   CREATE TABLE "security_logs" (
     "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
     -- ... rest of table definition
   );
   ```
2. Test migration in development environment
3. Verify pgcrypto is available in production PostgreSQL instance
4. Add fallback to uuid_generate_v4() if pgcrypto unavailable:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   
   -- Fallback if pgcrypto fails
   CREATE OR REPLACE FUNCTION gen_random_uuid_fallback() 
   RETURNS text AS $$
   BEGIN
     RETURN gen_random_uuid();
   EXCEPTION WHEN undefined_function THEN
     RETURN uuid_generate_v4();
   END;
   $$ LANGUAGE plpgsql;
   ```
5. Update schema to use fallback function

**Files to Modify:**
- `drizzle/migrations/0001_familiar_menace.sql` (regenerate)
- `drizzle/schema.ts` (update to use fallback)

**Estimated Time:** 2 hours

---

### 15. ALTER TABLE Fails Due to Existing Data
**Location:** `advanced-todo/drizzle/migrations/0001_familiar_menace.sql:17`
**Severity:** CRITICAL
**Impact:** Migration fails on production data, deployment blocked

**Action Steps:**
1. Add data-safe migration pattern:
   ```sql
   -- Add column with default value first
   ALTER TABLE "user" ADD COLUMN "password" text DEFAULT NULL;
   
   -- Then remove default if needed
   ALTER TABLE "user" ALTER COLUMN "password" DROP DEFAULT;
   ```
2. Test migration with sample data
3. Add rollback migration
4. Document migration procedure for production
5. Add pre-migration data validation script

**Files to Modify:**
- Regenerate migration with safer pattern
- Add rollback migration

**Estimated Time:** 2 hours

---

## ACCESSIBILITY ISSUES (2)

### 16. decorative=false but ariaLabel Not Provided
**Location:** `advanced-todo/lib/components/icons.tsx:282-304`
**Severity:** CRITICAL
**Impact:** Accessibility violation, screen reader confusion

**Action Steps:**
1. Add validation in Icon component:
   ```typescript
   export function Icon({
     size = "md",
     color = "foreground",
     className,
     ariaLabel,
     decorative = false,
     children,
   }: IconProps) {
     // Validate accessibility
     if (!decorative && !ariaLabel) {
       console.warn(
         'Icon: ariaLabel is required when decorative=false. ' +
         'This icon may not be accessible to screen readers.'
       )
     }
     
     return (
       <span
         className={cn(iconSizes[size], iconColors[color], "inline-flex items-center justify-center transition-colors duration-200", className)}
         aria-label={decorative ? undefined : ariaLabel}
         aria-hidden={decorative}
         role={decorative ? "presentation" : "img"}
       >
         {children}
       </span>
     )
   }
   ```
2. Add TypeScript validation:
   ```typescript
   interface IconProps {
     size?: IconSize
     color?: IconColor
     className?: string
     ariaLabel?: string
     decorative?: boolean
     children: React.ReactNode
   }
   
   // Add conditional type
   type IconPropsWithValidation = IconProps & (
     | { decorative: true; ariaLabel?: never }
     | { decorative: false; ariaLabel: string }
   )
   ```
3. Test with screen reader
4. Document accessibility requirements

**Files to Modify:**
- `lib/components/icons.tsx`

**Estimated Time:** 1 hour

---

### 17. Card Components Lack Explicit ARIA Roles
**Location:** `advanced-todo/components/ui/card.tsx`
**Severity:** CRITICAL
**Impact:** Screen readers won't recognize as card containers

**Action Steps:**
1. Add ARIA roles to Card components:
   ```typescript
   function Card({
     className,
     size = "default",
     ...props
   }: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
     return (
       <div
         data-slot="card"
         data-size={size}
         role="region"
         aria-label={props['aria-label'] || "Card"}
         className={cn("group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10", className)}
         {...props}
       />
     )
   }
   ```
2. Add aria-labelledby for cards with headers:
   ```typescript
   function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
     return (
       <div
         data-slot="card-header"
         id={props.id || "card-header"}
         className={cn("group/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4", className)}
         {...props}
       />
     )
   }
   
   // Update Card to use header ID
   function Card({ ... }) {
     const headerId = useId()
     return (
       <div
         role="region"
         aria-labelledby={headerId}
         // ...
       >
         <CardHeader id={headerId} />
       </div>
     )
   }
   ```
3. Test with screen reader
4. Document ARIA patterns

**Files to Modify:**
- `components/ui/card.tsx`

**Estimated Time:** 2 hours

---

## IMPLEMENTATION SEQUENCE

### Phase 1: Stability (Day 1 - Morning)
- Fix #13: DATABASE_URL validation
- Fix #14: PostgreSQL UUID function
- Fix #15: Safe migration pattern
- Fix #11: Remove package-internal CSS import

### Phase 2: Security (Day 1 - Afternoon)
- Fix #5: Password field NOT NULL
- Fix #6: Foreign key CASCADE
- Fix #2: OAuth endpoint authentication
- Fix #3: CSRF protection

### Phase 3: Performance (Day 2 - Morning)
- Fix #8: Security logs indexes
- Fix #9: Missing indexes
- Fix #10: Middleware session validation

### Phase 4: Security Hardening (Day 2 - Afternoon)
- Fix #1: Redis rate limiting
- Fix #4: Account lockout
- Fix #7: Session freshness validation

### Phase 5: Accessibility (Day 3 - Morning)
- Fix #16: Icon ariaLabel validation
- Fix #17: Card ARIA roles
- Fix #12: Custom Tailwind colors

### Phase 6: Testing & Documentation (Day 3 - Afternoon)
- Integration testing of all fixes
- Security audit
- Performance testing
- Update documentation

---

## TESTING CHECKLIST

For each fix, verify:
- [ ] Fix resolves the identified issue
- [ ] No regressions introduced
- [ ] Code follows project conventions
- [ ] TypeScript compilation succeeds
- [ ] ESLint passes
- [ ] Tests pass (if applicable)
- [ ] Manual testing completed
- [ ] Documentation updated

---

## ROLLBACK PLAN

If any fix causes issues:
1. Revert the specific commit
2. Document the issue and why rollback was needed
3. Create alternative approach
4. Test alternative thoroughly
5. Re-apply with new approach

---

## SUCCESS CRITERIA

All 17 critical issues resolved:
- [ ] Security vulnerabilities mitigated
- [ ] Performance bottlenecks eliminated
- [ ] Stability issues resolved
- [ ] Accessibility compliance achieved
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Code review approved

---

## NOTES

- Some fixes may require coordination with database administration (migrations, indexes)
- Redis setup may require infrastructure provisioning
- Test all fixes in development environment before production deployment
- Consider creating feature branches for each phase
- Schedule deployment window for applying fixes to production
