export type IntegrationProvider = 'vercel' | 'jules'

export interface ProviderMetadata {
  id: IntegrationProvider
  name: string
  description: string
  tokenCreateUrl: string
  tokenNote: string
}

export interface ConnectionInfo {
  connected: boolean
  provider: IntegrationProvider
  username?: string | null
  connectedAt?: string | null
}

export interface Team {
  id: string
  name: string
  slug: string
}

export interface StreamMessage {
  type: 'progress' | 'complete' | 'error'
  message?: string
  error?: string
  valid?: boolean
  username?: string
  teams?: Team[]
}
