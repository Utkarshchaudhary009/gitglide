
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSessionStore } from "@/stores/use-session-store"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, PlayCircle, PauseCircle, CheckCircle2 } from "lucide-react"

export function RecentActivity() {
    const { sessions, fetchSessions } = useSessionStore()

    useEffect(() => {
        fetchSessions()
    }, [fetchSessions])

    // Mock data for now if sessions are empty or generic
    const displaySessions = sessions.length > 0 ? sessions : [
        { id: '1', title: "Add a 'Contact Us' link to the footer", state: 'IN_PROGRESS', updateTime: '6 hours ago', repo: 'Utkarshchaudhary009/cloud-platform' },
        { id: '2', title: "Refactor API authentication middleware", state: 'PAUSED', updateTime: '2 days ago', repo: 'Utkarshchaudhary009/backend-service' },
        { id: '3', title: "Update landing page hero image", state: 'COMPLETED', updateTime: '1 week ago', repo: 'Utkarshchaudhary009/landing-page' },
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Tabs defaultValue="tasks" className="w-[400px]">
                        <TabsList className="bg-transparent p-0 gap-2">
                            <TabsTrigger value="all" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-full px-4 h-8">All</TabsTrigger>
                            <TabsTrigger value="tasks" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-full px-4 h-8 flex gap-2">
                                Tasks
                                <Badge variant="secondary" className="h-5 px-1.5 rounded-full text-[10px] min-w-5">1</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="scheduled" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-full px-4 h-8 flex gap-2">
                                <Clock className="h-3 w-3" />
                                Scheduled
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <div className="w-[300px]">
                    <Input placeholder="Search by title or repo name..." className="h-9 rounded-full bg-muted/50 border-0" />
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Today</h3>
                    <div className="space-y-2">
                        {displaySessions.slice(0, 1).map(session => (
                            <TaskCard key={session.id} session={session} />
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">This Month</h3>
                    <div className="space-y-2">
                        {displaySessions.slice(1).map(session => (
                            <TaskCard key={session.id} session={session} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function TaskCard({ session }: { session: any }) {
    const isRunning = session.state === 'IN_PROGRESS' || session.state === 'RUNNING'
    return (
        <div className="group flex items-center justify-between rounded-xl border border-border/40 bg-card/40 p-4 hover:bg-card/60 hover:border-border/80 transition-all">
            <div className="flex items-center gap-4">
                <div className={`h-2 w-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                <div>
                    <h4 className="font-medium text-sm">{session.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{session.repo}</span>
                        <span>•</span>
                        <span>{session.updateTime}</span>
                    </div>
                </div>
            </div>
            <div>
                <Badge variant={isRunning ? "default" : "secondary"} className={`${isRunning ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'text-yellow-500 bg-yellow-500/10'}`}>
                    {session.state}
                </Badge>
            </div>
        </div>
    )
}
