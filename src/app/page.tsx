'use client'

import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { ArrowUp } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { BranchSelector } from '@/components/home/branch-selector'
import { ActionSelector } from '@/components/home/action-selector'
import { RecentActivity } from '@/components/home/recent-activity'
import { useState } from 'react'
import { useSessionStore } from '@/stores/use-session-store'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 backdrop-blur-sm shadow-lg shadow-cyan-400/10">
          <Image
            src="/gitglide-logo.png"
            alt="GitGlide"
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {getTimeOfDayGreeting()}, {user?.firstName || 'there'} 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Build, automate, and deploy with your AI coding agent
          </p>
        </div>
      </div>

      {/* Main Input Box */}
      <div className="group relative rounded-2xl border border-border/40 bg-card/40 shadow-lg transition-all focus-within:border-accent focus-within:shadow-xl focus-within:shadow-accent/10">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <Textarea
          placeholder="Describe what you want the AI agent to do..."
          className="placeholder:text-muted-foreground/40 relative min-h-[120px] w-full resize-none border-0 bg-transparent p-6 text-lg focus-visible:ring-0"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="relative flex items-center justify-between px-6 pb-4 border-t border-border/20">
          <div className="flex items-center gap-3">
            <BranchSelector />
            <div className="w-px h-6 bg-border/20" />
            <ActionSelector />
          </div>
          <div>
            <Button
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
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
