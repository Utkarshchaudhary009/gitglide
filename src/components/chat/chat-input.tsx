'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUp, Zap, ClipboardList, ChevronDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BranchSelector } from '@/components/layout/branch-selector'
import { useSessionStore } from '@/stores/use-session-store'

interface ChatInputProps {
  onSend?: (message: string) => void
  placeholder?: string
  disabled?: boolean
}

type Mode = 'fast' | 'plan'

const modeConfig = {
  fast: { label: 'Fast', icon: Zap, description: 'Quick responses' },
  plan: {
    label: 'Plan',
    icon: ClipboardList,
    description: 'Detailed planning',
  },
}

export function ChatInput({
  onSend,
  placeholder = 'Describe what you want the AI agent to do...',
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = React.useState('')
  const [mode, setMode] = React.useState<Mode>('fast')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const { createSession, isLoading } = useSessionStore()

  const handleSubmit = async () => {
    if (message.trim()) {
      if (onSend) {
        onSend(message)
        setMessage('')
      } else {
        try {
          const session = await createSession(message)
          setMessage('')
          router.push(`/app/sessions/${session.id}`)
        } catch {
          console.error('Failed to create session')
        }
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const CurrentModeIcon = modeConfig[mode].icon

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="border-border bg-card rounded-xl border p-3 shadow-sm">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="min-h-[60px] resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          rows={2}
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BranchSelector />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5 text-xs font-medium"
                >
                  <CurrentModeIcon className="h-3.5 w-3.5" />
                  {modeConfig[mode].label}
                  <ChevronDown className="text-muted-foreground h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {(Object.keys(modeConfig) as Mode[]).map((key) => {
                  const Icon = modeConfig[key].icon
                  return (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => setMode(key)}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {modeConfig[key].label}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {modeConfig[key].description}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleSubmit}
            disabled={disabled || isLoading || !message.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
