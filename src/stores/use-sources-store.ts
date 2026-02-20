import { create } from 'zustand'
import { Source } from '@/types/jules'

interface SourcesStore {
  sources: Source[]
  isLoading: boolean
  isFetchingSource: boolean
  error: string | null
  isConfigured: boolean
  hasFetched: boolean

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
  isConfigured: true,
  hasFetched: false,
  nextPageToken: undefined,
  hasMore: true,

  resetSources: () =>
    set({ sources: [], nextPageToken: undefined, hasMore: true, hasFetched: false }),

  fetchSources: async (pageToken?: string) => {
    // Prevent fetching if already loading or no more pages (unless initial load)
    if (get().isLoading) return
    if (pageToken && !get().hasMore) return

    set({ isLoading: true, error: null })
    try {
      const query = new URLSearchParams()
      if (pageToken) query.set('pageToken', pageToken)
      query.set('pageSize', '20')

      const response = await fetch(`/api/jules/sources?${query.toString()}`)
      
      if (response.status === 401) {
        set({ isLoading: false, error: 'Not authenticated', hasFetched: true, isConfigured: true })
        return
      }
      
      if (response.status === 500) {
        const data = await response.json()
        if (data.error?.includes('not configured')) {
          set({ isLoading: false, error: 'Jules not configured', hasFetched: true, isConfigured: false })
          return
        }
        throw new Error(data.error || 'Server error')
      }
      
      if (!response.ok) throw new Error('Failed to fetch sources')
      const data = await response.json()

      const newSources = data.sources || []
      const nextToken = data.nextPageToken

      set((state) => {
        const combined: Source[] = pageToken
          ? [...state.sources, ...newSources]
          : newSources
        const unique: Source[] = Array.from(
          new Map(combined.map((s) => [s.id, s])).values()
        )
        return {
          sources: unique,
          nextPageToken: nextToken,
          hasMore: !!nextToken,
          isLoading: false,
          isConfigured: true,
          hasFetched: true,
        }
      })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false, hasFetched: true })
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

      set((state) => {
        const combined: Source[] = [...state.sources, source]
        const unique: Source[] = Array.from(
          new Map(combined.map((s) => [s.id, s])).values()
        )
        return {
          sources: unique,
          isFetchingSource: false,
        }
      })
      return source
    } catch (error) {
      set({ error: (error as Error).message, isFetchingSource: false })
      return undefined
    }
  },
}))
