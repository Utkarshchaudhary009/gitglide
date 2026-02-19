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
  GitBranch,
  Loader2,
} from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useSourcesStore } from '@/stores/use-sources-store'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'

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
            isCollapsed ? 'w-0 opacity-0' : 'opacity-100'
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
  const { sources, fetchSources, isLoading } = useSourcesStore()

  React.useEffect(() => {
    fetchSources()
  }, [fetchSources])

  if (isCollapsed) {
    return (
      <SidebarGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center p-2">
              <FolderGit2 className="text-muted-foreground h-4 w-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Repositories</TooltipContent>
        </Tooltip>
      </SidebarGroup>
    )
  }

  const recentSources = sources.slice(0, 5)

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>Repositories</span>
        {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <ScrollArea className="h-[120px]">
          <SidebarMenu>
            {recentSources.length === 0 ? (
              <div className="text-muted-foreground px-2 py-1 text-xs">
                No repositories found
              </div>
            ) : (
              recentSources.map((source) => (
                <SidebarMenuItem key={source.id}>
                  <SidebarMenuButton asChild size="sm" className="text-xs">
                    <Link
                      href={`/app/repos/${source.githubRepo.owner}/${source.githubRepo.repo}`}
                    >
                      <GitBranch className="h-3 w-3" />
                      <span className="truncate">
                        {source.githubRepo.owner}/{source.githubRepo.repo}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function AppSidebarContent() {
  return (
    <Sidebar collapsible="icon" className="w-72 border-r">
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
