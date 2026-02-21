import { IntegrationProvider, ProviderMetadata } from './types'

export const PROVIDERS: Record<IntegrationProvider, ProviderMetadata> = {
  vercel: {
    id: 'vercel',
    name: 'Vercel',
    description: 'Connect your Vercel account to manage deployments.',
    tokenCreateUrl: 'https://vercel.com/account/settings/tokens',
    tokenNote: 'Full Account',
  },
  jules: {
    id: 'jules',
    name: 'Jules',
    description: 'Connect your Jules account for AI-powered development assistance.',
    tokenCreateUrl: 'https://jules.google.com/settings/api',
    tokenNote: 'Read/Write',
  },
}

export const availableProviders: ProviderMetadata[] = Object.values(PROVIDERS)

export function getProviderMetadata(id: IntegrationProvider): ProviderMetadata | undefined {
  return PROVIDERS[id]
}
