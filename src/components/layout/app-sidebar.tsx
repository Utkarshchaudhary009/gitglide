'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ListTodo,
  Calendar,
  Plug,
  Rocket,
  Settings,
  FolderGit2,
} from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Card, CardContent } from '@/components/ui/card'

const navItems = [
  { title: 'Home', icon: Home, href: '/app' },
  { title: 'Tasks', icon: ListTodo, href: '/app/tasks' },
  { title: 'Scheduled Tasks', icon: Calendar, href: '/app/scheduled' },
  { title: 'Integrations', icon: Plug, href: '/app/integrations' },
  { title: 'Deployments', icon: Rocket, href: '/app/deployments' },
  { title: 'Settings', icon: Settings, href: '/app/settings' },
]

function NavItem({
  item,
  isActive,
  isCollapsed,
}: {
  item: (typeof navItems)[0]
  isActive: boolean
  isCollapsed: boolean
}) {
  const Icon = item.icon

  const button = (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={isCollapsed ? item.title : undefined}
    >
      <Link href={item.href}>
        <Icon className="h-4 w-4" />
        <span
          className={cn(
            'transition-opacity duration-200',
            isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
          )}
        >
          {item.title}
        </span>
      </Link>
    </SidebarMenuButton>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    )
  }

  return button
}

function SidebarNav() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavItem
                item={item}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function RepositoriesSection() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  if (isCollapsed) {
    return (
      <SidebarGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center p-2">
              <FolderGit2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Repositories</TooltipContent>
        </Tooltip>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Repositories</SidebarGroupLabel>
      <SidebarGroupContent>
        <Card className="bg-muted/50 border-0">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">
              Sign in to view repositories.
            </p>
          </CardContent>
        </Card>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function AppSidebarContent() {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-2">
        <SidebarTrigger className="h-8 w-8" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <RepositoriesSection />
      </SidebarFooter>
    </Sidebar>
  )
}

interface AppSidebarProps {
  children: React.ReactNode
}

export function AppSidebar({ children }: AppSidebarProps) {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider defaultOpen={isMobile}>
      <AppSidebarContent />
      <main className="flex-1 overflow-auto">{children}</main>
    </SidebarProvider>
  )
}
