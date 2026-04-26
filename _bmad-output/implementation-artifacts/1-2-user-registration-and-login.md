# Story 1.2: User Registration and Login

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to register for an account and log in securely,
so that I can access my personalized task management experience.

## Acceptance Criteria

1. Given the authentication infrastructure is set up, when I navigate to the registration page, then I see a registration form with email, password, and confirm password fields
2. Given the authentication infrastructure is set up, when I register with email and password, then the password is hashed before storage using bcrypt
3. Given the authentication infrastructure is set up, when I register successfully, then I receive a confirmation message
4. Given the authentication infrastructure is set up, when I navigate to the login page, then I see login options for email/password and OAuth providers (Google, Apple)
5. Given the authentication infrastructure is set up, when I log in with email and password, then I receive a JWT session token
6. Given the authentication infrastructure is set up, when I log in with Google OAuth, then I receive a JWT session token
7. Given the authentication infrastructure is set up, when I log in with Apple OAuth, then I receive a JWT session token
8. Given the authentication infrastructure is set up, when I receive a JWT session token, then it is stored securely with httpOnly cookies
9. Given the authentication infrastructure is set up, when I log in successfully, then I am redirected to the dashboard
10. Given the authentication infrastructure is set up, when authentication data is stored, then all data is encrypted at rest using Supabase encryption
11. Given the authentication infrastructure is set up, when authentication requests are made, then all requests use TLS 1.2+ for data in transit
12. Given the authentication infrastructure is set up, when login attempts fail, then failed login attempts are logged for security monitoring
13. Given the authentication infrastructure is set up, when a session is created, then the session expires after 7 days of inactivity

## Tasks / Subtasks

- [ ] Create registration page with form (AC: 1, 2, 3)
  - [ ] Create app/(auth)/register/page.tsx with registration form
  - [ ] Add email, password, and confirm password input fields
  - [ ] Implement form validation using Zod schemas
  - [ ] Add password strength validation
  - [ ] Implement password hashing using bcrypt
  - [ ] Create registration API endpoint at /api/auth/register
  - [ ] Store user in database with hashed password
  - [ ] Display success confirmation message after registration
- [ ] Create login page with multiple authentication options (AC: 4, 5, 6, 7)
  - [ ] Create app/(auth)/login/page.tsx with login form
  - [ ] Add email/password login form
  - [ ] Add Google OAuth login button
  - [ ] Add Apple OAuth login button
  - [ ] Implement email/password authentication flow
  - [ ] Implement Google OAuth callback handling
  - [ ] Implement Apple OAuth callback handling
- [ ] Implement session management with JWT tokens (AC: 8, 13)
  - [ ] Configure BetterAuth session management
  - [ ] Set session expiration to 7 days
  - [ ] Implement httpOnly cookie storage for JWT tokens
  - [ ] Add session refresh logic
  - [ ] Implement session validation middleware
- [ ] Implement secure redirect after login (AC: 9)
  - [ ] Create dashboard page at app/(dashboard)/page.tsx
  - [ ] Implement redirect logic after successful login
  - [ ] Handle redirect for OAuth callbacks
- [ ] Implement security logging (AC: 12)
  - [ ] Add failed login attempt logging
  - [ ] Log authentication events with timestamp and IP
  - [ ] Store security logs in database or external service
- [ ] Ensure encryption and TLS compliance (AC: 10, 11)
  - [ ] Verify Supabase encryption at rest is active
  - [ ] Configure TLS 1.2+ enforcement
  - [ ] Add security headers to Next.js configuration
- [ ] Add accessibility features (from architecture requirements)
  - [ ] Ensure form fields have proper ARIA labels
  - [ ] Implement keyboard navigation for all forms
  - [ ] Add screen reader announcements for form errors
  - [ ] Ensure color contrast meets WCAG AA standards

## Dev Notes

### Technical Stack Requirements

**Framework & Language:**
- Next.js 15+ with App Router
- TypeScript 5+ with strict mode
- Node.js runtime

**Authentication:**
- BetterAuth (already installed in story 1.1)
- OAuth providers: Google, Apple (already configured in story 1.1)
- Email/password authentication using bcrypt
- JWT session management with httpOnly cookies
- Session expiration: 7 days of inactivity

**Database:**
- PostgreSQL 16+ (hosted on Supabase)
- Drizzle ORM for type-safe database access
- User model: id (text), email, name, emailVerified, createdAt, updatedAt
- Add password hash field to User model for email/password authentication

**Security:**
- bcrypt for password hashing (minimum 12 rounds)
- JWT tokens with httpOnly cookies
- TLS 1.2+ for data in transit
- Encryption at rest via Supabase
- Failed login attempt logging

**Project Structure:**
- App Router architecture (app/ directory)
- Auth routes in app/(auth)/
- Dashboard routes in app/(dashboard)/
- API routes in app/api/
- Drizzle schema in drizzle/

### Architecture Compliance

**Naming Conventions:**
- Database tables: snake_case plural (users)
- Database columns: snake_case (password_hash, created_at)
- Components: PascalCase (RegistrationForm, LoginForm)
- Files: PascalCase for components, kebab-case for utilities
- Functions: camelCase (registerUser, loginUser)

**File Structure:**
```
advanced-todo/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       ├── [...all]/
│   │       │   └── route.ts (from story 1.1)
│   │       └── register/
│   │           └── route.ts
├── lib/
│   ├── auth.ts (from story 1.1)
│   ├── db.ts (from story 1.1)
│   └── validators/
│       └── auth.ts
├── drizzle/
│   ├── schema.ts (from story 1.1 - needs password field)
│   └── migrations/
└── components/
    └── auth/
        ├── RegistrationForm.tsx
        └── LoginForm.tsx
```

**API Response Format:**
- Success: Direct data object (no wrapper)
- Error: `{ error: { message: string, code: string, details?: any } }`
- Dates: ISO 8601 strings

### Security Requirements

**Password Security:**
- Hash passwords using bcrypt with minimum 12 rounds
- Never store plain text passwords
- Validate password strength (minimum 8 characters, mixed case, numbers, special characters)
- Implement rate limiting for registration attempts

**Session Security:**
- JWT tokens stored in httpOnly cookies
- Secure cookie configuration (Secure, HttpOnly, SameSite=Strict)
- Session expiration after 7 days of inactivity
- Implement session refresh mechanism

**Data Security:**
- All data encrypted at rest via Supabase PostgreSQL encryption
- TLS 1.2+ for data in transit
- Environment variables for secrets (never commit to git)
- OAuth provider credentials in environment variables

**Authentication Security:**
- Failed login attempt logging for security monitoring
- Rate limiting on authentication endpoints
- CSRF protection via BetterAuth built-in
- Secure redirect handling after OAuth callbacks

### Database Schema Updates

**User Model (add password field):**
```typescript
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  password: text("password"), // NEW: For email/password authentication
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
```

**Security Logs Table (NEW):**
```typescript
export const securityLogs = pgTable("security_logs", {
  id: text("id").primaryKey().$defaultFn(() => sql`gen_random_uuid()`),
  userId: text("user_id").references(() => users.id),
  eventType: text("event_type").notNull(), // "login_attempt", "registration", "oauth_login"
  success: boolean("success").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
})
```

**Indexes:**
- Unique index on email (already exists from story 1.1)
- Index on userId for security logs queries
- Index on timestamp for security log queries

### Environment Variables

Add to existing .env.local from story 1.1:
```
# Already exists from story 1.1:
DATABASE_URL="postgresql://user:password@host:5432/database"
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"

# NEW for this story:
BCRYPT_ROUNDS="12"
```

### Implementation Sequence

1. **Database Schema Update** - Add password field to User model, create security logs table
2. **Generate Migration** - Run `pnpm drizzle-kit generate` to create migration
3. **Apply Migration** - Run `pnpm drizzle-kit migrate` to apply schema changes
4. **Install bcrypt** - Run `pnpm install bcrypt` and `pnpm install -D @types/bcrypt`
5. **Create Registration API** - Implement /api/auth/register endpoint with password hashing
6. **Create Registration Page** - Build registration form with validation
7. **Create Login Page** - Build login form with email/password and OAuth options
8. **Configure Session Management** - Set up JWT tokens with httpOnly cookies
9. **Create Dashboard** - Build basic dashboard page for redirect
10. **Implement Security Logging** - Add failed login attempt logging
11. **Add Accessibility Features** - Ensure WCAG AA compliance
12. **Testing** - Test registration, login, OAuth flows, and security features

### Testing Standards

**Verification Steps:**
- Test registration with valid email and password
- Test registration with weak password (should fail validation)
- Test registration with mismatched passwords (should fail)
- Test login with correct credentials
- Test login with incorrect credentials (should log failure)
- Test Google OAuth login flow
- Test Apple OAuth login flow
- Test session expiration after 7 days
- Test redirect to dashboard after login
- Test security logging for failed attempts
- Verify httpOnly cookies are set correctly
- Test accessibility with keyboard navigation
- Test screen reader announcements

**Automated Tests Recommended:**
- Unit tests for password hashing
- Unit tests for form validation
- Integration tests for registration API
- Integration tests for login API
- E2E tests for registration flow with Playwright
- E2E tests for login flow with Playwright

### Previous Story Intelligence

**From Story 1.1:**
- BetterAuth is already configured with Google and Apple OAuth providers
- Authentication API route exists at `/app/api/auth/[...all]/route.ts`
- Drizzle ORM is configured with PostgreSQL connection to Supabase
- User model exists with: id, email, name, emailVerified, createdAt, updatedAt
- Environment variables are set up in .env.local and .env.example
- BetterAuth configuration is in `lib/auth.ts`
- Database connection is in `lib/db.ts`

**Key Learnings from Story 1.1:**
- BetterAuth uses `[...all]` route convention (not `[...nextauth]`)
- Environment variable naming uses `BETTER_AUTH_SECRET` (not `NEXTAUTH_SECRET`)
- Drizzle ORM was chosen over Prisma for better performance
- Always add runtime validation for environment variables
- Always add error handling wrappers for API routes
- Document migration rollback procedures in README

**Files Created/Modified in Story 1.1:**
- `app/api/auth/[...all]/route.ts` (NEW)
- `lib/auth.ts` (NEW)
- `lib/db.ts` (NEW)
- `drizzle/schema.ts` (NEW) - needs password field added
- `drizzle.config.ts` (NEW)
- `drizzle/migrations/0000_sparkling_gladiator.sql` (NEW)
- `.env.local` (NEW)
- `.env.example` (NEW)
- `README.md` (MODIFIED)
- `package.json` (MODIFIED)

### Project Structure Notes

**Alignment with Architecture:**
- Follows App Router structure as specified in architecture.md
- Uses BetterAuth for authentication (as decided in architecture.md)
- Implements email/password authentication in addition to OAuth
- Security logging aligns with GDPR compliance requirements
- Accessibility features align with WCAG 2.1 AA requirements

**No Conflicts Detected:**
- Story 1.1 established the authentication foundation
- This story builds upon existing BetterAuth configuration
- Database schema extension (adding password field) is backward compatible
- OAuth providers already configured, just need to integrate with login UI

### References

- [Source: architecture.md#Authentication & Security] - BetterAuth configuration, OAuth providers, session management
- [Source: architecture.md#Data Architecture] - Drizzle ORM, PostgreSQL schema design
- [Source: architecture.md#API & Communication Patterns] - REST API design, error handling standards
- [Source: architecture.md#Frontend Architecture] - React Context, Server Components, routing
- [Source: prd.md#MVP Feature Set] - User authentication and account management requirements
- [Source: prd.md#Accessibility Level] - WCAG 2.1 AA compliance requirements
- [Source: ux-design-specification.md#Emotional Design Principles] - Delight, trust through transparency
- [Source: epics.md#Story 1.2] - Original acceptance criteria and user story
- [Source: implementation-artifacts/1-1-initialize-nextjs-project-with-authentication-foundation.md] - Previous story context and learnings

## Dev Agent Record

### Agent Model Used

SWE-1.6

### Debug Log References

None - story not yet implemented

### Completion Notes List

- Epic 1 is in-progress in sprint status
- Second story in authentication epic builds on foundation from story 1.1
- BetterAuth already configured with OAuth providers from story 1.1
- Need to add password field to User model for email/password authentication
- Need to create security logs table for failed login attempt logging
- Registration and login pages need to follow accessibility standards
- Session management uses JWT tokens with httpOnly cookies
- Security logging required for GDPR compliance
- All authentication data encrypted at rest and in transit

### File List

Files to be created:
- app/(auth)/register/page.tsx (NEW)
- app/(auth)/login/page.tsx (NEW)
- app/(dashboard)/page.tsx (NEW)
- app/(auth)/layout.tsx (NEW)
- app/(dashboard)/layout.tsx (NEW)
- app/api/auth/register/route.ts (NEW)
- lib/validators/auth.ts (NEW)
- components/auth/RegistrationForm.tsx (NEW)
- components/auth/LoginForm.tsx (NEW)

Files to be modified:
- drizzle/schema.ts (MODIFIED - add password field to User model, add securityLogs table)
- .env.local (MODIFIED - add BCRYPT_ROUNDS)
- .env.example (MODIFIED - add BCRYPT_ROUNDS)
- README.md (MODIFIED - document registration and login flows)
