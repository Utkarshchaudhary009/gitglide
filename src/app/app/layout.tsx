'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'

const mockUser = {
  name: 'Utkarsh Chaudhary',
  email: 'utkarsh@example.com',
  avatarUrl: undefined,
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const handleApiKeys = () => {
    console.log('Navigate to API Keys')
  }

  const handleLogOut = () => {
    console.log('Log out user')
  }

  return (
    <TooltipProvider>
      <AppSidebar>
        <div className="flex h-screen flex-col">
          <Header
            user={mockUser}
            onApiKeys={handleApiKeys}
            onLogOut={handleLogOut}
          />
          <main className="flex flex-1 flex-col overflow-auto">
            {children}
          </main>
        </div>
      </AppSidebar>
    </TooltipProvider>
  )
}
