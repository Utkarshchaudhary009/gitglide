'use client'

import * as React from 'react'
import Link from 'next/link'
import { ExternalLink, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user/user-menu'
import { useSidebarStore } from '@/stores/use-sidebar-store'
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
  const { toggle } = useSidebarStore()

  return (
    <div className="px-3 pt-0.5 md:pt-3 pb-1.5 md:pb-4 overflow-visible">
      <div className="flex items-center justify-between gap-2 h-8 min-w-0">
        {/* Left side - Menu Button and Breadcrumbs */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggle}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Toggle sidebar</p>
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

        {/* Right side - User */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <UserMenu user={user} onApiKeys={onApiKeys} onLogOut={onLogOut} />
        </div>
      </div>
    </div>
  )
}
