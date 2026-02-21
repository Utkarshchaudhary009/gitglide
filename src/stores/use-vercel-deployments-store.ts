import { create } from 'zustand'
import { toast } from 'sonner'

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

export const useVercelDeploymentsStore = create<VercelDeploymentsStore>((set, get) => ({
    deployments: [],
    isLoading: true,
    error: null,

    fetchDeployments: async () => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch('/api/integrations/vercel/deployments')
            if (!res.ok) {
                throw new Error('Failed to fetch deployments')
            }
            const data = await res.json()
            set({ deployments: data.deployments || [], isLoading: false })
        } catch (err: any) {
            console.error(err)
            set({
                error: 'Could not load Vercel deployments. Make sure Vercel is connected.',
                isLoading: false,
            })
        }
    },
}))
