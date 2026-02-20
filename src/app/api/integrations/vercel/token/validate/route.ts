import { NextResponse } from 'next/server'

function createStreamMessage(type: string, data: Record<string, unknown>): string {
  return JSON.stringify({ type, ...data }) + '\n'
}

export async function POST(req: Request) {
  const { token } = await req.json()
  
  if (!token) {
    return new Response(createStreamMessage('error', { error: 'Token is required' }), {
      headers: { 'Content-Type': 'application/x-ndjson' },
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (msg: string) => controller.enqueue(new TextEncoder().encode(msg))

      try {
        send(createStreamMessage('progress', { message: 'Connecting to Vercel...' }))

        const response = await fetch('https://api.vercel.com/v2/user', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error('Invalid token')
        }

        const data = await response.json()
        const username = data.user.username

        send(createStreamMessage('progress', { message: `Hi ${username}! Verifying your account...` }))

        // Fetch teams for context
        const teamsRes = await fetch('https://api.vercel.com/v2/teams', {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        let teams: any[] = []
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json()
          teams = teamsData.teams || []
        }

        send(createStreamMessage('complete', {
          valid: true,
          username,
          teams: teams.map((t: any) => ({ id: t.id, name: t.name, slug: t.slug })),
        }))
        controller.close()

      } catch (error) {
        send(createStreamMessage('error', { error: 'Invalid Vercel token' }))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}
