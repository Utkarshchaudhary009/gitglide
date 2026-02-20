import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function DELETE() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Only update if record exists to avoid errors, or catch the error
    // Using updateMany is safer if we don't know if the record exists for sure, but upsert in connect ensures it.
    // However, user might not have connected yet.
    await prisma.userSettings.updateMany({
      where: { clerkUserId: userId },
      data: { vercelToken: null },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Vercel disconnect failed:', error)
    return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
  }
}
