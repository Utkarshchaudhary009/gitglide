import { NextRequest, NextResponse } from 'next/server'
import { JULES_API_URL, validateJulesRequest } from '@/lib/jules-server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const validation = await validateJulesRequest()
  if (validation instanceof NextResponse) return validation
  const { key } = validation

  const { id } = await params

  try {
    const response = await fetch(`${JULES_API_URL}/sources/${id}`, {
      headers: {
        'x-goog-api-key': key,
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
    console.error(`Failed to fetch source ${id}:`, error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
