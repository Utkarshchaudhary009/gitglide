'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
  }

  const handleApiKeys = () => {
    console.log('Navigate to API Keys')
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

  return (
    <TooltipProvider>
      <AppSidebar>
        <div className="flex h-screen flex-col">
          <Header
            user={userData}
            onApiKeys={handleApiKeys}
            onLogOut={handleLogOut}
          />
          <main className="flex flex-1 flex-col overflow-auto">{children}</main>
        </div>
      </AppSidebar>
    </TooltipProvider>
  )
}
