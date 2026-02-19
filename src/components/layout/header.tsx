'use client'

import * as React from 'react'
import Link from 'next/link'
import { ExternalLink, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user/user-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface HeaderProps {
  organization?: string
  repository?: string
  user?: {
    name: string
    email: string
    avatarUrl?: string
  }
  onApiKeys?: () => void
  onLogOut?: () => void
}

export function Header({
  organization = 'Utkarshchaudhary009',
  repository = 'Repo',
  user,
  onApiKeys,
  onLogOut,
}: HeaderProps) {
  return (
    <header className="border-border bg-background flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="h-8 w-8" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Toggle sidebar (Ctrl+B)</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-1 text-sm">
          <Button variant="ghost" size="sm" className="h-8 px-2 font-normal">
            {organization}
          </Button>
          <span className="text-muted-foreground">/</span>
          <Button variant="ghost" size="sm" className="h-8 px-2 font-normal">
            {repository}
          </Button>
          <Link
            href="#"
            className="text-muted-foreground hover:text-foreground ml-1"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <UserMenu user={user} onApiKeys={onApiKeys} onLogOut={onLogOut} />
    </header>
  )
}
