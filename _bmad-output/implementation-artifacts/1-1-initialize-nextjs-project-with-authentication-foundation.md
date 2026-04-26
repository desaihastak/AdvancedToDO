# Story 1.1: Initialize Next.js Project with Authentication Foundation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to initialize the Next.js project with authentication infrastructure,
so that the application has a solid foundation for user authentication and account management.

## Acceptance Criteria

1. Given a fresh development environment, when I run `pnpm create next-app@latest advanced-todo --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"`, then the Next.js project is created with TypeScript, Tailwind CSS, ESLint, and App Router
2. The project structure follows the architecture document specifications
3. NextAuth.js v5 with required dependencies is installed
4. Prisma ORM is configured with PostgreSQL connection to Supabase
5. User model is created in Prisma schema with fields: id, email, name, createdAt, updatedAt
6. Environment variables are set up for database URL and authentication secrets
7. NextAuth.js is configured with OAuth providers (Google, Apple)
8. Authentication API route is created at `/app/api/auth/[...nextauth]/route.ts`
9. The application starts successfully without errors
10. All configurations are documented in the project README

## Tasks / Subtasks

- [ ] Initialize Next.js project with create-next-app (AC: 1)
  - [ ] Run `pnpm create next-app@latest advanced-todo --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"`
  - [ ] Verify project structure matches architecture specifications
  - [ ] Test that the development server starts with `pnpm dev`
- [ ] Install and configure NextAuth.js v5 (AC: 3, 7, 8)
  - [ ] Install NextAuth.js v5 and dependencies: `pnpm install next-auth@beta`
  - [ ] Create auth configuration file at `lib/auth.ts`
  - [ ] Configure OAuth providers (Google, Apple)
  - [ ] Create authentication API route at `/app/api/auth/[...nextauth]/route.ts`
- [ ] Set up Prisma ORM with Supabase PostgreSQL (AC: 4, 5)
  - [ ] Install Prisma CLI and client: `pnpm install prisma --save-dev` and `pnpm install @prisma/client`
  - [ ] Initialize Prisma: `pnpm prisma init`
  - [ ] Configure DATABASE_URL in .env.local pointing to Supabase PostgreSQL
  - [ ] Create User model in schema.prisma with id, email, name, createdAt, updatedAt
  - [ ] Run initial migration: `pnpm prisma migrate dev --name init`
- [ ] Configure environment variables (AC: 6)
  - [ ] Create .env.local with DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
  - [ ] Create .env.example as template
  - [ ] Add OAuth provider credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APPLE_CLIENT_ID, APPLE_CLIENT_SECRET)
- [ ] Document configuration in README (AC: 10)
  - [ ] Document project initialization steps
  - [ ] Document environment variable setup
  - [ ] Document authentication configuration
  - [ ] Document database setup and migration commands

## Dev Notes

### Technical Stack Requirements

**Framework & Language:**
- Next.js 15+ with App Router
- TypeScript 5+ with strict mode
- Node.js runtime

**Database:**
- PostgreSQL 16+ (hosted on Supabase)
- Prisma 5+ ORM for type-safe database access
- User model: id (cuid), email, name, createdAt, updatedAt

**Authentication:**
- NextAuth.js v5 (Auth.js beta)
- OAuth providers: Google, Apple
- JWT session management
- Bring Your Own Database (BYOD) pattern with Prisma

**Project Structure:**
- App Router architecture (app/ directory)
- No src directory (--no-src-dir flag)
- Import alias @/* for clean imports
- API routes in app/api/
- Prisma schema in prisma/

### Architecture Compliance

**Naming Conventions:**
- Database tables: snake_case plural (users)
- Database columns: snake_case (user_id, created_at)
- Components: PascalCase (TaskCard, VoiceInputButton)
- Files: PascalCase for components, kebab-case for utilities
- Functions: camelCase (getUserData, createTask)

**File Structure:**
```
advanced-todo/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   └── db.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env.local
├── .env.example
└── README.md
```

**API Response Format:**
- Success: Direct data object (no wrapper)
- Error: `{ error: { message: string, code: string, details?: any } }`
- Dates: ISO 8601 strings

### Security Requirements

**Data Security:**
- All data encrypted at rest via Supabase PostgreSQL encryption
- TLS 1.2+ for data in transit
- Environment variables for secrets (never commit to git)
- NEXTAUTH_SECRET for JWT token signing
- OAuth provider credentials in environment variables

**Authentication:**
- JWT tokens with httpOnly cookies
- Session expires after 7 days of inactivity
- Secure cookie configuration
- CSRF protection via NextAuth.js built-in

### Database Schema

**User Model:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Indexes:**
- Unique index on email for authentication lookups
- Automatic indexes on id (primary key)

### Environment Variables

Required variables in .env.local:
```
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"
```

### Implementation Sequence

1. **Project Initialization** - Run create-next-app command
2. **Dependency Installation** - Install NextAuth.js, Prisma
3. **Database Setup** - Configure Supabase, initialize Prisma, create User model
4. **Authentication Configuration** - Configure NextAuth.js with OAuth providers
5. **API Route Creation** - Create [...nextauth] route handler
6. **Environment Configuration** - Set up all required environment variables
7. **Documentation** - Update README with setup instructions
8. **Verification** - Test that application starts and auth route is accessible

### Testing Standards

**Verification Steps:**
- Run `pnpm dev` and verify server starts without errors
- Access `/api/auth/[...nextauth]` route and verify it responds
- Check Prisma client connection with `pnpm prisma studio`
- Verify database migration was successful
- Test that .env.local is properly loaded

**No Automated Tests Required:**
- This is infrastructure setup story
- Manual verification of successful initialization is sufficient
- Future stories will add automated tests

### Project Structure Notes

**Alignment with Architecture:**
- Follows App Router structure as specified in architecture.md
- Uses official create-next-app starter as recommended
- Prisma in prisma/ directory at root
- API routes in app/api/ directory
- lib/ for shared utilities and services

**No Conflicts Detected:**
- Greenfield project, no existing code to conflict with
- Fresh installation ensures clean architecture compliance

### References

- [Source: architecture.md#Starter Template Evaluation] - Official create-next-app selection rationale
- [Source: architecture.md#Data Architecture] - PostgreSQL + Prisma ORM decision
- [Source: architecture.md#Authentication & Security] - NextAuth.js v5 configuration
- [Source: architecture.md#Project Structure] - Complete directory structure specification
- [Source: prd.md#Technical Constraints] - Technology stack requirements
- [Source: epics.md#Story 1.1] - Original acceptance criteria and user story

## Dev Agent Record

### Agent Model Used

SWE-1.6

### Debug Log References

None - initial infrastructure setup story

### Completion Notes List

- Epic 1 marked as in-progress in sprint status
- First story in authentication epic establishes foundation
- No previous story context (first implementation story)

### File List

Expected files created/modified:
- app/api/auth/[...nextauth]/route.ts (NEW)
- lib/auth.ts (NEW)
- lib/db.ts (NEW)
- prisma/schema.prisma (NEW)
- prisma/migrations/*_init/migration.sql (NEW)
- .env.local (NEW)
- .env.example (NEW)
- README.md (MODIFIED)
- package.json (MODIFIED - dependencies added)
