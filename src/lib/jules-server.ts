import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from './db'
import { decrypt } from './security/encryption'

export const JULES_API_URL =
  process.env.JULES_API_URL || 'https://jules.googleapis.com/v1alpha'

/**
 * Validates that the request is authenticated and the user has a Jules API Key configured.
 * Use this helper at the start of API routes to ensure consistent security checks.
 *
 * @returns {Promise<{ key: string } | NextResponse>} Returns an error response if validation fails, otherwise the decrypted API key.
 */
export async function validateJulesRequest(): Promise<
  { key: string } | NextResponse
> {
  // 1. Authentication Check
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Fetch User Settings
  const settings = await prisma.userSettings.findUnique({
    where: { clerkUserId: userId },
    select: { julesApiKey: true },
  })

  // 3. Configuration Check
  if (!settings?.julesApiKey) {
    return NextResponse.json(
      {
        error:
          'Jules API Key not configured. Please connect your Jules account in Integrations.',
      },
      { status: 400 }
    )
  }

  // 4. Decrypt API Key
  try {
    const key = decrypt(settings.julesApiKey)
    return { key }
  } catch (error) {
    console.error('Failed to decrypt Jules API Key:', error)
    return NextResponse.json(
      { error: 'Internal Server Error (Encryption)' },
      { status: 500 }
    )
  }
}
