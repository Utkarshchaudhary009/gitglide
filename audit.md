Critical Issues (P0 - Must Fix)

1. Syntax Errors - Unterminated String Literals

Files: src/app/layout.tsx:10, src/app/page.tsx:8-10

// Current (BROKEN):
import { BranchSelector } from "@/components/home/branch-selector
import { ActionSelector } from "@/components/home/action-selector
import { RecentActivity } from "@/components/home/recent-activity"

Problem: Missing closing quotes on import paths.
Fix: Add closing quotes:
import { BranchSelector } from "@/components/home/branch-selector"
import { ActionSelector } from "@/components/home/action-selector"
import { RecentActivity } from "@/components/home/recent-activity"

---

2. Missing File for Protected Route Matcher

File: src/proxy.ts:3

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

Problem: The route matcher points to /dashboard(.\*) but:

- src/app/page.tsx is the home page at /
- There's no /dashboard route defined
- Users accessing root / are not protected

Fix: Either:

1. Move home page to /dashboard/page.tsx, or
2. Update matcher: createRouteMatcher(['/(.*)']) to protect everything except public routes

---

3. Next.js 16+ Middleware File Naming

File: src/proxy.ts

Problem: You're using Next.js 16.1.6, and the file is named proxy.ts. Per Next.js conventions, middleware should be:

- Next.js 14-15: middleware.ts with middleware() export
- Next.js 16+: Should still be middleware.ts or use proxy() export pattern

The proxy.ts naming is non-standard. Verify this works with your Next.js version.

---

High Priority Issues (P1)

4. Broken Import Path - RecentActivity session type

File: src/components/home/recent-activity.tsx:71

function TaskCard({ session }: { session: any }) {

Problem: Using any type defeats TypeScript safety. The mock data has different shape than Session type:

- Mock has repo and updateTime as string
- Real Session type has sourceContext, updateTime as ISO string

Fix: Create a display type or transform real data:
interface DisplaySession {
id: string
title: string
state: SessionState
repo: string
updateTime: string
}

---

5. Hardcoded Fallback User Name

File: src/app/page.tsx:51

  <h1 className="text-3xl font-medium tracking-tight">
      Good Afternoon, {user?.firstName || "Utkarsh"} 👋
  </h1>

Problem: Hardcoded fallback name "Utkarsh" will show for all unauthenticated users.

Fix: Use generic fallback:
{user?.firstName || "there"}

---

6. Silent Error Handling - No User Feedback

File: src/app/page.tsx:28-31

} catch (error) {
console.error(error)
// Should verify if toast is available or just let it fail silently for prototype
}

Problem: Errors are swallowed with just console.error. Users get no feedback when session creation fails.

Fix: Use sonner toast (already installed):
import { toast } from "sonner"
// ...
} catch (error) {
console.error(error)
toast.error("Failed to create session")
}

---

7. useSession vs useAuth Pattern

File: src/app/page.tsx:16, src/components/home/user-nav.tsx:35

const { session } = useSession()
const user = session?.user

Problem: Using useSession when useAuth would be more efficient. useUser/useSession triggers re-renders on profile changes. Per Clerk best practices, prefer useAuth for auth state.

Fix:
// For auth checks only:
const { userId } = useAuth()

// For user profile data:
const { user } = useUser() // Direct access, no session?.user

---

8. IntersectionObserver Memory Leak Risk

File: src/components/layout/sidebar.tsx:88-103

useEffect(() => {
const observer = new IntersectionObserver(...)
if (observerTarget.current) {
observer.observe(observerTarget.current)
}
return () => observer.disconnect()
}, [handleLoadMore])

Problem: If observerTarget.current is null when effect runs, observer is created but never attached. Also, handleLoadMore changing causes observer recreation.

Fix:
useEffect(() => {
const target = observerTarget.current
if (!target) return

      const observer = new IntersectionObserver(...)
      observer.observe(target)
      return () => observer.disconnect()

}, [handleLoadMore])

---

Medium Priority Issues (P2)

9. Hardcoded Branch Data

File: src/components/home/branch-selector.tsx:23-36

const frameworks = [
{ value: "main", label: "main" },
{ value: "develop", label: "develop" },
{ value: "feature/new-ui", label: "feature/new-ui" },
]

Problem: Branches are hardcoded instead of using Source.githubRepo.branches from the store.

Fix: Fetch branches from selected source or use the store.

---

10. Unused Variables After Component Removal

File: src/components/layout/sidebar.tsx:5-15

Several imported icons are unused after navigation items were removed:

- Settings2, SquareTerminal are imported but not used

Fix: Remove unused imports.

---

11. Theme Toggle Without System Option

File: src/components/home/user-nav.tsx:77-78

onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}

Problem: Toggles only between 'dark' and 'light', skipping 'system' option. The root layout sets defaultTheme="system".

Fix:
onClick={() => {
const themes = ['light', 'dark', 'system'] as const
const current = themes.indexOf(theme as typeof themes[number])
setTheme(themes[(current + 1) % themes.length])
}}

---

12. Client Component Metadata Violation

File: src/app/layout.tsx:31-34

export const metadata: Metadata = {
title: 'GitGlide',
description: 'Autonomous AI Coding Agent',
}

Problem: While this file doesn't have 'use client', it imports components that might have client-side concerns. The root layout is correctly a Server Component, but verify metadata isn't being exported from any 'use client' files.

---

13. Missing Error State in UI

File: src/stores/use-sources-store.ts:51-52, src/stores/use-session-store.ts:46

The stores set error state but components don't display errors to users.

Fix: Add error display in consuming components.

---

Low Priority Issues (P3)

14. "use strict" in Transpiled File

File: src/components/home/user-nav.tsx:2

"use strict";

Problem: "use strict" is unnecessary in TypeScript/ES modules. This looks like transpiled output.

Fix: Remove the directive.

---

15. Mock Data Mixed with Real Data

File: src/components/home/recent-activity.tsx:20-24

const displaySessions = sessions.length > 0 ? sessions : [...mock data...]

Problem: Fallback to mock data hides empty state. Users won't know if their data is loading or if there's genuinely no sessions.

Fix: Show proper loading and empty states instead of mock fallback.

---

16. Comment Clutter

Files: src/app/page.tsx:30-31, src/app/page.tsx:72-80

Excessive TODO-style comments left in production code.

Fix: Remove or move to issue tracker.

---

Security Checklist
┌────────────────────┬───────────┬───────────────────────────────────────────────────────────┐
│ Check │ Status │ Notes │
├────────────────────┼───────────┼───────────────────────────────────────────────────────────┤
│ Auth in API routes │ ⚠️ Verify │ No API routes found in glob - need to verify backend auth │
├────────────────────┼───────────┼───────────────────────────────────────────────────────────┤
│ Token validation │ ⚠️ N/A │ No API calls with token validation visible │
├────────────────────┼───────────┼───────────────────────────────────────────────────────────┤
│ Scoped DB queries │ ⚠️ N/A │ No Prisma usage visible in reviewed files │
├────────────────────┼───────────┼───────────────────────────────────────────────────────────┤
│ Clerk middleware │ ✅ OK │ Uses auth.protect() correctly │
├────────────────────┼───────────┼───────────────────────────────────────────────────────────┤
│ Protected routes │ ❌ Issue │ Root route not protected │
└────────────────────┴───────────┴───────────────────────────────────────────────────────────┘

---

Performance Checklist
┌─────────────────────┬──────────┬────────────────────────────────────────────────────┐
│ Check │ Status │ Notes │
├─────────────────────┼──────────┼────────────────────────────────────────────────────┤
│ Parallel async │ ✅ OK │ No waterfalls detected │
├─────────────────────┼──────────┼────────────────────────────────────────────────────┤
│ Suspense boundaries │ ⚠️ Check │ useSearchParams not used, but check dynamic routes │
├─────────────────────┼──────────┼────────────────────────────────────────────────────┤
│ Barrel imports │ ✅ OK │ Direct imports used │
├─────────────────────┼──────────┼────────────────────────────────────────────────────┤
│ Zustand stores │ ✅ OK │ Proper store patterns │
└─────────────────────┴──────────┴────────────────────────────────────────────────────┘
