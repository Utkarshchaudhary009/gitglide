import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { decrypt } from '@/lib/security/encryption'

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
    const response = await fetch('https://jules.google.com/api/v1/user', {
      headers: { 'X-Goog-Api-Key': token },
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
      await prisma.userSettings.update({
        where: { clerkUserId: userId },
        data: { julesApiKey: null },
      })
      console.log('Cleared invalid Jules token')
      return NextResponse.json({
        connected: false,
        provider: 'jules',
      })
    }

    const data = await response.json()
    return NextResponse.json({
      connected: true,
      provider: 'jules',
      username: data.username,
      connectedAt: settings.updatedAt,
    })
  } catch {
    console.error('Jules status check failed')
    return NextResponse.json({
      connected: false,
      provider: 'jules',
    })
  }
}
