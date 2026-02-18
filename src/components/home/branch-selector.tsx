'use client'

import { useState, useMemo, useEffect } from 'react'
import { Check, ChevronsUpDown, GitBranch } from 'lucide-react'

import { cn } from '@/lib/utils'
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
import { useSourcesStore } from '@/stores/use-sources-store'

export function BranchSelector() {
  const { sources, fetchSources, isLoading, error } = useSourcesStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchSources()
  }, [fetchSources])

  // Flatten branches from all sources
  const branches = useMemo(() => {
    return sources.flatMap((source) =>
      (source.githubRepo?.branches ?? []).map((branch) => ({
        value: `${source.id}|${branch}`, // Unique ID
        label: `${source.githubRepo?.repo ?? 'unknown'}/${branch}`, // Display
        repo: source.githubRepo?.repo ?? 'unknown',
        branch: branch,
      }))
    )
  }, [sources])

  const [value, setValue] = useState('')

  const defaultBranchValue = useMemo(() => {
    if (branches.length === 0) return ''
    const defaultBranch =
      branches.find((b) => b.branch === 'main' || b.branch === 'master') ||
      branches[0]
    return defaultBranch.value
  }, [branches])

  const selectedValue = value || defaultBranchValue

  const selectedLabel = branches.find((b) => b.value === selectedValue)?.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="text-muted-foreground hover:bg-muted/50 hover:text-foreground w-[240px] justify-between border-0 bg-transparent"
        >
          <div className="flex items-center gap-2 truncate">
            <GitBranch className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {error
                ? 'Error loading'
                : isLoading
                  ? 'Loading...'
                  : selectedValue
                    ? selectedLabel
                    : 'Select branch...'}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search branch..." />
          <CommandList>
            <CommandEmpty>{error ? error : 'No branch found.'}</CommandEmpty>
            <CommandGroup>
              {branches.map((branch) => (
                <CommandItem
                  key={branch.value}
                  value={branch.label} // Search by label
                  onSelect={() => {
                    setValue(branch.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValue === branch.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {branch.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
