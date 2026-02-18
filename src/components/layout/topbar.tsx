'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Topbar() {
  return (
    <header className="bg-card flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs placeholder */}
        <span className="text-muted-foreground text-sm">Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>
      </div>
    </header>
  )
}
