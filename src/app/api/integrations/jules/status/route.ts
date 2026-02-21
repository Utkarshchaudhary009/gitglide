import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { decrypt } from '@/lib/security/encryption'
import { JULES_API_URL } from '@/lib/jules-server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const settings = await prisma.userSettings.findUnique({
      where: { clerkUserId: userId },
    })

    if (!settings?.julesApiKey) {
      return NextResponse.json({
        connected: false,
        provider: 'jules',
      })
    }

    const token = decrypt(settings.julesApiKey)
    // Check sessions as a way to verify token
    const response = await fetch(`${JULES_API_URL}/sessions`, {
      headers: { 'x-goog-api-key': token },
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
      // If unauthorized, clear the token from database
      if (response.status === 401) {
        await prisma.userSettings.update({
          where: { clerkUserId: userId },
          data: { julesApiKey: null },
        })
        console.log('Cleared invalid Jules token')
      }

      return NextResponse.json({
        connected: false,
        provider: 'jules',
      })
    }

    // Jules doesn't have a direct 'user' endpoint that we are using yet,
    // but the session check passed.
    return NextResponse.json({
      connected: true,
      provider: 'jules',
      username: 'User', // Placeholder since we don't have a display name here
      connectedAt: settings.updatedAt,
    })
  } catch (err) {
    console.error('Jules status check failed:', err)
    return NextResponse.json({
      connected: false,
      provider: 'jules',
    })
  }
}
