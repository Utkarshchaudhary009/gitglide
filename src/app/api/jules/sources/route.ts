
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const JULES_API_URL = process.env.JULES_API_URL || 'https://jules.googleapis.com/v1alpha'
const JULES_API_KEY = process.env.JULES_API_KEY

export async function GET(req: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!JULES_API_KEY) {
        return NextResponse.json({ error: 'Jules API Key not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(req.url)
    const pageSize = searchParams.get('pageSize')
    const pageToken = searchParams.get('pageToken')

    const queryParams = new URLSearchParams()
    if (pageSize) queryParams.set('pageSize', pageSize)
    if (pageToken) queryParams.set('pageToken', pageToken)

    try {
        const response = await fetch(`${JULES_API_URL}/sources?${queryParams.toString()}`, {
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
        console.error('Failed to fetch sources:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
