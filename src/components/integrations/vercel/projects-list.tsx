'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface VercelProject {
    id: string
    name: string
    framework?: string
    enabled: boolean
    hasLinkedRepo?: boolean
}

export function VercelProjectsList() {
    const { projects, isLoading, error, isToggling, fetchProjects, toggleProject } = useVercelProjectsStore()

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    if (isLoading) {
        return (
            <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <svg
                            className="h-10 w-10 text-muted-foreground"
                            fill="none"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="24"
                        >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-xl font-semibold">No projects found</h2>
                    <p className="mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
                        You don&apos;t have any Vercel projects, or we couldn&apos;t load them.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <Card key={project.id} className="transition-all hover:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-col space-y-1">
                            <CardTitle className="text-base font-semibold">
                                {project.name}
                            </CardTitle>
                            {project.framework && (
                                <CardDescription className="text-xs">
                                    {project.framework}
                                </CardDescription>
                            )}
                        </div>
                        <Switch
                            checked={project.enabled}
                            disabled={isToggling[project.id]}
                            onCheckedChange={() => toggleProject(project.id, project.enabled, project.hasLinkedRepo)}
                        />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 pt-2">
                            <Badge variant={project.enabled ? 'default' : 'secondary'} className="text-xs">
                                {project.enabled ? 'Protected' : 'Unprotected'}
                            </Badge>
                            {!project.hasLinkedRepo && (
                                <Badge variant="outline" className="text-xs border-destructive text-destructive">
                                    No Repo Linked
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
