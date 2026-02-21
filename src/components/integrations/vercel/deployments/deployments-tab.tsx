import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { useVercelDeploymentsStore, type Deployment } from '@/stores/use-vercel-deployments-store'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

const STATUS_CONFIG: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }
> = {
    BUILDING: { label: 'Building', variant: 'secondary', icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    ERROR: { label: 'Failed', variant: 'destructive', icon: <AlertCircle className="h-3 w-3" /> },
    READY: { label: 'Ready', variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
    QUEUED: { label: 'Queued', variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
    CANCELED: { label: 'Canceled', variant: 'outline', icon: <AlertCircle className="h-3 w-3" /> },
}

export function DeploymentsTab() {
    const { deployments, isLoading, error, fetchDeployments } = useVercelDeploymentsStore()

    useEffect(() => {
        fetchDeployments()
    }, [fetchDeployments])

    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center h-48">
                <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">Failed to load Deployments</p>
            </div>
        )
    }

    if (deployments.length === 0) {
        return (
            <Card>
                <CardContent className="py-8 sm:py-12 text-center text-sm sm:text-base text-muted-foreground">
                    No deployments found. Make sure you have connected a Vercel project with active deployments.
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in-50">
            <Card>
                <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">Recent Deployments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                        {deployments.map((deployment) => {
                            const statusConfig = STATUS_CONFIG[deployment.state] || { label: deployment.state, variant: 'outline', icon: null }
                            const repoFullName = deployment.meta?.githubCommitRepo ? `${deployment.meta.githubCommitOrg}/${deployment.meta.githubCommitRepo}` : 'Vercel Project'

                            return (
                                <div
                                    key={deployment.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b pb-3 sm:pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <a href={deployment.inspectorUrl} target="_blank" rel="noreferrer" className="font-medium text-sm sm:text-base truncate hover:underline text-primary">
                                                {deployment.name}
                                            </a>
                                            <Badge variant={statusConfig.variant} className="gap-1 text-xs">
                                                {statusConfig.icon}
                                                {statusConfig.label}
                                            </Badge>
                                            {deployment.target === 'production' && (
                                                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                                    Production
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground truncate">
                                            <span className="font-medium text-foreground">{repoFullName}</span>
                                            <span>•</span>
                                            <span>{formatDistanceToNow(deployment.createdAt, { addSuffix: true })}</span>
                                            <span>•</span>
                                            <span>by {deployment.creator || 'Vercel'}</span>
                                        </div>

                                        {deployment.state === 'ERROR' && deployment.fixStatus && (
                                            <div className="mt-2 text-xs sm:text-sm p-2 rounded-md bg-muted border">
                                                {deployment.fixStatus === 'success' ? (
                                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                        🤖 Auto-fix successful! Check GitHub PR via Jules Session.
                                                    </div>
                                                ) : deployment.fixStatus === 'processing' ? (
                                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                                        🤖 Jules is currently analyzing and fixing this error...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                        ⚠️ Auto-fix failed. {deployment.errorMessage}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <a
                                            href={deployment.inspectorUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs sm:text-sm flex items-center gap-1 hover:underline text-muted-foreground"
                                        >
                                            View Logs <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
