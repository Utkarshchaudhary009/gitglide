'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BranchSelector } from './branch-selector'
import { UserMenu } from '@/components/user/user-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

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
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-8 w-8 md:hidden" />
        
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
            className="ml-1 text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Separator orientation="vertical" className="mx-2 h-6" />
        
        <BranchSelector />
      </div>

      <UserMenu user={user} onApiKeys={onApiKeys} onLogOut={onLogOut} />
    </header>
  )
}
