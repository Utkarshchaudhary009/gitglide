import { NextRequest, NextResponse } from 'next/server'
import { JULES_API_URL, validateJulesRequest } from '@/lib/jules-server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const validation = await validateJulesRequest()
  if (validation instanceof NextResponse) return validation
  const { key } = validation

  const { id } = await params

  try {
    const response = await fetch(`${JULES_API_URL}/sessions/${id}:approvePlan`, {
      method: 'POST',
      headers: {
        'x-goog-api-key': key,
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
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
