import { NextRequest, NextResponse } from 'next/server'
import { JULES_API_URL, validateJulesRequest } from '@/lib/jules-server'

export async function GET(req: NextRequest) {
  const validation = await validateJulesRequest()
  if (validation instanceof NextResponse) return validation
  const { key } = validation

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
          'x-goog-api-key': key,
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
  const validation = await validateJulesRequest()
  if (validation instanceof NextResponse) return validation
  const { key } = validation

  try {
    const body = await req.json()

    // Validate body if needed
    if (!body.prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const response = await fetch(`${JULES_API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': key,
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
