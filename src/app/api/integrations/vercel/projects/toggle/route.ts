import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { inngest } from '@/inngest/client'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { projectId, enabled } = await req.json()

    if (!projectId || typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Trigger Inngest event
    await inngest.send({
      name: 'vercel/project.toggled',
      data: {
        userId,
        projectId,
        enabled,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to trigger project toggle:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
