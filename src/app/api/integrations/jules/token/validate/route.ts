function createStreamMessage(type: string, data: Record<string, unknown>): string {
  return JSON.stringify({ type, ...data }) + '\n'
}

export async function POST(req: Request) {
  const { token } = await req.json()
  
  if (!token) {
    return new Response(createStreamMessage('error', { error: 'API Key is required' }), {
      headers: { 'Content-Type': 'application/x-ndjson' },
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (msg: string) => controller.enqueue(new TextEncoder().encode(msg))

      try {
        send(createStreamMessage('progress', { message: 'Connecting to Jules...' }))

        const response = await fetch('https://jules.google.com/api/v1/user', {
          headers: { 'X-Goog-Api-Key': token },
        })

        if (!response.ok) {
          throw new Error('Invalid API Key')
        }

        const data = await response.json()
        const username = data.username

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
