'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useSessionStore } from '@/stores/use-session-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  Pause,
  AlertCircle,
  CheckCircle2,
  Bot,
  User,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

export default function SessionDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const {
    sessions,
    activities,
    fetchActivities,
    sendMessage,
    refreshSession,
    approvePlan,
    isLoading: storeIsLoading,
    error: storeError,
  } = useSessionStore()
  const [inputValue, setInputValue] = useState('')
  const viewportRef = useRef<HTMLDivElement>(null)

  const session = sessions.find((s) => s.id === id)
  const sessionActivities = activities[id] || []

  const fetchData = useCallback(() => {
    if (id && document.visibilityState === 'visible') {
      refreshSession(id)
      fetchActivities(id)
    }
  }, [id, refreshSession, fetchActivities])

  useEffect(() => {
    if (id) {
      fetchData()
      // Poll for updates every 5 seconds
      const interval = setInterval(fetchData, 5000)

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          fetchData()
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        clearInterval(interval)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [id, fetchData])

  // Scroll to bottom when activities change
  useEffect(() => {
    if (viewportRef.current) {
      const scrollElement = viewportRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [sessionActivities])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    try {
      await sendMessage(id, inputValue)
      setInputValue('')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (storeIsLoading && !session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-20">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Loading session...</p>
      </div>
    )
  }

  if (storeError && !session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-20">
        <AlertCircle className="text-destructive h-8 w-8" />
        <p className="text-destructive font-medium">{storeError}</p>
        <Button onClick={() => refreshSession(id)}>Retry</Button>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-muted-foreground p-20 text-center">
        Session not found.
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.20))] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {session.title || 'Untitled Session'}
          </h2>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Badge variant="outline" className="text-xs">
              {session.state}
            </Badge>
            <span>•</span>
            <span className="font-mono text-xs">{session.id}</span>
            {session.sourceContext?.source && (
              <>
                <span>•</span>
                <span className="max-w-[200px] truncate">
                  {session.sourceContext.source}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session.state === 'AWAITING_PLAN_APPROVAL' && (
            <Button
              onClick={() => approvePlan(id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve Plan
            </Button>
          )}
          {session.state === 'IN_PROGRESS' && (
            <Badge
              variant="secondary"
              className="bg-green-500/10 text-green-500"
            >
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              In Progress
            </Badge>
          )}
        </div>
      </div>

      {/* Chat / Activity Area */}
      <ScrollArea
        className="bg-muted/20 flex-1 rounded-md border p-4"
        ref={viewportRef}
      >
        <div className="flex flex-col gap-6">
          {sessionActivities.length === 0 && (
            <div className="text-muted-foreground py-10 text-center">
              No activity yet. Start by sending a message.
            </div>
          )}
          {sessionActivities.map((activity) => (
            <div
              key={activity.id}
              className={`flex gap-3 ${activity.originator === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className="mt-1">
                {activity.originator === 'agent' ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                ) : activity.originator === 'system' ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-600">
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <User className="text-primary h-4 w-4" />
                  </div>
                )}
              </div>
              <div
                className={`flex max-w-[80%] flex-col gap-1 ${activity.originator === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-semibold">
                    {activity.originator === 'agent'
                      ? 'GitGlide'
                      : activity.originator === 'user'
                        ? 'You'
                        : 'System'}
                  </span>
                  <span className="text-muted-foreground/60 text-[10px]">
                    {new Date(activity.createTime).toLocaleTimeString()}
                  </span>
                </div>
                <div
                  className={`rounded-xl px-4 py-2.5 text-sm ${
                    activity.originator === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-card rounded-tl-none border shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{activity.description}</p>
                </div>
                {activity.planGenerated && (
                  <div className="bg-card mt-2 w-full rounded-md border p-4">
                    <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                      Plan Generated
                    </h4>
                    <pre className="bg-muted overflow-x-auto rounded p-2 font-mono text-[11px] leading-relaxed">
                      {JSON.stringify(activity.planGenerated, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex gap-2 pt-2">
        <Input
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          disabled={
            session.state === 'TERMINATED' || session.state === 'CANCELLED'
          }
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={
            !inputValue.trim() ||
            session.state === 'TERMINATED' ||
            session.state === 'CANCELLED'
          }
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
