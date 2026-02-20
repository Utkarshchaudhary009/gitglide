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
  AlertCircle,
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useSourcesStore } from '@/stores/use-sources-store'
import { useSidebarStore } from '@/stores/use-sidebar-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
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
  const { isSignedIn } = useUser()
  const isCollapsed = width < 100

  const { sources, fetchSources, isLoading, isConfigured, hasFetched } =
    useSourcesStore()
  const [reposOpen, setReposOpen] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    if (isSignedIn) {
      fetchSources()
    }
  }, [fetchSources, isSignedIn])

  const filteredSources = React.useMemo(() => {
    return sources.filter((source) => {
      const fullName = `${source.githubRepo.owner}/${source.githubRepo.repo}`
      return fullName.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [sources, searchQuery])

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
        'bg-background flex h-full flex-col border-r pb-12 transition-all duration-300 ease-in-out'
      )}
      style={{ width: isCollapsed ? 60 : width }}
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'bg-background flex h-full flex-col border-r pb-12 transition-all duration-300 ease-in-out'
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
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          'hover:text-foreground mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8',
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
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                >
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'mb-1 h-9 w-full justify-start',
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggle()
                  setReposOpen(true)
                }}
                className="text-muted-foreground hover:bg-accent hover:text-foreground mx-auto mt-2 flex h-9 w-9 items-center justify-center rounded-lg md:h-8 md:w-8"
              >
                <GitBranch className="h-5 w-5" />
                <span className="sr-only">Repositories</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              Repositories
            </TooltipContent>
          </Tooltip>
        ) : (
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
              {!isSignedIn ? (
                <Card className="border-dashed">
                  <CardContent className="text-muted-foreground p-3 text-center text-xs">
                    <AlertCircle className="text-muted-foreground/70 mx-auto mb-1.5 h-4 w-4" />
                    Sign in to view repositories
                  </CardContent>
                </Card>
              ) : !isConfigured ? (
                <Card className="border-dashed">
                  <CardContent className="text-muted-foreground p-3 text-center text-xs">
                    <AlertCircle className="mx-auto mb-1.5 h-4 w-4 text-amber-500" />
                    <p className="mb-2">Connect Jules to view repositories</p>
                    <Link href="/app/integrations" onClick={handleLinkClick}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                      >
                        <Plug className="mr-1.5 h-3 w-3" />
                        Connect Jules
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <>
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
                    ) : hasFetched && filteredSources.length === 0 ? (
                      <p className="text-muted-foreground py-2 text-center text-xs">
                        {searchQuery
                          ? `No repos match "${searchQuery}"`
                          : 'No repositories found'}
                      </p>
                    ) : (
                      filteredSources.map((source) => {
                        const repoPath = `/app/repos/${source.githubRepo.owner}/${source.githubRepo.repo}`
                        const isActive = isNavActive(repoPath)

                        return (
                          <Link
                            key={source.id}
                            href={repoPath}
                            onClick={handleLinkClick}
                          >
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
                                {source.githubRepo.owner}/
                                {source.githubRepo.repo}
                              </span>
                            </div>
                          </Link>
                        )
                      })
                    )}
                  </div>
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  )
}
