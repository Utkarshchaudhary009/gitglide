import { NextRequest, NextResponse } from 'next/server'
import {
  JULES_API_KEY,
  JULES_API_URL,
  validateJulesRequest,
} from '@/lib/jules-server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const validationError = await validateJulesRequest()
  if (validationError) return validationError

  if (!JULES_API_KEY) {
    // This is just to satisfy TypeScript as JULES_API_KEY is checked in validateJulesRequest
    return NextResponse.json(
      { error: 'Jules API Key not configured' },
      { status: 500 }
    )
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
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const validationError = await validateJulesRequest()
  if (validationError) return validationError

  if (!JULES_API_KEY) {
    return NextResponse.json(
      { error: 'Jules API Key not configured' },
      { status: 500 }
    )
  }

  const { id } = await params

  try {
    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
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
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const validationError = await validateJulesRequest()
  if (validationError) return validationError

  if (!JULES_API_KEY) {
    return NextResponse.json(
      { error: 'Jules API Key not configured' },
      { status: 500 }
    )
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
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
