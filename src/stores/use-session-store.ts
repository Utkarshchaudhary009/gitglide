import { create } from 'zustand'
import { Session, Activity } from '@/types/jules'

interface SessionStore {
  sessions: Session[]
  activeSessionId: string | null
  isLoading: boolean
  error: string | null
  activities: Record<string, Activity[]> // Cache activities by session ID

  setSessions: (sessions: Session[]) => void
  setActiveSessionId: (id: string | null) => void

  fetchSessions: () => Promise<void>
  createSession: (prompt: string) => Promise<Session>
  getSession: (id: string) => Promise<Session>
  refreshSession: (id: string) => Promise<void>

  fetchActivities: (sessionId: string) => Promise<void>
  sendMessage: (sessionId: string, message: string) => Promise<void>
  approvePlan: (sessionId: string) => Promise<void>

  addSession: (session: Session) => void
  updateSession: (id: string, updates: Partial<Session>) => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessions: [],
  activeSessionId: null,
  isLoading: false,
  error: null,

  setSessions: (sessions) => set({ sessions }),
  setActiveSessionId: (id) => set({ activeSessionId: id }),
  activities: {},

  // Async Actions
  fetchSessions: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/jules/sessions')
      if (!response.ok) throw new Error('Failed to fetch sessions')
      const data = await response.json()
      // Google APIs typically return { sessions: [...] }
      const sessions = Array.isArray(data) ? data : data.sessions || []
      set({ sessions, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  createSession: async (prompt: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/jules/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (!response.ok) throw new Error('Failed to create session')
      const newSession = await response.json()
      set((state) => ({
        sessions: [newSession, ...state.sessions],
        activeSessionId: newSession.id,
        isLoading: false,
      }))
      return newSession
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error // Re-throw for UI handling if needed
    }
  },

  getSession: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/jules/sessions/${id}`)
      if (!response.ok) throw new Error('Failed to fetch session')
      const session = await response.json()

      set((state) => {
        const exists = state.sessions.some((s) => s.id === id)
        return {
          sessions: exists
            ? state.sessions.map((s) => (s.id === id ? session : s))
            : [session, ...state.sessions],
          activeSessionId: id,
          isLoading: false,
        }
      })

      return session
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  refreshSession: async (id: string) => {
    // Background refresh without setting full loading state
    try {
      const response = await fetch(`/api/jules/sessions/${id}`)
      if (!response.ok) return
      const session = await response.json()
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? session : s)),
      }))
    } catch (error) {
      console.error('Failed to refresh session', error)
    }
  },

  fetchActivities: async (sessionId: string) => {
    // Determine if we need to load or it's a refresh
    // For simplicity, we just fetch mostly. Could add `if(state.activities[sessionId]) return` for strict cache.
    // But "refreshed as new data come" implies we want fresh data.
    try {
      const response = await fetch(
        `/api/jules/sessions/${sessionId}/activities`
      )
      if (!response.ok) throw new Error('Failed to fetch activities')
      const activities = await response.json()
      set((state) => ({
        activities: { ...state.activities, [sessionId]: activities },
      }))
    } catch (error) {
      console.error('Failed to fetch activities', error)
    }
  },

  sendMessage: async (sessionId: string, message: string) => {
    // Optimistic update could go here, but for now we just send
    try {
      const response = await fetch(
        `/api/jules/sessions/${sessionId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        }
      )
      if (!response.ok) throw new Error('Failed to send message')

      // Optionally refresh activities immediately
      // get().fetchActivities(sessionId)
      // But usually we rely on the response or a subsequent refresh
    } catch (error) {
      console.error('Failed to send message', error)
      throw error
    }
  },

  approvePlan: async (sessionId: string) => {
    try {
      const response = await fetch(`/api/jules/sessions/${sessionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Failed to approve plan')
    } catch (error) {
      console.error('Failed to approve plan', error)
      throw error
    }
  },

  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),
}))
