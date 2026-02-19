'use client'

import * as React from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend?: (message: string) => void
  placeholder?: string
  disabled?: boolean
}

type Mode = 'fast' | 'plan'

export function ChatInput({
  onSend,
  placeholder = 'Describe what you want the AI agent to do...',
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = React.useState('')
  const [mode, setMode] = React.useState<Mode>('fast')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (message.trim() && onSend) {
      onSend(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[60px] resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          rows={2}
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 rounded-md px-3 text-xs font-medium transition-colors',
                mode === 'fast'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setMode('fast')}
            >
              Fast
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 rounded-md px-3 text-xs font-medium transition-colors',
                mode === 'plan'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setMode('plan')}
            >
              Plan
            </Button>
          </div>
          <Button
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleSubmit}
            disabled={disabled || !message.trim()}
          >
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
