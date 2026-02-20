import { create } from 'zustand'
import { useSourcesStore } from './use-sources-store'

interface JulesStore {
  isConnected: boolean
  isChecking: boolean
  error: string | null

  checkConnection: () => Promise<void>
  setConnected: (connected: boolean) => void
}

export const useJulesStore = create<JulesStore>((set) => ({
  isConnected: false,
  isChecking: true,
  error: null,

  checkConnection: async () => {
    set({ isChecking: true, error: null })
    try {
      await useSourcesStore.getState().fetchSources(undefined)
      const { error, isConfigured } = useSourcesStore.getState()

      if (error === 'Not authenticated') {
        set({ isConnected: false, isChecking: false, error: 'Not authenticated' })
      } else if (!isConfigured) {
        set({ isConnected: false, isChecking: false, error: 'Jules API not configured' })
      } else if (error) {
        set({ isConnected: false, isChecking: false, error })
      } else {
        set({ isConnected: true, isChecking: false })
      }
    } catch {
      set({ isConnected: false, isChecking: false, error: 'Failed to check Jules connection' })
    }
  },

  setConnected: (connected) => set({ isConnected: connected }),
}))
