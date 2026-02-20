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

    if (!settings?.vercelToken) {
      return NextResponse.json({
        connected: false,
        provider: 'vercel',
      })
    }

    const token = decrypt(settings.vercelToken)
    const response = await fetch('https://api.vercel.com/v2/user', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      // Token invalid or expired
      return NextResponse.json({
        connected: false,
        provider: 'vercel',
      })
    }

    const data = await response.json()
    return NextResponse.json({
      connected: true,
      provider: 'vercel',
      username: data.user.username,
      connectedAt: settings.updatedAt, // Using last update time as proxy
    })
  } catch (error) {
    console.error('Vercel status check failed:', error)
    return NextResponse.json({
      connected: false,
      provider: 'vercel',
    })
  }
}
