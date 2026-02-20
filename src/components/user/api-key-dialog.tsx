'use client'

import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Eye, EyeOff, Key, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { useUserSettingsStore } from '@/stores/use-user-settings-store'
import { cn } from '@/lib/utils'

interface ApiKeyDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type Provider = 'jules' | 'vercel'

const PROVIDERS: { id: Provider; name: string; description: string; placeholder: string }[] = [
    {
        id: 'jules',
        name: 'Jules',
        description: 'Google Jules AI coding agent',
        placeholder: 'Paste your Jules API key…',
    },
    {
        id: 'vercel',
        name: 'Vercel',
        description: 'Vercel platform access token',
        placeholder: 'Paste your Vercel token…',
    },
]

export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
    const { keys, isLoading, hasFetched, fetchKeys, saveKey, deleteKey } = useUserSettingsStore()

    // Per-provider input/show state
    const [inputs, setInputs] = useState<Record<Provider, string>>({ jules: '', vercel: '' })
    const [showKey, setShowKey] = useState<Record<Provider, boolean>>({ jules: false, vercel: false })
    const [saving, setSaving] = useState<Record<Provider, boolean>>({ jules: false, vercel: false })
    const [deleting, setDeleting] = useState<Record<Provider, boolean>>({ jules: false, vercel: false })

    useEffect(() => {
        if (open && !hasFetched) {
            fetchKeys()
        }
    }, [open, hasFetched, fetchKeys])

    const handleSave = async (provider: Provider) => {
        const value = inputs[provider].trim()
        if (!value) {
            toast.error('Please enter a key before saving')
            return
        }
        setSaving((prev) => ({ ...prev, [provider]: true }))
        try {
            await saveKey(provider, value)
            setInputs((prev) => ({ ...prev, [provider]: '' }))
            setShowKey((prev) => ({ ...prev, [provider]: false }))
            toast.success(`${PROVIDERS.find((p) => p.id === provider)?.name} key saved`)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to save key')
        } finally {
            setSaving((prev) => ({ ...prev, [provider]: false }))
        }
    }

    const handleDelete = async (provider: Provider) => {
        setDeleting((prev) => ({ ...prev, [provider]: true }))
        try {
            await deleteKey(provider)
            toast.success(`${PROVIDERS.find((p) => p.id === provider)?.name} key removed`)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to remove key')
        } finally {
            setDeleting((prev) => ({ ...prev, [provider]: false }))
        }
    }

    const isBusy = (provider: Provider) => saving[provider] || deleting[provider]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-lg p-0 gap-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Key className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-semibold">API Keys</DialogTitle>
                            <DialogDescription className="text-xs mt-0.5">
                                Keys are encrypted and stored securely. Only you can access them.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {PROVIDERS.map((provider) => {
                        const state = keys[provider.id]
                        const isSet = state?.isSet ?? false
                        const masked = state?.masked ?? null
                        const inputVal = inputs[provider.id]

                        return (
                            <div key={provider.id} className="space-y-2">
                                {/* Provider label row */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {isSet ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                                        ) : (
                                            <Circle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                        )}
                                        <span className="text-sm font-medium">{provider.name}</span>
                                        {isSet && masked && (
                                            <span className="text-muted-foreground font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                                {masked}
                                            </span>
                                        )}
                                    </div>
                                    {isSet && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn(
                                                'h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors',
                                                deleting[provider.id] && 'opacity-50 pointer-events-none'
                                            )}
                                            onClick={() => handleDelete(provider.id)}
                                            disabled={isBusy(provider.id)}
                                        >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            {deleting[provider.id] ? 'Removing…' : 'Remove'}
                                        </Button>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground pl-5">{provider.description}</p>

                                {/* Input row */}
                                {isLoading && !hasFetched ? (
                                    <Skeleton className="h-9 w-full rounded-md" />
                                ) : (
                                    <div className="relative">
                                        <Input
                                            id={`key-${provider.id}`}
                                            type={showKey[provider.id] ? 'text' : 'password'}
                                            placeholder={isSet ? '••••••••••••••••' : provider.placeholder}
                                            value={inputVal}
                                            onChange={(e) =>
                                                setInputs((prev) => ({ ...prev, [provider.id]: e.target.value }))
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !isBusy(provider.id)) handleSave(provider.id)
                                            }}
                                            disabled={isBusy(provider.id)}
                                            className="pr-16 h-9 text-sm font-mono"
                                        />
                                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowKey((prev) => ({ ...prev, [provider.id]: !prev[provider.id] }))
                                                }
                                                disabled={isBusy(provider.id)}
                                                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded"
                                                tabIndex={-1}
                                            >
                                                {showKey[provider.id] ? (
                                                    <EyeOff className="h-3.5 w-3.5" />
                                                ) : (
                                                    <Eye className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleSave(provider.id)}
                                                disabled={isBusy(provider.id) || !inputVal.trim()}
                                                className="h-7 px-3 text-xs"
                                            >
                                                {saving[provider.id] ? 'Saving…' : 'Save'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Footer */}
                <div className="px-6 pb-5">
                    <p className="text-xs text-muted-foreground">
                        Keys are encrypted using AES-256-GCM before storage. Press{' '}
                        <kbd className="bg-muted rounded px-1 py-0.5 font-mono text-[10px]">Enter</kbd> in any
                        field to save quickly.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
