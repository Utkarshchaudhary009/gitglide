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
import { useSourcesStore } from '@/stores/use-sources-store'
import { useSidebarStore } from '@/stores/use-sidebar-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const navItems = [
  { title: 'Home', icon: Home, href: '/app', exact: true },
  { title: 'Tasks', icon: ListTodo, href: '/app/tasks' },
  { title: 'Scheduled Tasks', icon: Calendar, href: '/app/scheduled' },
  { title: 'Integrations', icon: Plug, href: '/app/integrations' },
  { title: 'Deployments', icon: Rocket, href: '/app/deployments' },
  { title: 'Settings', icon: Settings, href: '/app/settings' },
]

interface AppSidebarProps {
  width?: number
}

export function AppSidebar({ width = 288 }: AppSidebarProps) {
  const pathname = usePathname()
  const { toggle, setOpen } = useSidebarStore()
  const isCollapsed = width < 100

  const { sources, fetchSources, isLoading } = useSourcesStore()
  const [reposOpen, setReposOpen] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    fetchSources()
  }, [fetchSources])

  const filteredSources = sources.filter((source) => {
    const fullName = `${source.githubRepo.owner}/${source.githubRepo.repo}`
    return fullName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setOpen(false)
    }
  }

  const isNavActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div
      className={cn(
        'pb-12 h-full border-r bg-background transition-all duration-300 ease-in-out flex flex-col',
        isCollapsed ? 'w-[60px]' : 'w-72'
      )}
      style={{ width: isCollapsed ? 60 : width }}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = isNavActive(item.href, item.exact)

              if (isCollapsed) {
                return (
                  <TooltipProvider key={item.href} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          onClick={handleLinkClick}
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 mx-auto mb-1',
                            isActive
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground hover:bg-accent'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="sr-only">{item.title}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="flex items-center gap-4"
                      >
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              }

              return (
                <Link key={item.href} href={item.href} onClick={handleLinkClick}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start h-9 mb-1',
                      isActive && 'bg-accent'
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Repos Section */}
      <div
        className={cn(
          'flex-1 px-2 md:px-3',
          isCollapsed ? 'overflow-hidden' : 'overflow-y-auto'
        )}
      >
        {isCollapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toggle()
                    setReposOpen(true)
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground md:h-8 md:w-8 mx-auto mt-2"
                >
                  <GitBranch className="h-5 w-5" />
                  <span className="sr-only">Repositories</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                Repositories
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Collapsible open={reposOpen} onOpenChange={setReposOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
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
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search repos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-7 pl-7 pr-7 text-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {isLoading && sources.length === 0 ? (
                  <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading...
                  </div>
                ) : filteredSources.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    {searchQuery
                      ? `No repos match "${searchQuery}"`
                      : 'No repositories found'}
                  </p>
                ) : (
                  filteredSources.map((source) => {
                    const repoPath = `/app/repos/${source.githubRepo.owner}/${source.githubRepo.repo}`
                    const isActive =
                      pathname === repoPath ||
                      pathname.startsWith(repoPath + '/')

                    return (
                      <Link
                        key={source.id}
                        href={repoPath}
                        onClick={handleLinkClick}
                      >
                        <div
                          className={cn(
                            'flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer transition-colors',
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
        )}
      </div>
    </div>
  )
}
