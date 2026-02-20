import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { encrypt } from '@/lib/security/encryption'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token } = await req.json()
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.vercel.com/v2/user', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid Vercel token' }, { status: 400 })
    }

    const data = await response.json()
    const username = data.user.username

    await prisma.userSettings.upsert({
      where: { clerkUserId: userId },
      update: { vercelToken: encrypt(token) },
      create: {
        clerkUserId: userId,
        vercelToken: encrypt(token),
      },
    })

    return NextResponse.json({ success: true, username })
  } catch (error) {
    console.error('Vercel connect failed:', error)
    return NextResponse.json({ error: 'Failed to connect' }, { status: 500 })
  }
}
