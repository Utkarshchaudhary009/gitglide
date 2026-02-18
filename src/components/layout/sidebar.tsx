'use client'

import * as React from 'react'
import {
  Home,
  ListTodo,
  Clock,
  Plug,
  Rocket,
  Settings,
  Command,
  Loader2,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInput,
} from '@/components/ui/sidebar'
import { useSourcesStore } from '@/stores/use-sources-store'
import { useEffect, useState, useRef, useCallback } from 'react'

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Home',
      url: '/dashboard',
      icon: Home,
      isActive: true,
    },
    {
      title: 'Tasks',
      url: '/dashboard/tasks',
      icon: ListTodo,
    },
    {
      title: 'Scheduled Tasks',
      url: '#',
      icon: Clock,
    },
    {
      title: 'Integrations',
      url: '#',
      icon: Plug,
    },
    {
      title: 'Deployments',
      url: '#',
      icon: Rocket,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sources, fetchSources, nextPageToken, hasMore, isLoading, error } =
    useSourcesStore()
  const [searchTerm, setSearchTerm] = useState('')
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial fetch
    fetchSources()
  }, [fetchSources])

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading && nextPageToken) {
      fetchSources(nextPageToken)
    }
  }, [hasMore, isLoading, nextPageToken, fetchSources])

  useEffect(() => {
    const target = observerTarget.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore()
        }
      },
      { threshold: 1.0 }
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [handleLoadMore])

  const filteredSources = sources.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.githubRepo.repo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">GitGlide</span>
                  <span className="truncate text-xs">Autonomous Agent</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={item.isActive}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Repositories</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="mb-2 px-2">
              <SidebarInput
                placeholder="Search repos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <SidebarMenu>
              {filteredSources.map((source) => (
                <SidebarMenuItem key={source.id}>
                  <SidebarMenuButton asChild>
                    <a href={`/sources/${source.id}`}>
                      <span>
                        {source.githubRepo.owner}/{source.githubRepo.repo}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {error && (
                <div className="px-4 py-2 text-xs text-red-500">{error}</div>
              )}
              {filteredSources.length === 0 && !isLoading && !error && (
                <div className="text-muted-foreground px-4 py-2 text-xs">
                  No repositories found.
                </div>
              )}
              {/* Sentinel for infinite scroll */}
              {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-4">
                  {isLoading && (
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  )}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
