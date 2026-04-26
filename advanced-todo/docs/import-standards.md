# Import Organization Standards

All TypeScript/TSX files in this project must follow this import organization pattern for consistency and maintainability.

## Pattern

```typescript
// 1. External libraries (React, Next.js, third-party packages)
import { NextResponse } from "next/server"
import { toNextJsHandler } from "better-auth/next-js"

// 2. Internal imports (@/lib, @/components, etc.)
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { isRateLimited as redisIsRateLimited } from "@/lib/rate-limiter"
```

## Rules

1. **Group imports** into two sections:
   - External libraries first
   - Internal imports second

2. **Sort alphabetically** within each group

3. **Blank line** between groups

4. **Keep imports short** - avoid unnecessary nesting

5. **Type imports** should be grouped with their source (external or internal)

## Examples

### Correct
```typescript
import { useEffect, useState } from "react"
import { createAuthClient } from "better-auth/react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
```

### Incorrect
```typescript
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createAuthClient } from "better-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
```

## Files Currently Following This Standard

- `app/api/auth/[...all]/route.ts`
- `app/api/auth/providers/route.ts`
- `app/(auth)/register/page.tsx`
- `app/(auth)/login/page.tsx`
- `middleware.ts`
- `lib/auth.ts`
- `lib/types.ts`
- `app/layout.tsx`
- All UI components (`components/ui/*`)
- All library files (`lib/*`)

## When Adding New Files

Always follow this pattern. When reviewing code, check that imports are organized correctly before merging.
