import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function DELETE() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.userSettings.updateMany({
      where: { clerkUserId: userId },
      data: { julesApiKey: null },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Jules disconnect failed:', error)
    return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
  }
}
