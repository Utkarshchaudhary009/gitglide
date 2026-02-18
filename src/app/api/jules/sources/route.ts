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

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

  try {
    const response = await fetch(
      `${JULES_API_URL}/sources?${queryParams.toString()}`,
      {
        headers: {
          'x-goog-api-key': JULES_API_KEY,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    )
    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: unknown) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Upstream request timed out' },
        { status: 504 }
      )
    }
    console.error('Failed to fetch sources:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
