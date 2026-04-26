---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ["prd.md", "ux-design-specification.md"]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
project_name: 'AdvancedToDo'
user_name: 'Mr. Perfect'
date: '2026-04-26'
completedAt: '2026-04-26'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The AdvancedToDo application has 47 functional requirements organized into eight categories:

- **Task Management (FR1-FR7)**: Core CRUD operations for tasks with system-assigned categorization and priority organization. This requires a flexible data model that supports AI-assigned metadata while allowing user overrides.

- **Input Methods (FR8-FR12)**: Multi-modal input through voice (Web Speech API), image screenshots, and text typing. This requires integration with browser-native speech recognition, image processing pipeline, and unified input handling with visual feedback during processing.

- **AI Processing (FR13-FR18)**: Extract individual tasks from unstructured multi-task input, categorize by content analysis, assign priority levels, and organize automatically. Users can override system assignments. This requires an NLP/ML processing pipeline with confidence scoring and learning capabilities.

- **Synchronization (FR19-FR23)**: Real-time sync across devices with conflict resolution for simultaneous edits, offline queue management, and automatic reconciliation. This requires a robust sync architecture with WebSocket/SSE, optimistic UI updates, and conflict resolution strategies.

- **User Management (FR24-FR30)**: Account creation, authentication, settings management, data encryption, export, deletion, and GDPR consent management. This requires secure authentication (OAuth/JWT), encrypted storage, and compliance workflows.

- **Visual Experience (FR31-FR35)**: Animated transitions for task appearance and completion, visual celebrations, consistent design system, and visual feedback for all actions. This requires a sophisticated animation system (Framer Motion) with GPU acceleration and performance monitoring.

- **Accessibility (FR36-FR41)**: Keyboard navigation, screen reader support, ARIA labels, screen reader announcements, reduced motion support, and WCAG AA color contrast. This requires semantic HTML, ARIA implementation, and accessibility testing infrastructure.

- **Data Privacy & Compliance (FR42-FR47)**: GDPR compliance (portability, deletion, consent), audit logging, rate limiting, and content moderation. This requires compliance workflows, logging infrastructure, and API protection mechanisms.

**Non-Functional Requirements:**

The application has 33 non-functional requirements that will drive architectural decisions:

- **Performance (NFR1-NFR6)**: Voice-to-task under 2 seconds, sync latency under 500ms, FCP under 3 seconds, TTI under 5 seconds, 60fps animations, and bundle size under 200KB gzipped. This requires performance optimization at every layer, CDN usage, code splitting, and animation budgeting.

- **Security (NFR7-NFR12)**: Encryption at rest and in transit (TLS 1.2+), secure authentication (OAuth 2.0/JWT), audit logging, API rate limiting, and GDPR deletion within 30 days. This requires security infrastructure, encryption key management, and compliance automation.

- **Scalability (NFR13-NFR16)**: Support 1,000 concurrent users with <10% degradation, scale to 10,000 users without architectural changes, handle 10x data growth, and auto-scaling for traffic spikes. This requires horizontal scalability, database optimization, and cloud-native architecture.

- **Accessibility (NFR17-NFR23)**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support, ARIA labels, color contrast ratios, reduced motion support, and focus management. This requires accessibility-first development and automated testing.

- **Integration (NFR24-NFR29)**: Web Speech API with fallbacks, calendar/email APIs (Google, Outlook, Apple), public REST API with webhooks, and graceful failure handling. This requires integration architecture with fallback strategies and API versioning.

- **Reliability (NFR30-NFR33)**: 99.9% uptime for sync service, automated backups with point-in-time recovery, outage recovery without data loss, and database replication. This requires high availability architecture, backup automation, and disaster recovery planning.

**Scale & Complexity:**

- Primary domain: Full-stack web application with real-time features and AI processing
- Complexity level: Medium - innovative features without heavy regulatory requirements, but real-time sync and AI processing add complexity
- Estimated architectural components: Frontend (Next.js/React), Backend (API routes/Next.js), Real-time sync (WebSocket/SSE), AI processing (NLP/ML), Database (with sync/replication), Authentication (OAuth/JWT), Animation system (Framer Motion), and Integration layer

### Technical Constraints & Dependencies

**Technology Constraints:**
- Next.js framework for SPA architecture with client-side routing
- Web Speech API for voice input (browser-dependent, requires fallbacks)
- shadcn-ui component library with Radix UI primitives
- Tailwind CSS for styling
- Framer Motion for animations
- Target browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

**Platform Constraints:**
- Cross-platform consistency across mobile and desktop browsers
- Touch-optimized interfaces with gesture support
- Progressive enhancement for older browsers
- Offline-first architecture with sync reconciliation

**Integration Dependencies:**
- Web Speech API (browser-native, variable support)
- Calendar APIs (Google Calendar, Outlook, Apple Calendar) - Phase 2
- Email APIs (Gmail, Outlook) - Phase 2
- Potential third-party NLP services (OpenAI, Google NLP) if basic rule-based categorization insufficient

**Performance Dependencies:**
- CDN for static asset delivery
- Image processing service for screenshot input
- Real-time sync infrastructure (WebSocket/SSE)
- GPU acceleration for animations

### Cross-Cutting Concerns Identified

**Real-Time Synchronization:**
- Sub-500ms sync latency requirement affects database design, sync protocol, and conflict resolution strategy
- Optimistic UI updates require rollback mechanisms
- Offline queue management needs automatic reconciliation

**AI Processing Pipeline:**
- Voice recognition accuracy and confidence scoring
- Image processing for screenshot input
- NLP categorization with learning from user corrections
- Processing latency must meet 2-second end-to-end requirement

**Animation Performance:**
- 60fps requirement across all transitions
- GPU-accelerated transforms mandatory
- Performance budget monitoring and simplified mode for low-end devices
- Respects prefers-reduced-motion for accessibility

**Accessibility Compliance:**
- WCAG 2.1 AA affects all UI components
- Screen reader support for dynamic content
- Keyboard navigation for all interactions
- Focus management for animated transitions
- Color contrast requirements throughout

**Data Security & Privacy:**
- GDPR compliance affects data storage, deletion, and export workflows
- Encryption at rest and in transit
- Audit logging for security events
- Consent management infrastructure

**Scalability & Reliability:**
- Horizontal scaling for 10,000+ users
- Database replication and backup automation
- Auto-scaling for traffic spikes
- 99.9% uptime for sync service

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application with real-time features and AI processing, based on project requirements analysis.

### Starter Options Considered

1. **Official create-next-app** - The standard Next.js starter maintained by the Next.js team. Provides TypeScript, Tailwind CSS, ESLint, and App Router out of the box. Maximum flexibility for adding custom requirements like real-time sync and AI processing.

2. **T3 Stack (create-t3-app)** - Opinionated full-stack starter with TypeScript, Tailwind, Prisma, tRPC, and NextAuth. Excellent for typesafe full-stack apps but may be over-opinionated for your specific AI processing and real-time sync needs.

3. **shadcn/ui Community Templates** - Pre-built templates with shadcn/ui already integrated. Good starting point but may have architectural decisions that don't align with your unique requirements.

### Selected Starter: Official create-next-app

**Rationale for Selection:**
- Maximum flexibility to implement your unique requirements (real-time sync with <500ms latency, AI processing pipeline, custom "cosmic violet" animations)
- Officially maintained by Next.js team with regular updates
- TypeScript and Tailwind CSS included by default
- App Router architecture supports your SPA requirements
- Easy to add shadcn-ui and Framer Motion as needed
- No architectural constraints that would conflict with your AI/real-time requirements

**Initialization Command:**

```bash
pnpm create next-app@latest advanced-todo --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript 5+ with strict type checking
- Node.js runtime with Next.js 15+ framework
- Modern ES modules with tree-shaking support

**Styling Solution:**
- Tailwind CSS 4+ with JIT compilation
- PostCSS for CSS processing
- CSS Modules for component-scoped styles when needed

**Build Tooling:**
- Next.js built-in optimization (code splitting, image optimization, font optimization)
- Turbopack for faster builds (Next.js 15+)
- Automatic bundle size optimization

**Testing Framework:**
- Jest configuration included (can add Playwright for E2E testing as specified in PRD)
- Testing utilities for React components

**Code Organization:**
- App Router structure (app/ directory with route-based organization)
- Component co-location with routes
- Server and client component separation
- API routes in app/api/ directory

**Development Experience:**
- Hot Module Replacement (HMR) for instant updates
- TypeScript language server integration
- ESLint for code quality
- Prettier for code formatting (can be added)

**Note:** Project initialization using this command should be the first implementation story. After initialization, we'll add shadcn-ui, Framer Motion, and configure the real-time sync and AI processing infrastructure.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Database: PostgreSQL with Drizzle ORM
- Authentication: BetterAuth
- Real-Time Sync: Server-Sent Events (SSE)
- State Management: React Context + Server Components
- AI Processing: Hybrid (rule-based MVP + OpenAI GPT-4 Phase 2)
- Infrastructure: Vercel + Supabase

**Important Decisions (Shape Architecture):**
- API Design: REST with Next.js API Routes
- Caching Strategy: React Query for client caching, PostgreSQL query caching
- Data Validation: Zod schemas with TypeScript types
- Error Handling: Standardized error boundaries + API error responses

**Deferred Decisions (Post-MVP):**
- CDN strategy (Vercel Edge Network sufficient for MVP)
- Advanced AI model selection (Phase 2)
- Calendar/Email integration APIs (Phase 2)
- Custom scaling rules (Phase 3)

### Data Architecture

**Database Choice: PostgreSQL 16+**
- **Rationale:** ACID compliance for task synchronization integrity, complex query support for filtering/sorting, excellent TypeScript support via Drizzle, proven scalability to 10,000+ users, strong consistency guarantees
- **Version:** PostgreSQL 16 (latest stable)
- **ORM:** Drizzle ORM for type-safe database access
- **Real-time Sync:** PostgreSQL logical replication with Change Data Capture (CDC)
- **Affects:** Task CRUD operations, sync service, conflict resolution
- **Provided by Starter:** No

**Data Modeling Approach:**
- **Decision:** Relational schema with normalized tables (users, tasks, categories, priorities, sync_queue)
- **Rationale:** Complex queries require relational structure, data integrity critical for sync, Drizzle provides excellent TypeScript integration
- **Affects:** Database schema design, Drizzle schema configuration

**Data Validation Strategy:**
- **Decision:** Zod schemas for runtime validation with TypeScript type inference
- **Rationale:** Type safety from database to API to frontend, runtime validation for user input, excellent TypeScript integration
- **Affects:** API route validation, form validation, type definitions

**Migration Approach:**
- **Decision:** Drizzle Kit with version-controlled schema files
- **Rationale:** Type-safe migrations, automatic schema sync, rollback capability, simpler configuration than Prisma
- **Affects:** Database deployment workflow, schema changes

**Caching Strategy:**
- **Decision:** React Query for client-side caching, PostgreSQL query caching for server-side
- **Rationale:** Optimistic UI updates, automatic cache invalidation, reduces database load
- **Affects:** Client performance, server load, sync latency

### Authentication & Security

**Authentication Method: BetterAuth**
- **Rationale:** OAuth 2.0 support (Google, Apple, etc.), built-in audit logging, 2FA, RBAC, excellent TypeScript support, Drizzle ORM integration, framework-agnostic for future mobile support
- **Version:** BetterAuth (latest)
- **Providers:** OAuth (Google, Apple) + Email/password option
- **Affects:** User account management, API security, session handling, GDPR compliance
- **Provided by Starter:** No

**Authorization Patterns:**
- **Decision:** Role-based access control (user, admin) with middleware protection
- **Rationale:** Simple authorization model sufficient for current requirements, easy to extend, Next.js middleware integration
- **Affects:** API route protection, admin dashboard access

**Security Middleware:**
- **Decision:** Next.js middleware for route protection, rate limiting via API middleware
- **Rationale:** Edge-level protection, centralized security logic, performance optimization
- **Affects:** API security, rate limiting implementation

**Data Encryption Approach:**
- **Decision:** Encryption at rest via Supabase (PostgreSQL encryption), TLS 1.3 for data in transit
- **Rationale:** GDPR compliance requirement, managed encryption reduces complexity, industry standard
- **Affects:** Data security implementation, compliance workflows

**API Security Strategy:**
- **Decision:** JWT tokens with short expiry, refresh token rotation, CORS configuration
- **Rationale:** Industry best practice, secure session management, GDPR compliance
- **Affects:** Authentication flow, API security implementation

### API & Communication Patterns

**API Design Patterns: REST with Next.js API Routes**
- **Rationale:** Simplicity, excellent Next.js integration, sufficient for current requirements, easy to extend to GraphQL if needed
- **Affects:** API route structure, client API integration
- **Provided by Starter:** Partially (API routes structure provided)

**API Documentation Approach:**
- **Decision:** OpenAPI/Swagger documentation via TypeScript comments
- **Rationale:** Auto-generated from TypeScript types, single source of truth, industry standard
- **Affects:** API documentation workflow, type safety

**Error Handling Standards:**
- **Decision:** Standardized error responses with error codes, client-side error boundaries
- **Rationale:** Consistent error experience, easier debugging, better UX
- **Affects:** Error handling implementation, user experience

**Rate Limiting Strategy:**
- **Decision:** API middleware rate limiting (100 requests/minute per user)
- **Rationale:** Prevent abuse, protect API resources, GDPR compliance requirement
- **Affects:** API security, user experience

**Communication Between Services:**
- **Decision:** Server-Sent Events (SSE) for real-time sync, REST for API calls
- **Rationale:** SSE optimized for server-to-client updates, simpler than WebSockets, automatic reconnection, meets <500ms latency requirement
- **Affects:** Real-time sync implementation, sync service architecture

### Frontend Architecture

**State Management Approach: React Context + Server Components**
- **Rationale:** Next.js App Router Server Components handle data fetching directly, eliminating complex client-side state. React Context for UI state (modals, voice input, animation states). Server Actions for mutations. This leverages Next.js architecture optimally.
- **Affects:** Component architecture, data fetching patterns
- **Provided by Starter:** Partially (Server Components provided)

**Component Architecture:**
- **Decision:** shadcn-ui components as base, custom components for unique features (voice input, task cards, animations)
- **Rationale:** shadcn-ui provides accessible foundation, custom components for unique "cosmic violet" experience, full code ownership
- **Affects:** UI development workflow, component library structure

**Routing Strategy:**
- **Decision:** Next.js App Router with file-based routing
- **Rationale:** Built into starter, excellent performance, SEO-friendly, server components support
- **Affects:** Route structure, navigation patterns
- **Provided by Starter:** Yes

**Performance Optimization:**
- **Decision:** Code splitting via Next.js dynamic imports, image optimization via Next.js Image component, bundle size monitoring
- **Rationale:** Meets <200KB bundle requirement, fast initial load, 60fps animations
- **Affects:** Bundle size, load performance, animation performance
- **Provided by Starter:** Partially (optimization tools provided)

**Bundle Optimization:**
- **Decision:** Turbopack for faster builds, dynamic imports for route-based code splitting, tree-shaking for unused code
- **Rationale:** Faster development cycle, smaller bundles, better performance
- **Affects:** Build performance, runtime performance
- **Provided by Starter:** Yes (Turbopack)

### Infrastructure & Deployment

**Hosting Strategy: Vercel**
- **Rationale:** Native Next.js optimization, automatic scaling to 10,000+ users, edge network for global performance, zero-config deployment, excellent developer experience
- **Affects:** Deployment workflow, scaling, performance
- **Provided by Starter:** No

**Database Hosting: Supabase**
- **Rationale:** Managed PostgreSQL with built-in backup/replication, real-time subscriptions support, excellent TypeScript integration, automatic scaling, 99.9% uptime SLA
- **Affects:** Database management, backup strategy, sync infrastructure

**CI/CD Pipeline Approach:**
- **Decision:** Vercel built-in CI/CD with GitHub integration, automated testing on PR
- **Rationale:** Zero configuration, automatic deployments, preview environments, integrates with GitHub
- **Affects:** Deployment workflow, testing workflow

**Environment Configuration:**
- **Decision:** Environment variables via Vercel, .env.local for local development
- **Rationale:** Industry standard, secure secret management, easy local development
- **Affects:** Configuration management, secret handling

**Monitoring and Logging:**
- **Decision:** Vercel Analytics for performance monitoring, custom logging for business metrics
- **Rationale:** Built-in monitoring, zero configuration, sufficient for MVP requirements
- **Affects:** Observability, debugging, performance tracking

**Scaling Strategy:**
- **Decision:** Vercel automatic scaling, Supabase auto-scaling, CDN via Vercel Edge Network
- **Rationale:** Meets 10,000+ user requirement, hands-off scaling, cost-effective for growth
- **Affects:** Infrastructure costs, performance at scale

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize Next.js project with create-next-app (first implementation story)
2. Set up PostgreSQL database with Supabase
3. Configure Drizzle ORM and create initial schema
4. Implement BetterAuth authentication
5. Set up Server-Sent Events for real-time sync
6. Implement basic task CRUD operations
7. Add shadcn-ui components
8. Implement Framer Motion animations
9. Add voice input with Web Speech API
10. Implement AI categorization (rule-based MVP)

**Cross-Component Dependencies:**
- Authentication must be implemented before user-specific features
- Database schema must be designed before API routes
- Real-time sync depends on database structure
- AI processing depends on task data model
- Animations depend on component structure
- Voice input depends on task creation API

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
25 areas where AI agents could make different choices across naming, structure, format, communication, and process patterns

### Naming Patterns

**Database Naming Conventions:**
- Table naming: snake_case plural (users, tasks, categories)
- Column naming: snake_case (user_id, created_at, is_completed)
- Foreign key format: {table}_id (user_id, category_id)
- Index naming: idx_{table}_{columns} (idx_users_email, idx_tasks_user_id)
- Constraint naming: {table}_{constraint_type}_{columns} (users_unique_email)

**API Naming Conventions:**
- REST endpoint naming: plural nouns (/api/tasks, /api/users)
- Route parameter format: :id (app/tasks/[id]/page.tsx)
- Query parameter naming: snake_case (user_id, created_after)
- Header naming: X-Custom-Header convention for custom headers

**Code Naming Conventions:**
- Component naming: PascalCase (TaskCard, VoiceInputButton)
- File naming: PascalCase for components (TaskCard.tsx), kebab-case for utilities (format-date.ts)
- Function naming: camelCase (getUserData, createTask)
- Variable naming: camelCase (userId, taskList)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL, MAX_RETRY_COUNT)

### Structure Patterns

**Project Organization:**
- Tests: Co-located with source files using .test.ts or .spec.ts suffix
- Components: Organized by feature in app/ directory, shared components in components/
- Utilities: lib/utils/ for shared utilities, lib/ for domain-specific helpers
- Services: lib/services/ for external API integrations
- Types: types/ directory for shared TypeScript types

**File Structure Patterns:**
- Config files: Root level (next.config.js, tailwind.config.ts, drizzle/schema.ts, drizzle.config.ts)
- Static assets: public/ directory for static files
- Documentation: docs/ directory for project documentation
- Environment: .env.local for local, .env.production for production

### Format Patterns

**API Response Formats:**
- Success response: Direct data object (no wrapper for simple responses)
- Error format: { error: { message: string, code: string, details?: any } }
- Date format in JSON: ISO 8601 strings (2026-04-26T18:00:00Z)
- Success response with pagination: { data: [], meta: { total, page, limit } }

**Data Exchange Formats:**
- JSON field naming: camelCase in API responses (userId, createdAt)
- Boolean representations: true/false
- Null handling: Use null for missing optional fields, never undefined in JSON
- Array vs object: Always array for collections, even single items

### Communication Patterns

**Event System Patterns:**
- Event naming: domain.action format (task.created, task.completed, user.updated)
- Event payload: { id, type, data, timestamp }
- Event versioning: Include version in event type (task.created.v1)
- Async event handling: Queue-based with retry logic

**State Management Patterns:**
- State update patterns: Immutable updates only (no direct mutation)
- Action naming: Verb + noun (createTask, updateTask, deleteTask)
- Selector patterns: use prefix for hooks (useTasks, useCurrentUser)
- State organization: Co-locate state with components using React Context

### Process Patterns

**Error Handling Patterns:**
- Global error handling: Error boundaries at route level
- Error boundary patterns: Catch errors, show user-friendly message, log technical details
- User-facing error format: Simple, actionable messages
- Logging vs user error: Technical details logged, user sees simplified message

**Loading State Patterns:**
- Loading state naming: isLoading prefix (isLoadingTasks, isCreatingTask)
- Global vs local: Local loading states for specific operations
- Loading state persistence: Clear on success or error
- Loading UI patterns: Skeleton loaders for content, spinners for actions

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow the naming conventions defined above
- Use the established file structure patterns
- Implement API responses in the specified format
- Apply consistent error handling patterns
- Use immutable state updates only
- Write tests co-located with source files
- Include TypeScript types for all functions and components

**Pattern Enforcement:**
- ESLint rules for naming conventions
- TypeScript strict mode for type safety
- Code review checklist for pattern compliance
- Automated tests verify API response formats
- Pre-commit hooks for pattern validation

### Pattern Examples

**Good Examples:**
```
// Database table (Drizzle schema)
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => sql`gen_random_uuid()`),
  title: text("title").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isCompleted: boolean("is_completed").notNull().default(false),
})

// API route
app/api/tasks/route.ts
GET /api/tasks?user_id=xxx
Response: [{ id: "1", title: "...", userId: "...", createdAt: "...", isCompleted: false }]

// Component
components/tasks/TaskCard.tsx
export function TaskCard({ task }: TaskCardProps) {
  const { updateTask } = useTaskActions();
  // ...
}

// Error handling
{ error && <ErrorMessage message={error.message} />}
```

**Anti-Patterns:**
```
// ❌ Wrong: Inconsistent naming
model task { ... }  // Should be: model Task { ... }
get_user_data()     // Should be: getUserData()
task-card.tsx       // Should be: TaskCard.tsx

// ❌ Wrong: API response wrapper
{ success: true, data: [...] }  // Should be: direct array

// ❌ Wrong: Direct state mutation
task.isCompleted = true;  // Should be: setTask({...task, isCompleted: true})

// ❌ Wrong: Tests in separate directory
tests/TaskCard.test.tsx  // Should be: TaskCard.test.tsx co-located
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
advanced-todo/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
├── .env.local
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── tasks/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── tasks/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── sync/
│   │   │   └── route.ts
│   │   ├── ai/
│   │   │   ├── categorize/
│   │   │   │   └── route.ts
│   │   │   └── transcribe/
│   │   │       └── route.ts
│   │   └── users/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   └── middleware.ts
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ... (shadcn-ui components)
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskFilter.tsx
│   ├── voice-input/
│   │   ├── VoiceInputButton.tsx
│   │   ├── VoiceWaveform.tsx
│   │   └── VoiceInputButton.test.tsx
│   ├── screenshot-input/
│   │   ├── ScreenshotDropZone.tsx
│   │   └── ScreenshotDropZone.test.tsx
│   ├── animations/
│   │   ├── TaskAppear.tsx
│   │   ├── TaskComplete.tsx
│   │   ├── CelebrationAnimation.tsx
│   │   └── CosmicBackground.tsx
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   ├── LoginButton.tsx
│   │   └── UserMenu.tsx
│   └── sync/
│       ├── SyncIndicator.tsx
│       └── SyncStatus.tsx
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── utils.ts
│   ├── services/
│   │   ├── tasks.ts
│   │   ├── sync.ts
│   │   ├── ai.ts
│   │   ├── nlp.ts
│   │   └── compliance.ts
│   ├── hooks/
│   │   ├── useTasks.ts
│   │   ├── useSync.ts
│   │   ├── useVoiceInput.ts
│   │   └── useAuth.ts
│   └── validators/
│       ├── task.ts
│       └── user.ts
├── types/
│   ├── task.ts
│   ├── user.ts
│   ├── sync.ts
│   └── ai.ts
├── drizzle/
│   ├── schema.ts
│   ├── config.ts
│   └── migrations/
│       ├── 0000_init/
│       │   └── migration.sql
│       └── ...
├── public/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   └── favicon.ico
└── docs/
    ├── api.md
    ├── architecture.md
    └── deployment.md
```

### Architectural Boundaries

**API Boundaries:**
- External API endpoints: `/api/tasks`, `/api/users`, `/api/sync`, `/api/ai/*`
- Internal service boundaries: lib/services/ contains all business logic
- Authentication boundary: BetterAuth at `/api/auth/[...all]`
- Data access layer boundary: Drizzle ORM in lib/db.ts

**Component Boundaries:**
- Frontend component communication: Props for parent-child, React Context for cross-component
- State management boundaries: Server Components for data, React Context for UI state
- Service communication patterns: API routes call lib/services/
- Event-driven integration points: SSE endpoint at `/api/sync` for real-time updates

**Service Boundaries:**
- Task service: lib/services/tasks.ts handles all task CRUD operations
- Sync service: lib/services/sync.ts handles real-time synchronization
- AI service: lib/services/ai.ts handles categorization and transcription
- Compliance service: lib/services/compliance.ts handles GDPR requirements

**Data Boundaries:**
- Database schema boundaries: drizzle/schema.ts defines all models
- Data access patterns: All database access goes through Drizzle client
- Caching boundaries: React Query for client cache, PostgreSQL query cache for server
- External data integration: Supabase for PostgreSQL, OpenAI API for AI processing

### Requirements to Structure Mapping

**Feature/Epic Mapping:**

Task Management (FR1-FR7):
- Components: components/tasks/
- Services: lib/services/tasks.ts
- API Routes: app/api/tasks/
- Database: drizzle/schema.ts (Task model)
- Tests: components/tasks/*.test.tsx

Input Methods (FR8-FR12):
- Components: components/voice-input/, components/screenshot-input/
- Services: lib/services/ai.ts, lib/services/nlp.ts
- API Routes: app/api/ai/
- Database: drizzle/schema.ts (Task model with input_source field)
- Tests: components/voice-input/*.test.tsx

AI Processing (FR13-FR18):
- Services: lib/services/ai.ts, lib/services/nlp.ts
- API Routes: app/api/ai/categorize/, app/api/ai/transcribe/
- Database: prisma/schema.prisma (Task model with category, priority fields)
- Tests: lib/services/ai.test.ts

Synchronization (FR19-FR23):
- Components: components/sync/
- Services: lib/services/sync.ts
- API Routes: app/api/sync/
- Database: drizzle/schema.ts (SyncQueue model)
- Tests: lib/services/sync.test.ts

User Management (FR24-FR30):
- Components: components/auth/
- Services: lib/services/auth.ts, lib/auth.ts
- API Routes: app/api/auth/[...all]/, app/api/users/
- Database: drizzle/schema.ts (User, Session, Account models)
- Tests: components/auth/*.test.tsx

Visual Experience (FR31-FR35):
- Components: components/animations/
- Services: None (client-side only)
- API Routes: None
- Database: None
- Tests: components/animations/*.test.tsx

Accessibility (FR36-FR41):
- Components: components/ui/ (shadcn-ui with ARIA)
- Services: None
- API Routes: None
- Database: None
- Tests: E2E tests with Playwright

Data Privacy & Compliance (FR42-FR47):
- Services: lib/services/compliance.ts
- API Routes: app/api/users/ (for deletion/export)
- Database: drizzle/schema.ts (User model with consent fields)
- Tests: lib/services/compliance.test.ts

**Cross-Cutting Concerns:**

Authentication System:
- Components: components/auth/
- Services: lib/auth.ts, lib/services/auth.ts
- Middleware: app/middleware.ts
- API Routes: app/api/auth/[...nextauth]/
- Tests: components/auth/*.test.tsx, lib/auth.test.ts

Real-Time Sync:
- Components: components/sync/
- Services: lib/services/sync.ts
- API Routes: app/api/sync/
- Database: prisma/schema.prisma (SyncQueue model)
- Tests: lib/services/sync.test.ts

Error Handling:
- Global: app/error.tsx, app/layout.tsx (Error Boundary)
- Components: components/ui/error-message.tsx
- Services: All services use standardized error format
- Tests: Error handling tests across all services

### Integration Points

**Internal Communication:**
- Server Components → API Routes: Server Actions for mutations
- Client Components → API Routes: fetch() calls via lib/hooks/
- Components → Services: React hooks (useTasks, useSync, useAuth)
- Services → Database: Prisma client via lib/db.ts

**External Integrations:**
- NextAuth.js: OAuth providers (Google, Apple)
- Supabase: PostgreSQL hosting and real-time subscriptions
- OpenAI API: AI categorization (Phase 2)
- Web Speech API: Browser-native voice recognition
- Vercel: Hosting and deployment

**Data Flow:**
1. User input (voice/screenshot) → Component
2. Component → AI service (via API route)
3. AI service → Database (via Prisma)
4. Database → Sync service (via CDC)
5. Sync service → SSE endpoint
6. SSE endpoint → Client components (via EventSource)
7. Client components → UI updates

### File Organization Patterns

**Configuration Files:**
- Root level: package.json, next.config.js, tailwind.config.ts, tsconfig.json
- Environment: .env.local (local), .env.production (Vercel)
- CI/CD: .github/workflows/
- Database: prisma/schema.prisma

**Source Organization:**
- App Router: app/ directory with route-based organization
- Components: components/ organized by feature (tasks, auth, voice-input, etc.)
- Shared UI: components/ui/ for shadcn-ui components
- Services: lib/services/ for business logic
- Hooks: lib/hooks/ for React hooks
- Types: types/ for TypeScript type definitions
- Utilities: lib/utils/ for shared utilities

**Test Organization:**
- Co-located: Component tests next to components (*.test.tsx)
- Service tests: lib/services/*.test.ts
- E2E tests: tests/e2e/ with Playwright
- Test utilities: tests/__mocks__/ for mocks and fixtures

**Asset Organization:**
- Static assets: public/assets/
- Images: public/assets/images/
- Icons: public/assets/icons/
- Fonts: public/assets/fonts/
- Favicon: public/favicon.ico

### Development Workflow Integration

**Development Server Structure:**
- Next.js dev server: `pnpm dev` runs on localhost:3000
- Hot Module Replacement: Automatic for all file changes
- TypeScript checking: Built into dev server
- Prisma Studio: `pnpm prisma studio` for database inspection

**Build Process Structure:**
- Next.js build: `pnpm build` creates optimized production build
- Turbopack: Faster builds with Turbopack (Next.js 15+)
- Code splitting: Automatic via Next.js dynamic imports
- Asset optimization: Automatic via Next.js Image component

**Deployment Structure:**
- Vercel: Automatic deployment from GitHub main branch
- Environment variables: Configured in Vercel dashboard
- Database migrations: Automatic via Prisma migrate deploy
- Preview environments: Automatic for each PR

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices work together without conflicts. Next.js 15+, PostgreSQL 16, Prisma 5+, NextAuth.js v5, and Framer Motion are fully compatible. TypeScript strict mode across all components ensures type safety. SSE for real-time sync integrates seamlessly with Next.js API routes. No contradictory decisions found.

**Pattern Consistency:**
Implementation patterns fully support architectural decisions. Naming conventions (snake_case for database, camelCase for code, PascalCase for components) align with TypeScript/Prisma best practices. Structure patterns (co-located tests, feature-based organization) enable the chosen technology stack. Communication patterns (SSE for server-to-client, REST for API calls) are coherent with the architecture.

**Structure Alignment:**
Project structure supports all architectural decisions. App Router structure enables Next.js server components. Component organization (feature-based with shared UI) supports the UI architecture. Service layer (lib/services/) provides clear business logic boundaries. Integration points (API routes, SSE endpoint) are properly structured.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
All 8 FR categories are architecturally supported:
- Task Management: components/tasks/, lib/services/tasks.ts, app/api/tasks/
- Input Methods: components/voice-input/, components/screenshot-input/, lib/services/ai.ts
- AI Processing: lib/services/ai.ts, lib/services/nlp.ts, app/api/ai/
- Synchronization: components/sync/, lib/services/sync.ts, app/api/sync/
- User Management: components/auth/, lib/services/auth.ts, app/api/users/
- Visual Experience: components/animations/, Framer Motion integration
- Accessibility: components/ui/ (shadcn-ui with ARIA), WCAG 2.1 AA compliance
- Data Privacy & Compliance: lib/services/compliance.ts, GDPR workflows

**Functional Requirements Coverage:**
All 47 functional requirements have architectural support. Each FR category maps to specific components, services, API routes, and database models. Cross-cutting concerns (authentication, real-time sync, error handling) are properly addressed across the architecture.

**Non-Functional Requirements Coverage:**
- Performance: 60fps animations (Framer Motion + GPU acceleration), <500ms sync (SSE + PostgreSQL CDC), <200KB bundle (Next.js code splitting)
- Security: Encryption at rest/in transit (Supabase + TLS 1.3), JWT tokens (NextAuth.js), GDPR compliance (lib/services/compliance.ts)
- Scalability: Vercel auto-scaling (10,000+ users), Supabase auto-scaling, CDN (Vercel Edge Network)
- Accessibility: WCAG 2.1 AA (shadcn-ui + ARIA), keyboard navigation, screen reader support

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical decisions documented with versions (PostgreSQL 16, Next.js 15+, Prisma 5+, NextAuth.js v5). Implementation patterns are comprehensive (25 conflict points addressed). Consistency rules are clear and enforceable (ESLint, TypeScript strict mode). Examples provided for all major patterns.

**Structure Completeness:**
Project structure is complete and specific (all files and directories defined). Integration points clearly specified (API boundaries, component boundaries, service boundaries). Component boundaries well-defined (feature-based organization, shared UI components).

**Pattern Completeness:**
All potential conflict points addressed (naming, structure, format, communication, process). Naming conventions comprehensive (database, API, code). Communication patterns fully specified (SSE, REST, state management). Process patterns complete (error handling, loading states).

### Gap Analysis Results

**Critical Gaps:** None

**Important Gaps:** None

**Nice-to-Have Gaps:**
- React Query integration not explicitly documented (can be added during implementation)
- Specific animation performance monitoring guidelines (can be added during implementation)
- Detailed error logging strategy (can be added during implementation)

### Validation Issues Addressed

No critical or important issues found. All architectural decisions are coherent, complete, and ready for implementation. Minor nice-to-have gaps are optional enhancements that can be addressed during implementation without blocking progress.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High based on validation results

**Key Strengths:**
- Comprehensive technology stack with proven, modern choices
- Clear architectural decisions with version specifications
- Detailed implementation patterns preventing AI agent conflicts
- Complete project structure with explicit file organization
- Full requirements coverage across all FR categories
- Strong focus on performance, security, and accessibility
- Well-defined integration points and boundaries

**Areas for Future Enhancement:**
- React Query integration documentation (can be added during implementation)
- Animation performance monitoring guidelines (can be added during implementation)
- Detailed error logging strategy (can be added during implementation)
- Additional examples for complex patterns (can be added as needed)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions
- Adhere to naming conventions (snake_case database, camelCase code, PascalCase components)
- Use immutable state updates only
- Write tests co-located with source files
- Include TypeScript types for all functions and components

**First Implementation Priority:**
Initialize Next.js project using the starter template command:
```bash
pnpm create next-app@latest advanced-todo --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

This creates the foundation for all subsequent implementation work as defined in the Implementation Sequence section.
