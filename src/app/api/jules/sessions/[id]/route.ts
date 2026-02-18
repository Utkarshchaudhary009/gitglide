
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const JULES_API_URL = process.env.JULES_API_URL || 'https://jules.googleapis.com/v1alpha'
const JULES_API_KEY = process.env.JULES_API_KEY

export async function GET(
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
        const response = await fetch(`${JULES_API_URL}/sessions/${id}`, {
            headers: {
                'x-goog-api-key': JULES_API_KEY,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const error = await response.text()
            return NextResponse.json({ error }, { status: response.status })
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error(`Failed to fetch session ${id}:`, error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(
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
        const response = await fetch(`${JULES_API_URL}/sessions/${id}`, {
            method: 'PATCH',
            headers: {
                'x-goog-api-key': JULES_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const error = await response.text()
            return NextResponse.json({ error }, { status: response.status })
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error(`Failed to update session ${id}:`, error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
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
        const response = await fetch(`${JULES_API_URL}/sessions/${id}`, {
            method: 'DELETE',
            headers: {
                'x-goog-api-key': JULES_API_KEY,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const error = await response.text()
            return NextResponse.json({ error }, { status: response.status })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(`Failed to delete session ${id}:`, error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
