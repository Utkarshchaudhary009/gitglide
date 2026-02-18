'use client'

import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Hexagon, ArrowUp } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { BranchSelector } from '@/components/home/branch-selector'
import { ActionSelector } from '@/components/home/action-selector'
import { RecentActivity } from '@/components/home/recent-activity'
import { useState } from 'react'
import { useSessionStore } from '@/stores/use-session-store'
import { useRouter } from 'next/navigation'

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export default function HomePage() {
  const { user } = useUser()

  const [prompt, setPrompt] = useState('')
  const router = useRouter()
  const { createSession, isLoading } = useSessionStore()

  const handleCreate = async () => {
    if (!prompt.trim() || isLoading) return
    try {
      const session = await createSession(prompt)
      router.push(`/sessions/${session.id}`)
    } catch (error) {
      console.error('Failed to create session', error)
      toast.error('Failed to create session')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCreate()
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 py-12 md:py-20">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-[0_0_40px_-5px_theme(colors.white)]">
          <Hexagon className="h-8 w-8 text-black" fill="black" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-medium tracking-tight">
            {getTimeOfDayGreeting()}, {user?.firstName || 'there'} 👋
          </h1>
          {/* Subheading removed per request */}
        </div>
      </div>

      {/* Main Input Box */}
      <div className="group bg-card/50 focus-within:ring-ring relative rounded-2xl border shadow-sm transition-all focus-within:ring-1">
        <Textarea
          placeholder="Describe what you want the AI agent to do..."
          className="placeholder:text-muted-foreground/50 min-h-[120px] w-full resize-none border-0 bg-transparent p-6 text-lg focus-visible:ring-0"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-2">
            <BranchSelector />
            <ActionSelector />
          </div>
          <div>
            <Button
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full"
              onClick={handleCreate}
              disabled={isLoading}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
