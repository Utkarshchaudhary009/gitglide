import { NextRequest, NextResponse } from 'next/server'
import {
  JULES_API_URL,
  JULES_API_KEY,
  validateJulesRequest,
} from '@/lib/jules-server'
import { z } from 'zod'

// Define input schema for request body
// Strict validation prevents injection and ensures data integrity
const MessageSchema = z.object({
  prompt: z.string().optional(),
  message: z.string().optional(),
}).refine(data => data.prompt || data.message, {
  message: "Either 'prompt' or 'message' is required",
  path: ["prompt"],
}).transform((data) => ({
  prompt: data.prompt || data.message || '',
}))

// Define param validation schema
// Restricts ID format to prevent path traversal or injection
const ParamsSchema = z.object({
  id: z.string().min(1).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid session ID format'),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Authenticate & Configure
  // Centralized check for Auth and API Key presence
  const validationError = await validateJulesRequest()
  if (validationError) return validationError

  // 2. Validate Parameters
  // Next.js params are async in App Router
  const { id } = await params
  const paramResult = ParamsSchema.safeParse({ id })

  if (!paramResult.success) {
    console.error('Invalid Session ID Validation Error:', paramResult.error.format())
    return NextResponse.json(
      { error: 'Invalid Session ID' },
      { status: 400 }
    )
  }

  // 3. Validate Body
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const result = MessageSchema.safeParse(body)

  if (!result.success) {
    console.error('Validation Error for Message:', result.error.format())
    return NextResponse.json(
      { error: 'Validation Error' },
      { status: 400 }
    )
  }

  const { prompt } = result.data

  try {
    // 4. Upstream Request
    // Encode URI component to prevent any remaining injection risks
    const safeId = encodeURIComponent(paramResult.data.id)
    const upstreamUrl = `${JULES_API_URL}/sessions/${safeId}:sendMessage`

    // JULES_API_KEY is guaranteed to be defined here due to validateJulesRequest
    const response = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'x-goog-api-key': JULES_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      // Log the full error for debugging but return a generic message unless it's a known safe error
      console.error('Jules API Error: upstream service returned an error')

      return NextResponse.json(
        { error: 'Failed to process message with upstream service.' },
        { status: response.status }
      )
    }

    const data = await response.json().catch(() => ({}))
    return NextResponse.json(data)

  } catch {
    console.error('Internal Server Error processing message')
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
