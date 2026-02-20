'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { useSidebarStore } from '@/stores/use-sidebar-store'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useClerk, useUser } from '@clerk/nextjs'

interface AppLayoutProps {
  children: React.ReactNode
}

function SidebarLoader({ width }: { width: number }) {
  const isCollapsed = width < 100
  return (
    <div
      className="bg-background h-full border-r px-2 pt-3 pb-3 md:px-3 md:pt-5.5 md:pb-4"
      style={{ width: `${width}px` }}
    >
      <div className="mb-3 md:mb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              className="text-foreground bg-accent rounded px-2 py-1 text-xs font-medium tracking-wide transition-colors"
              disabled
            >
              Loading...
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted h-9 animate-pulse rounded-lg"
            style={{ width: isCollapsed ? 36 : '100%' }}
          />
        ))}
      </div>
    </div>
  )
}

function subscribeToMount(callback: () => void) {
  return () => {}
}

function getMountSnapshot() {
  return true
}

function getMountServerSnapshot() {
  return false
}

function subscribeToDesktop(callback: () => void) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

function getDesktopSnapshot() {
  return window.innerWidth >= 1024
}

function getDesktopServerSnapshot() {
  return true
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const { isOpen, width, toggle, setOpen, setWidth } = useSidebarStore()
  const [isResizing, setIsResizing] = useState(false)
  const hasMounted = useSyncExternalStore(
    subscribeToMount,
    getMountSnapshot,
    getMountServerSnapshot
  )
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  )

  useEffect(() => {
    if (!isDesktop && isOpen) {
      setOpen(false)
    }
  }, [isDesktop, isOpen, setOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      const isModifier = e.metaKey || e.ctrlKey

      if (isModifier) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault()
            toggle()
            break
          case ',':
            e.preventDefault()
            router.push('/app/settings')
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggle, router])

  const closeSidebar = () => {
    setOpen(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = e.clientX
      const railWidth = 64
      const minExpandedWidth = 200
      const maxWidth = 600

      if (newWidth < 100) {
        setWidth(railWidth)
      } else if (newWidth >= minExpandedWidth && newWidth <= maxWidth) {
        setWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, setWidth])

  const handleApiKeys = () => {
    router.push('/app/settings')
  }

  const handleLogOut = () => {
    void signOut()
  }

  const userData = user
    ? {
        name: user.fullName || user.username || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        avatarUrl: user.imageUrl,
      }
    : undefined

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div
        className="relative flex h-dvh"
        style={
          {
            '--sidebar-width': `${width}px`,
            '--sidebar-open': isOpen ? '1' : '0',
          } as React.CSSProperties
        }
        suppressHydrationWarning
      >
        {/* Backdrop - Mobile Only */}
        {isOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 ${isResizing || !hasMounted ? '' : 'transition-all duration-300 ease-in-out'} ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'} `}
          style={{
            width: `${width}px`,
          }}
        >
          <div
            className="h-full overflow-hidden"
            style={{
              width: `${width}px`,
            }}
          >
            {!hasMounted ? (
              <SidebarLoader width={width} />
            ) : (
              <AppSidebar width={width} />
            )}
          </div>
        </div>

        {/* Resize Handle - Desktop Only */}
        <div
          className={`group hover:bg-primary/20 fixed inset-y-0 z-50 hidden cursor-col-resize lg:block ${isResizing || !hasMounted ? '' : 'transition-all duration-300 ease-in-out'} ${isOpen ? 'w-1 opacity-100' : 'w-0 opacity-0'} `}
          onMouseDown={isOpen ? handleMouseDown : undefined}
          style={{
            left: isOpen ? `${width}px` : '0px',
          }}
        >
          <div className="absolute inset-0 -ml-0.5 w-2" />
          <div className="bg-primary/50 absolute inset-y-0 left-0 w-0.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Main Content */}
        <div
          className={`flex flex-1 flex-col overflow-auto ${isResizing || !hasMounted ? '' : 'transition-all duration-300 ease-in-out'}`}
          style={{
            marginLeft: isDesktop && isOpen ? `${width + 4}px` : '0px',
          }}
        >
          <Header
            user={userData}
            onApiKeys={handleApiKeys}
            onLogOut={handleLogOut}
          />
          <main className="flex flex-1 flex-col overflow-auto">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  )
}
