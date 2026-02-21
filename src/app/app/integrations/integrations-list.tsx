'use client'

import { useEffect, useState, useCallback } from 'react'
import { ConnectionCard } from '@/components/integrations/connection-card'
import type { IntegrationProvider, ConnectionInfo } from '@/lib/integrations/types'
import { availableProviders } from '@/lib/integrations/metadata'

export function IntegrationsList() {
  const [connections, setConnections] = useState<Record<string, ConnectionInfo | null>>({})

  const fetchStatus = useCallback(async (provider: IntegrationProvider) => {
    try {
      const res = await fetch(`/api/integrations/${provider}/status`)
      if (res.ok) {
        const data = await res.json()
        setConnections((prev) => ({ ...prev, [provider]: data }))
      }
    } catch (error) {
      console.error('Failed to fetch status for provider:', provider, error)
    }
  }, [])

  useEffect(() => {
    availableProviders.forEach((p) => fetchStatus(p.id))
  }, [fetchStatus])

  const handleDisconnect = async (provider: IntegrationProvider) => {
    try {
      await fetch(`/api/integrations/${provider}/disconnect`, { method: 'DELETE' })
      fetchStatus(provider)
    } catch (error) {
      console.error('Failed to disconnect provider:', provider, error)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {availableProviders.map((provider) => {
        const info = connections[provider.id]
        return (
          <ConnectionCard
            key={provider.id}
            provider={provider.id}
            name={provider.name}
            connected={!!info?.connected}
            username={info?.username}
            onDisconnect={() => handleDisconnect(provider.id)}
            onReconnect={() => fetchStatus(provider.id)}
          />
        )
      })}
    </div>
  )
}
