import { NextRequest, NextResponse } from 'next/server'
import {
  JULES_API_KEY,
  JULES_API_URL,
  validateJulesRequest,
} from '@/lib/jules-server'

export async function GET(req: NextRequest) {
  const validationError = await validateJulesRequest()
  if (validationError) return validationError

  if (!JULES_API_KEY) {
    return NextResponse.json(
      { error: 'Jules API Key not configured' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(req.url)
  const pageSize = searchParams.get('pageSize')
  const pageToken = searchParams.get('pageToken')

  const queryParams = new URLSearchParams()
  if (pageSize) queryParams.set('pageSize', pageSize)
  if (pageToken) queryParams.set('pageToken', pageToken)

  try {
    const response = await fetch(
      `${JULES_API_URL}/sessions?${queryParams.toString()}`,
      {
        headers: {
          'x-goog-api-key': JULES_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const validationError = await validateJulesRequest()
  if (validationError) return validationError

  if (!JULES_API_KEY) {
    return NextResponse.json(
      { error: 'Jules API Key not configured' },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()

    // Validate body if needed
    if (!body.prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const response = await fetch(`${JULES_API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': JULES_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: body.prompt }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
