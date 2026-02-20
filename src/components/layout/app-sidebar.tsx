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
  GitBranch,
  Loader2,
  Search,
  X,
  ChevronDown,
  ChevronRight,
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

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
}: {
  item: (typeof navItems)[0]
  isActive: boolean
}) {
  const Icon = item.icon

  return (
    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
      <Link href={item.href}>
        <Icon className="h-4 w-4 shrink-0" />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  )
}

function SidebarNav() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavItem item={item} isActive={pathname === item.href} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function RepositoriesSection() {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const { sources, fetchSources, isLoading } = useSourcesStore()
  const [reposOpen, setReposOpen] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const pathname = usePathname()

  React.useEffect(() => {
    fetchSources()
  }, [fetchSources])

  const filteredSources = sources.filter((source) => {
    const fullName = `${source.githubRepo.owner}/${source.githubRepo.repo}`
    return fullName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (isCollapsed) {
    return (
      <SidebarGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toggleSidebar()
                setReposOpen(true)
              }}
              className="text-muted-foreground hover:bg-accent hover:text-foreground mx-auto flex h-9 w-9 items-center justify-center rounded-lg md:h-8 md:w-8"
            >
              <GitBranch className="h-5 w-5" />
              <span className="sr-only">Repositories</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Repositories</TooltipContent>
        </Tooltip>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <Collapsible open={reposOpen} onOpenChange={setReposOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-8 w-full justify-between px-2 text-xs"
          >
            <span className="flex items-center gap-2">
              <GitBranch className="h-3.5 w-3.5" />
              Repositories
            </span>
            {reposOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {(sources.length > 0 || searchQuery) && (
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3 w-3 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search repos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 pr-7 pl-7 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          <div className="max-h-48 space-y-1 overflow-y-auto">
            {isLoading && sources.length === 0 ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-3 text-xs">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
              </div>
            ) : filteredSources.length === 0 ? (
              <p className="text-muted-foreground py-2 text-center text-xs">
                {searchQuery
                  ? `No repos match "${searchQuery}"`
                  : 'No repositories found'}
              </p>
            ) : (
              filteredSources.map((source) => {
                const repoPath = `/app/repos/${source.githubRepo.owner}/${source.githubRepo.repo}`
                const isActive = pathname === repoPath

                return (
                  <Link key={source.id} href={repoPath}>
                    <div
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors',
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                      )}
                    >
                      <GitBranch className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {source.githubRepo.owner}/{source.githubRepo.repo}
                      </span>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  )
}

interface AppSidebarContentProps {
  isMobile: boolean
}

function AppSidebarContent({ isMobile }: AppSidebarContentProps) {
  return (
    <Sidebar
      collapsible={isMobile ? 'offcanvas' : 'icon'}
      className="w-72 border-r"
    >
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

  // Desktop: collapsed by default (icon-only)
  // Mobile: closed by default (offcanvas handles open state separately)
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebarContent isMobile={isMobile} />
      <main className="flex-1 overflow-auto">{children}</main>
    </SidebarProvider>
  )
}
