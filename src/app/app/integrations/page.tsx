import { IntegrationsList } from './integrations-list'

export default function IntegrationsPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
          <p className="text-muted-foreground">
            Connect your accounts to enable powerful features.
          </p>
        </div>
      </div>
      <IntegrationsList />
    </div>
  )
}
