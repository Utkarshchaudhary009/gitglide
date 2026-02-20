'use client'

import { useState, useEffect, useCallback } from 'react'
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
      className="h-full border-r bg-background px-2 md:px-3 pt-3 md:pt-5.5 pb-3 md:pb-4"
      style={{ width: `${width}px` }}
    >
      <div className="mb-3 md:mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <button
              className="text-xs font-medium tracking-wide transition-colors px-2 py-1 rounded text-foreground bg-accent"
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
            className="animate-pulse h-9 rounded-lg bg-muted"
            style={{ width: isCollapsed ? 36 : '100%' }}
          />
        ))}
      </div>
    </div>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const { isOpen, width, toggle, setOpen, setWidth } = useSidebarStore()
  const [isResizing, setIsResizing] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    const actualIsDesktop = window.innerWidth >= 1024
    setIsDesktop(actualIsDesktop)

    if (!actualIsDesktop) {
      setOpen(false)
    }

    setHasMounted(true)
  }, [setOpen])

  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024
      setIsDesktop(newIsDesktop)

      if (!newIsDesktop && isOpen) {
        setOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, setOpen])

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
        className="h-dvh flex relative"
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
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40
            ${isResizing || !hasMounted ? '' : 'transition-all duration-300 ease-in-out'}
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
          `}
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
          className={`
            hidden lg:block fixed inset-y-0 cursor-col-resize group z-50 hover:bg-primary/20
            ${isResizing || !hasMounted ? '' : 'transition-all duration-300 ease-in-out'}
            ${isOpen ? 'w-1 opacity-100' : 'w-0 opacity-0'}
          `}
          onMouseDown={isOpen ? handleMouseDown : undefined}
          style={{
            left: isOpen ? `${width}px` : '0px',
          }}
        >
          <div className="absolute inset-0 w-2 -ml-0.5" />
          <div className="absolute inset-y-0 left-0 w-0.5 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 overflow-auto flex flex-col ${isResizing || !hasMounted ? '' : 'transition-all duration-300 ease-in-out'}`}
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
