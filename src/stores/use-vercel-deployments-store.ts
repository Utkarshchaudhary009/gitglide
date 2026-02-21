import { create } from 'zustand'
import type { ApiResponse } from '@/types/api'

export interface Deployment {
    id: string
    name: string
    url: string | null
    state: 'BUILDING' | 'ERROR' | 'READY' | 'QUEUED' | 'CANCELED'
    target: 'production' | 'preview'
    createdAt: number
    creator: string
    inspectorUrl: string
    meta: Record<string, string>

    // Local fixes
    fixStatus?: 'processing' | 'success' | 'failed'
    julesSessionId?: string
    errorMessage?: string
}

interface VercelDeploymentsStore {
    deployments: Deployment[]
    isLoading: boolean
    error: string | null

    fetchDeployments: () => Promise<void>
}

export const useVercelDeploymentsStore = create<VercelDeploymentsStore>((set) => ({
    deployments: [],
    isLoading: true,
    error: null,

    fetchDeployments: async () => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch('/api/integrations/vercel/deployments')
            const data = await res.json() as ApiResponse<{ deployments: Deployment[] }>

            if (!res.ok || !data.success) {
                const message = !data.success ? data.error.message : 'Failed to fetch deployments'
                throw new Error(message)
            }

            set({ deployments: data.data.deployments || [], isLoading: false })
        } catch (err: unknown) {
            console.error(err)
            set({
                error: 'Could not load Vercel deployments. Make sure Vercel is connected.',
                isLoading: false,
            })
        }
    },
}))
