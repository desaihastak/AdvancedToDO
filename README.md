# AdvancedToDo

A Next.js-based task management application with AI-powered organization and creative animated interfaces.

## Project Initialization

This project was initialized with:
```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- PostgreSQL database (Supabase recommended)
- OAuth credentials for Google and Apple providers

### Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Configure the following environment variables in `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/advanced_todo"
BETTER_AUTH_SECRET="your-secret-key-here-change-in-production"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"
```

### Database Setup

1. Generate Prisma client:
```bash
pnpm prisma generate
```

2. Apply schema to database (for development):
```bash
pnpm prisma db push
```

3. Create and apply migration (for production):
```bash
pnpm prisma migrate dev --name migration_name
```

4. View database in Prisma Studio:
```bash
pnpm prisma studio
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts          # BetterAuth API route
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts                       # BetterAuth configuration
│   └── db.ts                         # Prisma client instance
├── prisma/
│   ├── schema.prisma                 # Database schema definitions
│   └── migrations/                   # Database migrations
├── .env.local                        # Environment variables (not committed)
├── .env.example                      # Environment template
└── README.md
```

## Technology Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives with Cosmic Violet theme)
- **Icons**: lucide-react with custom Icon wrapper component
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: BetterAuth
- **OAuth Providers**: Google, Apple
- **Testing**: Playwright MCP for E2E testing

## Authentication

Authentication is handled by BetterAuth with the following providers:
- Google OAuth
- Apple OAuth

The authentication API route is located at `/app/api/auth/[...all]/route.ts`.

## Database Schema

The current schema includes BetterAuth core tables:
```prisma
model User {
  id                  String    @id @default(cuid())
  email               String    @unique
  name                String?
  password            String?   // Nullable for OAuth-only users
  emailVerified       Boolean   @default(false)
  lockedUntil         DateTime?
  failedLoginAttempts Int       @default(0)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @default(now()) @updatedAt
  sessions            Session[]
  accounts            Account[]
  securityLogs        SecurityLog[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String
  expiresAt DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Account {
  id               String    @id @default(cuid())
  userId           String
  provider         String
  providerAccountId String
  accessToken      String?
  refreshToken     String?
  expiresAt        DateTime?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @default(now()) @updatedAt
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model SecurityLog {
  id         String   @id @default(cuid())
  userId     String?
  eventType  String
  success    Boolean
  ipAddress  String?
  userAgent  String?
  timestamp  DateTime @default(now())
  user       User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([timestamp])
  @@index([eventType])
  @@index([userId, timestamp])
}
```

## Development Notes

- This project uses the App Router architecture
- No src directory structure (flat app/ directory)
- Import alias `@/*` configured for clean imports
- TypeScript strict mode enabled with best practices:
  - `noUncheckedIndexedAccess`: Prevents undefined access on array/object properties
  - `noImplicitReturns`: Ensures all code paths return a value
  - `noFallthroughCasesInSwitch`: Prevents switch case fallthrough
  - `noUnusedLocals`: Prevents unused local variables
  - `noUnusedParameters`: Prevents unused function parameters
  - `noImplicitOverride`: Ensures override methods explicitly marked
  - `exactOptionalPropertyTypes`: Strict optional property checking
  - `noPropertyAccessFromIndexSignature`: Requires proper property access
  - `forceConsistentCasingInFileNames`: Enforces consistent file naming
- No type hacks allowed (no `@ts-ignore`, `@ts-expect-error`, or `as any`)
- ESLint configured for code quality with comprehensive rules:
  - Tailwind CSS v4: Use canonical classnames (e.g., `bg-linear-to-br` not `bg-gradient-to-br`)
  - TypeScript: No `any` types, no non-null assertions (!), proper variable naming
  - React: No unescaped entities, no useless fragments
  - Environment variables: Use bracket notation (process.env['KEY'])
  - Color policy: STRICT - Use only Cosmic Violet semantic color names (primary, secondary, accent, surface, foreground, muted) or UI state colors (red, green, yellow, blue) for semantic meaning. No generic Tailwind colors (black, white, gray, zinc, slate, etc.) or hardcoded hex/rgb colors
- Playwright MCP: Serves as the "eyes" for AI development - enables visual inspection of implemented features, identifies improvement opportunities, and discovers gaps beyond what was implemented

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [BetterAuth Documentation](https://better-auth.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
