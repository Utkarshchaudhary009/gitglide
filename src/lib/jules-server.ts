import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const JULES_API_URL =
  process.env.JULES_API_URL || 'https://jules.googleapis.com/v1alpha'
export const JULES_API_KEY = process.env.JULES_API_KEY

export async function validateJulesRequest() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!JULES_API_KEY) {
    return NextResponse.json(
      { error: 'Jules API Key not configured' },
      { status: 500 }
    )
  }

  return null
}
