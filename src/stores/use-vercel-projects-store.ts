import { create } from 'zustand'
import { toast } from 'sonner'

export interface VercelProject {
  id: string
  name: string
  framework?: string
  enabled: boolean
  hasLinkedRepo?: boolean
}

interface VercelProjectsStore {
  projects: VercelProject[]
  isLoading: boolean
  isToggling: Record<string, boolean>
  error: string | null

  fetchProjects: () => Promise<void>
  toggleProject: (projectId: string, currentEnabled: boolean, hasLinkedRepo?: boolean) => Promise<void>
}

export const useVercelProjectsStore = create<VercelProjectsStore>((set, get) => ({
  projects: [],
  isLoading: true,
  isToggling: {},
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/integrations/vercel/projects')
      if (!res.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await res.json()
      set({ projects: data.projects || [], isLoading: false })
    } catch (err: any) {
      console.error(err)
      set({
        error: 'Could not load Vercel projects. Make sure Vercel is connected.',
        isLoading: false,
      })
    }
  },

  toggleProject: async (projectId: string, currentEnabled: boolean, hasLinkedRepo?: boolean) => {
    if (!currentEnabled && !hasLinkedRepo) {
      toast.error('Cannot enable auto-fix for projects without a linked GitHub repository.')
      return
    }

    const newEnabled = !currentEnabled
    
    // Optimistic update
    set((state) => ({
      isToggling: { ...state.isToggling, [projectId]: true },
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, enabled: newEnabled } : p
      ),
    }))

    try {
      const res = await fetch('/api/integrations/vercel/projects/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, enabled: newEnabled }),
      })

      if (!res.ok) {
        throw new Error('Failed to toggle project')
      }
      
      toast.success(newEnabled ? 'Auto-fix enabled for project' : 'Auto-fix disabled for project')
    } catch (err) {
      console.error(err)
      toast.error('Failed to change project integration status')
      
      // Revert optimistic update
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, enabled: currentEnabled } : p
        ),
      }))
    } finally {
      // Clear toggling state
      set((state) => ({
        isToggling: { ...state.isToggling, [projectId]: false },
      }))
    }
  },
}))
