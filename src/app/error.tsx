'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 p-8">
            <AlertCircle className="text-destructive h-10 w-10" />
            <h2 className="text-xl font-semibold">Something went wrong!</h2>
            <p className="text-muted-foreground max-w-[500px] text-center text-sm">
                {error.message || 'An unexpected error occurred.'}
            </p>
            <Button onClick={() => reset()} variant="outline" className="mt-4">
                Try again
            </Button>
        </div>
    )
}
