'use client'

import * as React from 'react'
import { GitBranch, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Branch {
  name: string
  isDefault?: boolean
}

interface BranchSelectorProps {
  branches?: Branch[]
  selectedBranch?: string
  onBranchChange?: (branch: string) => void
}

const defaultBranches: Branch[] = [
  { name: 'main', isDefault: true },
  { name: 'develop' },
  { name: 'feature/auth' },
  { name: 'feature/ui-redesign' },
  { name: 'bugfix/login-issue' },
]

export function BranchSelector({
  branches = defaultBranches,
  selectedBranch = 'main',
  onBranchChange,
}: BranchSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(selectedBranch)

  const handleSelect = (branchName: string) => {
    setValue(branchName)
    setOpen(false)
    onBranchChange?.(branchName)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="h-8 gap-1.5 px-2 text-sm font-normal"
        >
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <span className="max-w-[120px] truncate">{value}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandList>
            <CommandEmpty>No branch found.</CommandEmpty>
            <CommandGroup heading="Branches">
              {branches.map((branch) => (
                <CommandItem
                  key={branch.name}
                  value={branch.name}
                  onSelect={() => handleSelect(branch.name)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      'h-4 w-4',
                      value === branch.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{branch.name}</span>
                  {branch.isDefault && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      default
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
