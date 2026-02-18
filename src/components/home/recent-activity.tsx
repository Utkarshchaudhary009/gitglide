'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSessionStore } from '@/stores/use-session-store'
import { useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock, PlayCircle, PauseCircle, CheckCircle2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Session } from '@/types/jules'

interface DisplaySession {
  id: string
  title: string
  state: string
  repo: string
  updateTime: string
}

export function RecentActivity() {
  const { sessions, fetchSessions, isLoading, error } = useSessionStore()

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const mapSessionToDisplay = (session: Session): DisplaySession => {
    // Extract repo name if possible, or use source string
    // Assuming source is like "projects/.../locations/.../sources/my-repo"
    const sourceName =
      session.sourceContext?.source?.split('/').pop() || 'Unknown Repo'

    return {
      id: session.id,
      title: session.title || session.prompt || 'Untitled Session',
      state: session.state,
      repo: sourceName,
      updateTime: session.updateTime
        ? formatDistanceToNow(new Date(session.updateTime), { addSuffix: true })
        : 'Just now',
    }
  }

  const displaySessions = sessions.map(mapSessionToDisplay)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Tabs defaultValue="tasks" className="w-[400px]">
            <TabsList className="gap-2 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-muted h-8 rounded-full px-4 data-[state=active]:shadow-none"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="data-[state=active]:bg-muted flex h-8 gap-2 rounded-full px-4 data-[state=active]:shadow-none"
              >
                Tasks
                <Badge
                  variant="secondary"
                  className="h-5 min-w-5 rounded-full px-1.5 text-[10px]"
                >
                  {sessions.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className="data-[state=active]:bg-muted flex h-8 gap-2 rounded-full px-4 data-[state=active]:shadow-none"
              >
                <Clock className="h-3 w-3" />
                Scheduled
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="w-[300px]">
          <Input
            placeholder="Search by title or repo name..."
            className="bg-muted/50 h-9 rounded-full border-0"
          />
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-muted-foreground py-8 text-center">
            Loading activity...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : displaySessions.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            No recent activity
          </div>
        ) : (
          <>
            {/* Grouping logic could be added here, simplified for now */}
            <div>
              <h3 className="text-muted-foreground mb-4 text-sm font-medium">
                Recent
              </h3>
              <div className="space-y-2">
                {displaySessions.map((session) => (
                  <TaskCard key={session.id} session={session} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function TaskCard({ session }: { session: DisplaySession }) {
  const isRunning =
    session.state === 'IN_PROGRESS' || session.state === 'RUNNING'
  return (
    <div className="group border-border/40 bg-card/40 hover:bg-card/60 hover:border-border/80 flex items-center justify-between rounded-xl border p-4 transition-all">
      <div className="flex items-center gap-4">
        <div
          className={`h-2 w-2 rounded-full ${isRunning ? 'animate-pulse bg-green-500' : 'bg-yellow-500'}`}
        />
        <div>
          <h4 className="text-sm font-medium">{session.title}</h4>
          <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
            <span>{session.repo}</span>
            <span>•</span>
            <span>{session.updateTime}</span>
          </div>
        </div>
      </div>
      <div>
        <Badge
          variant={isRunning ? 'default' : 'secondary'}
          className={`${isRunning ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-yellow-500/10 text-yellow-500'}`}
        >
          {session.state}
        </Badge>
      </div>
    </div>
  )
}
