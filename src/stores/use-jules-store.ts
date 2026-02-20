import { create } from 'zustand'

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
      const response = await fetch('/api/jules/sources?pageSize=1')
      if (response.ok) {
        set({ isConnected: true, isChecking: false })
      } else if (response.status === 401) {
        set({ isConnected: false, isChecking: false, error: 'Not authenticated' })
      } else if (response.status === 500) {
        const data = await response.json()
        if (data.error?.includes('not configured')) {
          set({ isConnected: false, isChecking: false, error: 'Jules API not configured' })
        } else {
          set({ isConnected: false, isChecking: false, error: data.error })
        }
      } else {
        set({ isConnected: false, isChecking: false })
      }
    } catch {
      set({ isConnected: false, isChecking: false, error: 'Failed to check Jules connection' })
    }
  },

  setConnected: (connected) => set({ isConnected: connected }),
}))
