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
  connectedAt?: Date | null
}
