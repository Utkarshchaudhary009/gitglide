'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Zap, BookOpen } from 'lucide-react'

export function ActionSelector() {
  return (
    <Select defaultValue="planning">
      <SelectTrigger className="text-muted-foreground hover:bg-muted/50 hover:text-foreground w-[140px] border-0 bg-transparent focus:ring-0">
        <SelectValue placeholder="Action Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="planning">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span>Planning</span>
          </div>
        </SelectItem>
        <SelectItem value="fast">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Fast</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
