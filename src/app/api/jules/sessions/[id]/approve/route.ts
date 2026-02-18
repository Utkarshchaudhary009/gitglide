
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const JULES_API_URL = process.env.JULES_API_URL || 'https://jules.googleapis.com/v1alpha'
const JULES_API_KEY = process.env.JULES_API_KEY

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!JULES_API_KEY) {
        return NextResponse.json({ error: 'Jules API Key not configured' }, { status: 500 })
    }

    const { id } = await params

    try {
        const response = await fetch(`${JULES_API_URL}/sessions/${id}:approvePlan`, {
            method: 'POST',
            headers: {
                'x-goog-api-key': JULES_API_KEY,
                'Content-Type': 'application/json',
            },
            body: '{}', // Empty body as per docs
        })

        if (!response.ok) {
            const error = await response.text()
            return NextResponse.json({ error }, { status: response.status })
        }

        // Returns empty on success
        const data = await response.json().catch(() => ({}))
        return NextResponse.json(data)
    } catch (error) {
        console.error(`Failed to approve plan for session ${id}:`, error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
