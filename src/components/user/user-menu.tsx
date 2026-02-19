'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { LogOut, Key, Palette, Sun, Moon, Monitor, Check } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface UserMenuProps {
  user?: {
    name: string
    email: string
    avatarUrl?: string
  }
  onApiKeys?: () => void
  onLogOut?: () => void
}

function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = React.useState(false)

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Palette className="h-4 w-4" />
          Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="start" side="left" sideOffset={8}>
        {themes.map((t) => {
          const Icon = t.icon
          return (
            <Button
              key={t.value}
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => {
                setTheme(t.value)
                setOpen(false)
              }}
            >
              <Icon className="h-4 w-4" />
              {t.label}
              {theme === t.value && <Check className="ml-auto h-4 w-4" />}
            </Button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

export function UserMenu({ user, onApiKeys, onLogOut }: UserMenuProps) {
  const router = useRouter()
  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={() => router.push('/sign-in')}
      >
        Sign in
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="flex flex-col items-center gap-2 p-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-foreground font-medium">{user.name}</p>
            <p className="text-sm" style={{ color: '#36454F' }}>
              {user.email}
            </p>
          </div>
        </div>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={onApiKeys}
          >
            <Key className="h-4 w-4" />
            API Keys
          </Button>
          <ThemeSelector />
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive w-full justify-start gap-2"
            onClick={onLogOut}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
