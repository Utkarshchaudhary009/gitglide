'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/shared/utils'
import { useSidebarStore } from '@/stores/use-sidebar-store'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  ListTodo,
  Network,
  Database,
  Settings,
  Menu,
  ChevronLeft,
  Search,
} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sessions', label: 'Sessions', icon: ListTodo },
  { href: '/integrations', label: 'Integrations', icon: Network },
  { href: '/sources', label: 'Sources', icon: Database },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebarStore()

  return (
    <aside
      className={cn(
        'bg-card relative flex flex-col border-r transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <span className="text-lg font-bold tracking-tight">GitGlide</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className={cn('ml-auto', isCollapsed ? 'h-8 w-8' : 'h-8 w-8')}
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <Icon className="h-4 w-4" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center justify-center border-t p-4">
        <UserButton
          showName={!isCollapsed}
          appearance={{
            elements: {
              rootBox: 'w-full flex justify-center',
              userButtonBox: isCollapsed
                ? 'justify-center'
                : 'justify-start w-full',
            },
          }}
        />
      </div>
    </aside>
  )
}
