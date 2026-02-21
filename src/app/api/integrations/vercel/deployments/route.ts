import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { decrypt } from '@/lib/security/encryption';

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userSettings = await prisma.userSettings.findUnique({
            where: { clerkUserId: userId },
        });

        if (!userSettings?.vercelToken) {
            return NextResponse.json({ error: 'Vercel not connected' }, { status: 400 });
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

        // Merge the local state with Vercel's state
        const mergedDeployments = vercelDeployments.map((vd: any) => {
            const localLog = logs.find((log: any) => {
                const payload = log.payload as any;
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
                errorMessage: localLog?.status === 'failed' ? (localLog.payload as any)?.error : null
            };
        });

        return NextResponse.json({ deployments: mergedDeployments });
    } catch (error) {
        console.error('Error fetching Vercel deployments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch deployments' },
            { status: 500 }
        );
    }
}
