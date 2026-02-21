import { auth } from '@clerk/nextjs/server'
import { apiError, apiSuccess } from '@/lib/api/response'
import prisma from '@/lib/db'
import { decrypt } from '@/lib/security/encryption'

export async function GET() {
    const { userId } = await auth()
    if (!userId) {
        return apiError('Unauthorized', 401)
    }

    try {
        const settings = await prisma.userSettings.findUnique({
            where: { clerkUserId: userId },
        })

        if (!settings?.vercelToken) {
            return apiError('Vercel not connected', 400)
        }

        const token = decrypt(settings.vercelToken)

        // Fetch projects from Vercel
        const response = await fetch('https://api.vercel.com/v9/projects', {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(10_000),
        })

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Token might be invalid
                return apiError('Vercel token invalid or expired', 401)
            }
            return apiError('Failed to fetch Vercel projects', response.status)
        }

        const data = await response.json()
        const projects = data.projects || []

        // Fetch integration configs for these projects
        const integrationConfigs = await prisma.integrationConfig.findMany({
            where: {
                clerkUserId: userId,
                type: {
                    startsWith: 'vercel_project_',
                },
            },
        })

        const enabledConfigMap = new Map(
            integrationConfigs.map(config => [config.type.replace('vercel_project_', ''), config.enabled])
        )

        type VercelProjectAPIResponse = {
            id: string;
            name: string;
            framework: string | null;
            link?: { repoUrl: string };
        }

        // Map projects to include their integration status
        const projectsWithStatus = projects.map((p: VercelProjectAPIResponse) => ({
            id: p.id,
            name: p.name,
            framework: p.framework,
            enabled: enabledConfigMap.get(p.id) || false,
            hasLinkedRepo: !!p.link?.repoUrl
        }))

        return apiSuccess({ projects: projectsWithStatus })
    } catch (error) {
        console.error('Failed to get Vercel projects:', error)
        return apiError('Internal Server Error', 500)
    }
}
