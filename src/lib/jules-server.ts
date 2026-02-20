import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const JULES_API_URL =
  process.env.JULES_API_URL || 'https://jules.googleapis.com/v1alpha'
export const JULES_API_KEY = process.env.JULES_API_KEY

/**
 * Validates that the request is authenticated and the server is configured correctly.
 * Use this helper at the start of API routes to ensure consistent security checks.
 *
 * @returns {Promise<NextResponse | null>} Returns an error response if validation fails, otherwise null.
 */
export async function validateJulesRequest(): Promise<NextResponse | null> {
  // 1. Authentication Check
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Configuration Check
  // Prevent the application from running with missing credentials
  if (!JULES_API_KEY) {
    // Log the specific error for server admins
    console.error('Critical: JULES_API_KEY is not configured in environment variables.')

    // Return a generic error to the user to avoid leaking infrastructure details
    return NextResponse.json(
      { error: 'Internal Server Configuration Error' },
      { status: 500 }
    )
  }

  return null
}
