'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useSessionStore } from '@/stores/use-session-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  Play,
  Pause,
  Square,
  AlertCircle,
  CheckCircle2,
  Bot,
  User,
} from 'lucide-react'

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
  } = useSessionStore()
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Find session from store (or fetch if not present - assuming store handles this or we adding a getSession call)
  // For now assuming fetchSessions was called in layout or dashboard, but we should probably fetch specific session
  const session = sessions.find((s) => s.id === id)
  const sessionActivities = activities[id] || []

  useEffect(() => {
    if (id) {
      refreshSession(id)
      fetchActivities(id)
      // Poll for updates every 5 seconds
      const interval = setInterval(() => {
        refreshSession(id)
        fetchActivities(id)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [id, refreshSession, fetchActivities])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [sessionActivities])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    await sendMessage(id, inputValue)
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!session) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        Loading session...
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
            <span>{session.id}</span>
            {session.sourceContext?.source && (
              <>
                <span>•</span>
                <span>{session.sourceContext.source}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Actions based on state */}
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
            <Button variant="outline" size="sm">
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
        </div>
      </div>

      {/* Chat / Activity Area */}
      <ScrollArea
        className="bg-muted/20 flex-1 rounded-md border p-4"
        ref={scrollRef}
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
              <Avatar className="mt-1 h-8 w-8">
                {activity.originator === 'agent' ? (
                  <div className="flex h-full w-full items-center justify-center bg-blue-600">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                ) : activity.originator === 'system' ? ( // System messages
                  <div className="flex h-full w-full items-center justify-center bg-zinc-600">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                )}
              </Avatar>
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
                  {/* Ideally markdown renderer here */}
                  <p className="whitespace-pre-wrap">{activity.description}</p>
                </div>
                {activity.planGenerated && (
                  <div className="bg-card mt-2 w-full rounded-md border p-4">
                    <h4 className="mb-2 font-semibold">Plan Generated</h4>
                    <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">
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
        />
        <Button size="icon" onClick={handleSendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
