# AdvancedToDo

A Next.js-based task management application with AI-powered organization and creative animated interfaces.

## Project Initialization

This project was initialized with:
```bash
pnpm create next-app@latest advanced-todo --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
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

1. Generate database migration:
```bash
pnpm drizzle-kit generate
```

2. Apply migration to database:
```bash
pnpm drizzle-kit migrate
```

3. Rollback migration (if needed):
```bash
# Manually revert the last migration SQL file in drizzle/migrations/
# Then re-generate and apply if necessary
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
advanced-todo/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts          # BetterAuth API route
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts                       # BetterAuth configuration
│   └── db.ts                         # Drizzle database instance
├── drizzle/
│   ├── schema.ts                     # Database schema definitions
│   ├── config.ts                     # Drizzle configuration
│   └── migrations/                   # Database migrations
├── .env.local                        # Environment variables (not committed)
├── .env.example                      # Environment template
└── README.md
```

## Technology Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: BetterAuth
- **OAuth Providers**: Google, Apple

## Authentication

Authentication is handled by BetterAuth with the following providers:
- Google OAuth
- Apple OAuth

The authentication API route is located at `/app/api/auth/[...all]/route.ts`.

## Database Schema

The current schema includes BetterAuth core tables:
```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  emailVerified: boolean("emailVerified").default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().$defaultFn(() => sql`now()`),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().$defaultFn(() => sql`now()`),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().$defaultFn(() => sql`now()`),
})
```

## Development Notes

- This project uses the App Router architecture
- No src directory structure (flat app/ directory)
- Import alias `@/*` configured for clean imports
- TypeScript strict mode enabled
- ESLint configured for code quality

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [BetterAuth Documentation](https://better-auth.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
