
import { create } from 'zustand'
import { Source } from '@/types/jules'

interface SourcesStore {
    sources: Source[]
    isLoading: boolean
    error: string | null

    fetchSources: () => Promise<void>
    getSource: (id: string) => Promise<Source | undefined>
}

export const useSourcesStore = create<SourcesStore>((set, get) => ({
    sources: [],
    isLoading: false,
    error: null,

    fetchSources: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await fetch('/api/jules/sources')
            if (!response.ok) throw new Error('Failed to fetch sources')
            const data = await response.json()
            // Usage note: Check if API returns { sources: [...] } or just [...]
            // Docs usually mimic Google API style: { sources: [...] }
            const sources = data.sources || data
            set({ sources, isLoading: false })
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
        }
    },

    getSource: async (id: string) => {
        // Check cache first
        const cached = get().sources.find((s) => s.id === id)
        if (cached) return cached

        set({ isLoading: true, error: null })
        try {
            const response = await fetch(`/api/jules/sources/${id}`)
            if (!response.ok) throw new Error('Failed to fetch source')
            const source = await response.json()

            set((state) => ({
                sources: [...state.sources.filter(s => s.id !== id), source],
                isLoading: false
            }))
            return source
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
            return undefined
        }
    }
}))
