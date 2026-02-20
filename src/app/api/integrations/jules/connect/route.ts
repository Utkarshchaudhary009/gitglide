import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { encrypt } from '@/lib/security/encryption'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let token: string;
  try {
    const body = await req.json()
    token = body.token
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  try {
    const response = await fetch('https://jules.googleapis.com/v1alpha/sessions', {
      headers: { 'x-goog-api-key': token },
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid Jules API Key' }, { status: 400 })
    }

    const data = await response.json()
    const username = data.username || data.user || data.name || 'there'

    await prisma.userSettings.upsert({
      where: { clerkUserId: userId },
      update: { julesApiKey: encrypt(token) },
      create: {
        clerkUserId: userId,
        julesApiKey: encrypt(token),
      },
    })

    return NextResponse.json({ success: true, username })
  } catch {
    console.error('Jules connect failed')
    return NextResponse.json({ error: 'Failed to connect' }, { status: 500 })
  }
}
