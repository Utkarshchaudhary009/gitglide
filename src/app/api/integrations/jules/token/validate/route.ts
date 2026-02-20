import { auth } from '@clerk/nextjs/server'
import { createStreamMessage } from '@/lib/integrations/stream'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response(createStreamMessage('error', { error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/x-ndjson' },
    })
  }

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
    return new Response(createStreamMessage('error', { error: 'API Key is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/x-ndjson' },
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (msg: string) => controller.enqueue(new TextEncoder().encode(msg))

      try {
        send(createStreamMessage('progress', { message: 'Connecting to Jules...' }))

        const response = await fetch('https://julius.googleapis.com/v1alpha/sessions', {
          headers: { 'X-Goog-Api-Key': token },
        })

        if (!response.ok) {
          throw new Error('Invalid API Key')
        }

        const data = await response.json()
        const username = data.username || data.user || data.name || 'there'

        send(createStreamMessage('progress', { message: `Hi ${username}! Verifying your API key...` }))

        send(createStreamMessage('complete', {
          valid: true,
          username,
        }))
        controller.close()

      } catch {
        send(createStreamMessage('error', { error: 'Invalid Jules API Key' }))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  })
}
