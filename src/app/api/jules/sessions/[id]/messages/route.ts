
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
        const body = await req.json()
        // The docs say: POST /v1alpha/sessions/{sessionId}:sendMessage
        // Body: { prompt: "message" }

        if (!body.prompt && !body.message) {
            return NextResponse.json({ error: 'Prompt/Message is required' }, { status: 400 })
        }

        // Map 'message' to 'prompt' if needed, or pass through
        const payload = {
            prompt: body.prompt || body.message
        }

        const response = await fetch(`${JULES_API_URL}/sessions/${id}:sendMessage`, {
            method: 'POST',
            headers: {
                'x-goog-api-key': JULES_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const error = await response.text()
            return NextResponse.json({ error }, { status: response.status })
        }

        // Returns empty on success usually
        const data = await response.json().catch(() => ({}))
        return NextResponse.json(data)
    } catch (error) {
        console.error(`Failed to send message to session ${id}:`, error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
