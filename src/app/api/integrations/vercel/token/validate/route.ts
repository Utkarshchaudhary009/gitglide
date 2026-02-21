import { createStreamMessage } from '@/lib/integrations/stream'

interface VercelTeam {
  id: string
  name: string
  slug: string
}

export async function POST(req: Request) {
  let token: string;
  try {
    const body = await req.json()
    token = body.token
  } catch {
    return new Response(createStreamMessage('error', { error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/x-ndjson' },
    })
  }

  if (!token) {
    return new Response(createStreamMessage('error', { error: 'Token is required' }), {
      status: 400,
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

        let teams: VercelTeam[] = []
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json()
          teams = (teamsData.teams || []) as VercelTeam[]
        }

        send(createStreamMessage('complete', {
          valid: true,
          username,
          teams: teams.map((t) => ({ id: t.id, name: t.name, slug: t.slug })),
        }))
        controller.close()

      } catch {
        send(createStreamMessage('error', { error: 'Invalid Vercel token' }))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}
