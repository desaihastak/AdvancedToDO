## Deferred from: code review of 1-2-user-registration-and-login.md (2026-04-27)

- Add unique session token constraint to prevent edge-case collisions in `advanced-todo/drizzle/schema.ts`; deferred as pre-existing.
- Stabilize dependency on `shadcn/tailwind.css` import path in `advanced-todo/app/globals.css`; deferred due to non-blocking maintainability risk.
