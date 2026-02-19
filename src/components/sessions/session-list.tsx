'use client'

import * as React from 'react'
import Link from 'next/link'
import { formatDistanceToNow, format, isToday, isThisWeek } from 'date-fns'
import {
  GitBranch,
  GitMerge,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
  AlertCircle,
  MessageSquare,
} from 'lucide-react'
import { useSessionStore } from '@/stores/use-session-store'
import { Session, SessionState } from '@/types/jules'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const stateConfig: Record<
  SessionState,
  { label: string; icon: React.ElementType; className: string }
> = {
  STATE_UNSPECIFIED: {
    label: 'Unknown',
    icon: AlertCircle,
    className: 'bg-muted text-muted-foreground',
  },
  QUEUED: {
    label: 'Queued',
    icon: Clock,
    className: 'bg-yellow-500/10 text-yellow-500',
  },
  PLANNING: {
    label: 'Planning',
    icon: Loader2,
    className: 'bg-blue-500/10 text-blue-500',
  },
  AWAITING_PLAN_APPROVAL: {
    label: 'Awaiting Approval',
    icon: MessageSquare,
    className: 'bg-orange-500/10 text-orange-500',
  },
  AWAITING_USER_FEEDBACK: {
    label: 'Needs Feedback',
    icon: MessageSquare,
    className: 'bg-orange-500/10 text-orange-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    icon: Loader2,
    className: 'bg-blue-500/10 text-blue-500',
  },
  PAUSED: {
    label: 'Paused',
    icon: PauseCircle,
    className: 'bg-muted text-muted-foreground',
  },
  FAILED: {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive',
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'bg-green-500/10 text-green-500',
  },
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffHours < 1) {
    return formatDistanceToNow(date, { addSuffix: true })
  }
  if (isToday(date)) {
    return format(date, 'h:mm a')
  }
  if (isThisWeek(date)) {
    return format(date, 'EEE h:mm a')
  }
  return format(date, 'MMM d')
}

function groupSessionsByDate(sessions: Session[]) {
  const groups: { label: string; sessions: Session[] }[] = []
  const today: Session[] = []
  const thisWeek: Session[] = []
  const older: Session[] = []

  sessions.forEach((session) => {
    const date = new Date(session.createTime)
    if (isToday(date)) {
      today.push(session)
    } else if (isThisWeek(date)) {
      thisWeek.push(session)
    } else {
      older.push(session)
    }
  })

  if (today.length > 0) groups.push({ label: 'TODAY', sessions: today })
  if (thisWeek.length > 0)
    groups.push({ label: 'LAST 7 DAYS', sessions: thisWeek })
  if (older.length > 0) groups.push({ label: 'OLDER', sessions: older })

  return groups
}

function SessionRow({ session }: { session: Session }) {
  const config = stateConfig[session.state] || stateConfig.STATE_UNSPECIFIED
  const StateIcon = config.icon
  const hasPR = session.outputs?.some((o) => o.pullRequest)
  const pr = session.outputs?.find((o) => o.pullRequest)?.pullRequest

  return (
    <Link
      href={`/app/sessions/${session.id}`}
      className="group flex items-start justify-between gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground group-hover:text-primary">
          {session.title || session.prompt}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{formatTimestamp(session.updateTime)}</span>
          <span>·</span>
          <span className="truncate">
            {session.sourceContext.source.replace('sources/', '')}
          </span>
          {session.sourceContext.githubRepoContext?.startingBranch && (
            <>
              <span>·</span>
              <GitBranch className="h-3 w-3" />
              <span className="truncate">
                {session.sourceContext.githubRepoContext.startingBranch}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {hasPR && pr && (
          <Badge
            variant="outline"
            className="gap-1 border-green-500/30 bg-green-500/10 text-green-500"
          >
            <GitMerge className="h-3 w-3" />
            PR
          </Badge>
        )}
        <Badge variant="secondary" className={cn('gap-1', config.className)}>
          <StateIcon
            className={cn(
              'h-3 w-3',
              (session.state === 'PLANNING' || session.state === 'IN_PROGRESS') &&
                'animate-spin'
            )}
          />
          {config.label}
        </Badge>
      </div>
    </Link>
  )
}

function SessionSkeleton() {
  return (
    <div className="flex items-start justify-between gap-4 px-3 py-3">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-20" />
    </div>
  )
}

export function SessionList() {
  const { sessions, isLoading, error, fetchSessions } = useSessionStore()

  React.useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  if (isLoading && sessions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <SessionSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-2xl py-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No sessions yet. Start by describing a task above.
        </p>
      </div>
    )
  }

  const groups = groupSessionsByDate(sessions)

  return (
    <ScrollArea className="mx-auto w-full max-w-2xl">
      <div className="space-y-6 pb-8">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-xs font-medium tracking-wide text-muted-foreground">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.sessions.map((session) => (
                <SessionRow key={session.id} session={session} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
