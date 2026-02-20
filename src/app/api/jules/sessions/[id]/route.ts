import { NextRequest, NextResponse } from 'next/server'
import { JULES_API_URL, validateJulesRequest } from '@/lib/jules-server'
import { z } from 'zod'

// Define validation schemas
const ParamsSchema = z.object({
  id: z.string().min(1).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid session ID format'),
})

// Schema for PATCH body
// Ensures the body is a valid object before forwarding
const PatchBodySchema = z.record(z.string(), z.unknown())

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const validation = await validateJulesRequest()
  if (validation instanceof NextResponse) return validation
  const { key } = validation

  const { id } = await params
  const paramResult = ParamsSchema.safeParse({ id })

  if (!paramResult.success) {
    return NextResponse.json(
      { error: 'Invalid Session ID', details: paramResult.error.format() },
      { status: 400 }
    )
  }

  try {
    const safeId = encodeURIComponent(paramResult.data.id)
    const response = await fetch(`${JULES_API_URL}/sessions/${safeId}`, {
      headers: {
        'x-goog-api-key': key,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Jules API GET request failed')
      return NextResponse.json(
        { error: 'Failed to fetch session' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    console.error('Jules session GET handler failed')
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
  const validation = await validateJulesRequest()
  if (validation instanceof NextResponse) return validation
  const { key } = validation

  const { id } = await params
  const paramResult = ParamsSchema.safeParse({ id })

  if (!paramResult.success) {
    return NextResponse.json(
      { error: 'Invalid Session ID', details: paramResult.error.format() },
      { status: 400 }
    )
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Validate body is an object
  const bodyResult = PatchBodySchema.safeParse(body)
  if (!bodyResult.success) {
    return NextResponse.json(
      { error: 'Body must be a JSON object' },
      { status: 400 }
    )
  }

  try {
    const safeId = encodeURIComponent(paramResult.data.id)
    const response = await fetch(`${JULES_API_URL}/sessions/${safeId}`, {
      method: 'PATCH',
      headers: {
        'x-goog-api-key': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyResult.data),
    })

    if (!response.ok) {
      console.error('Jules API PATCH request failed')
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    console.error('Jules session PATCH handler failed')
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
  const validation = await validateJulesRequest()
  if (validation instanceof NextResponse) return validation
  const { key } = validation

  const { id } = await params
  const paramResult = ParamsSchema.safeParse({ id })

  if (!paramResult.success) {
    return NextResponse.json(
      { error: 'Invalid Session ID', details: paramResult.error.format() },
      { status: 400 }
    )
  }

  try {
    const safeId = encodeURIComponent(paramResult.data.id)
    const response = await fetch(`${JULES_API_URL}/sessions/${safeId}`, {
      method: 'DELETE',
      headers: {
        'x-goog-api-key': key,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Jules API DELETE request failed')
      return NextResponse.json(
        { error: 'Failed to delete session' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    console.error('Jules session DELETE handler failed')
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
