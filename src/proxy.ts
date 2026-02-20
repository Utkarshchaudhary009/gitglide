import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that do not require authentication
// Ensure sensitive routes are NOT included here.
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)', // Webhooks must handle their own signature verification internally
])

export default clerkMiddleware(async (auth, req) => {
  // Fix: Protect all routes that are not explicitly defined as public.
  // This implements a secure-by-default approach.
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // This regex ensures that static assets are not blocked by middleware, improving performance
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes to ensure they are protected by default
    '/(api|trpc)(.*)',
  ],
}
