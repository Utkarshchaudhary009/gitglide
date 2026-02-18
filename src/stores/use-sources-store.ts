import { create } from 'zustand'
import { Source } from '@/types/jules'

interface SourcesStore {
  sources: Source[]
  isLoading: boolean
  isFetchingSource: boolean
  error: string | null

  nextPageToken: string | undefined
  hasMore: boolean

  fetchSources: (pageToken?: string) => Promise<void>
  getSource: (id: string) => Promise<Source | undefined>
  resetSources: () => void
}

export const useSourcesStore = create<SourcesStore>((set, get) => ({
  sources: [],
  isLoading: false,
  isFetchingSource: false,
  error: null,
  nextPageToken: undefined,
  hasMore: true,

  resetSources: () =>
    set({ sources: [], nextPageToken: undefined, hasMore: true }),

  fetchSources: async (pageToken?: string) => {
    // Prevent fetching if already loading or no more pages (unless initial load)
    if (get().isLoading) return
    if (pageToken && !get().hasMore) return

    set({ isLoading: true, error: null })
    try {
      const query = new URLSearchParams()
      if (pageToken) query.set('pageToken', pageToken)
      query.set('pageSize', '20') // Load 20 at a time

      const response = await fetch(`/api/jules/sources?${query.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch sources')
      const data = await response.json()

      const newSources = data.sources || []
      const nextToken = data.nextPageToken

      set((state) => {
        const combined = pageToken
          ? [...state.sources, ...newSources]
          : newSources
        // Deduplicate by ID
        const unique = Array.from(
          new Map(combined.map((s: Source) => [s.id, s])).values()
        )
        return {
          sources: unique,
          nextPageToken: nextToken,
          hasMore: !!nextToken,
          isLoading: false,
        }
      })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  getSource: async (id: string) => {
    // Check cache first
    const cached = get().sources.find((s) => s.id === id)
    if (cached) return cached

    set({ isFetchingSource: true, error: null })
    try {
      const response = await fetch(`/api/jules/sources/${id}`)
      if (!response.ok) throw new Error('Failed to fetch source')
      const source = await response.json()

      set((state) => ({
        sources: Array.from(
          new Map(
            [...state.sources, source].map((s: Source) => [s.id, s])
          ).values()
        ),
        isFetchingSource: false,
      }))
      return source
    } catch (error) {
      set({ error: (error as Error).message, isFetchingSource: false })
      return undefined
    }
  },
}))
