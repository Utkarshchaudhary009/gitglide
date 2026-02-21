import { auth } from '@clerk/nextjs/server';
import { apiError, apiSuccess } from '@/lib/api/response';
import prisma from '@/lib/db';
import { decrypt } from '@/lib/security/encryption';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return apiError('Unauthorized', 401);
        }

        const userSettings = await prisma.userSettings.findUnique({
            where: { clerkUserId: userId },
        });

        if (!userSettings?.vercelToken) {
            return apiError('Vercel not connected', 400);
        }

        const token = decrypt(userSettings.vercelToken);

        // Fetch deployments from Vercel (limit to 20 for now)
        const response = await fetch('https://api.vercel.com/v6/deployments?limit=20', {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from Vercel');
        }

        const data = await response.json();
        const vercelDeployments = data.deployments || [];

        // Fetch local WebhookLogs to find associated Jules sessions
        const logs = await prisma.webhookLog.findMany({
            where: {
                clerkUserId: userId,
                source: 'vercel',
                event: 'deployment.error',
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        type VercelDeploymentPayload = {
            uid?: string;
            id: string;
            name: string;
            url: string;
            state: 'BUILDING' | 'ERROR' | 'READY' | 'QUEUED' | 'CANCELED';
            target: 'production' | 'preview';
            created: number;
            creator?: { username: string };
            inspectorUrl: string;
            meta: Record<string, string>;
        }

        // Merge the local state with Vercel's state
        const mergedDeployments = vercelDeployments.map((vd: VercelDeploymentPayload) => {
            const localLog = logs.find((log) => {
                const payload = log.payload as { deployment?: { id: string } };
                return payload?.deployment?.id === vd.uid; // Vercel API returns 'uid' for deployment id natively sometimes
            });

            return {
                id: vd.uid || vd.id,
                name: vd.name,
                url: vd.url ? `https://${vd.url}` : null,
                state: vd.state, // 'BUILDING', 'ERROR', 'READY', 'QUEUED', 'CANCELED'
                target: vd.target, // 'production', 'preview'
                createdAt: vd.created,
                creator: vd.creator?.username,
                inspectorUrl: vd.inspectorUrl,
                meta: vd.meta,
                // Local info
                fixStatus: localLog?.status, // processing, success, failed
                julesSessionId: localLog?.julesSessionId,
                errorMessage: localLog?.status === 'failed' ? (localLog.payload as { error?: string })?.error : null
            };
        });

        return apiSuccess({ deployments: mergedDeployments });
    } catch (error: unknown) {
        console.error('Error fetching Vercel deployments:', error);
        return apiError('Failed to fetch deployments', 500);
    }
}
