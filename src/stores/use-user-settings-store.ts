import { create } from 'zustand'

type Provider = 'jules' | 'vercel'

interface ProviderState {
    isSet: boolean
    masked: string | null
}

interface UserSettingsStore {
    keys: Record<Provider, ProviderState>
    isLoading: boolean
    hasFetched: boolean

    fetchKeys: () => Promise<void>
    saveKey: (provider: Provider, key: string) => Promise<void>
    deleteKey: (provider: Provider) => Promise<void>
}

const DEFAULT_PROVIDER_STATE: ProviderState = { isSet: false, masked: null }

export const useUserSettingsStore = create<UserSettingsStore>((set) => ({
    keys: {
        jules: { ...DEFAULT_PROVIDER_STATE },
        vercel: { ...DEFAULT_PROVIDER_STATE },
    },
    isLoading: false,
    hasFetched: false,

    fetchKeys: async () => {
        set({ isLoading: true })
        try {
            const res = await fetch('/api/user/keys')
            if (!res.ok) throw new Error('Failed to fetch keys')
            const data = await res.json()
            set({ keys: data.providers, hasFetched: true })
        } catch {
            // silently fail — keys default to unset
        } finally {
            set({ isLoading: false })
        }
    },

    saveKey: async (provider, key) => {
        const res = await fetch('/api/user/keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider, key }),
        })
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Failed to save key' }))
            throw new Error(err.error || 'Failed to save key')
        }
        // Refresh state from server so masked value is current
        const refreshRes = await fetch('/api/user/keys')
        if (refreshRes.ok) {
            const data = await refreshRes.json()
            set({ keys: data.providers })
        }
    },

    deleteKey: async (provider) => {
        const res = await fetch(`/api/user/keys?provider=${provider}`, { method: 'DELETE' })
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Failed to delete key' }))
            throw new Error(err.error || 'Failed to delete key')
        }
        set((state) => ({
            keys: {
                ...state.keys,
                [provider]: { isSet: false, masked: null },
            },
        }))
    },
}))
