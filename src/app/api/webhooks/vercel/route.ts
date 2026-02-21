import { NextResponse } from 'next/server'
import { apiError, apiSuccess } from '@/lib/api/response'
import { inngest } from '@/inngest/client'
import crypto from 'crypto'
import prisma from '@/lib/db'

export async function POST(req: Request) {
    try {
        const rawBody = await req.text()
        const signature = req.headers.get('x-vercel-signature')

        if (!signature) {
            return apiError('Missing signature', 401)
        }

        let event: Record<string, unknown>
        try {
            event = JSON.parse(rawBody)
        } catch {
            return apiError('Invalid payload', 400)
        }

        // Verify it's a deployment.error or deployment.canceled
        if (event.type === 'deployment.error' || event.type === 'deployment.canceled') {
            type BaseVercelPayload = {
                project?: { id: string };
                deployment?: { id: string };
            };
            const payload = event.payload as BaseVercelPayload;
            const projectId = payload?.project?.id;
            const deploymentId = payload?.deployment?.id;

            if (projectId && deploymentId) {
                // Find who owns this project webhook integration
                const config = await prisma.integrationConfig.findFirst({
                    where: {
                        type: `vercel_project_${projectId}`,
                        enabled: true
                    }
                })

                if (config && config.config && typeof config.config === 'object' && 'secret' in config.config) {
                    const secret = (config.config as any).secret as string

                    // Verify the signature
                    const hmac = crypto.createHmac('sha1', secret)
                    hmac.update(rawBody)
                    const expectedSignature = `sha1=${hmac.digest('hex')}`

                    if (signature !== expectedSignature) {
                        console.error('Invalid Vercel webhook signature')
                        return apiError('Invalid signature', 401)
                    }

                    // Trigger the Inngest function for build failure direct mode
                    await inngest.send({
                        name: 'vercel/build.failed',
                        data: {
                            userId: config.clerkUserId,
                            projectId,
                            deploymentId,
                            payload: event
                        }
                    })
                } else {
                    console.log('No valid integration config found for project ID:', projectId)
                }
            }
        }

        return apiSuccess({ received: true })
    } catch (error) {
        console.error('Vercel Webhook Error:', error)
        return apiError('Webhook processing failed', 500)
    }
}
