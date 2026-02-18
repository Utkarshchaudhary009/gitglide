
"use client"

import { useSession } from "@clerk/nextjs"
import { Hexagon, ArrowUp } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { BranchSelector } from "@/components/jules/branch-selector"
import { ActionSelector } from "@/components/jules/action-selector"
import { RecentActivity } from "@/components/jules/recent-activity"
import { useState } from "react"
import { useSessionStore } from "@/stores/use-session-store"
import { useRouter } from "next/navigation"

export default function HomePage() {
    const { session } = useSession()
    const user = session?.user

    const [prompt, setPrompt] = useState("")
    const router = useRouter()
    const { createSession } = useSessionStore()

    const handleCreate = async () => {
        if (!prompt.trim()) return
        try {
            const session = await createSession(prompt)
            router.push(`/sessions/${session.id}`)
        } catch (error) {
            console.error(error)
            // Should verify if toast is available or just let it fail silently for prototype
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleCreate()
        }
    }

    return (
        <div className="flex flex-col gap-12 max-w-5xl mx-auto py-12 md:py-20">

            {/* Hero Section */}
            <div className="flex flex-col items-center text-center gap-6">
                <div className="h-16 w-16 bg-white rounded-xl shadow-[0_0_40px_-5px_theme(colors.white)] flex items-center justify-center">
                    <Hexagon className="h-8 w-8 text-black" fill="black" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl font-medium tracking-tight">
                        Good Afternoon, {user?.firstName || "Utkarsh"} 👋
                    </h1>
                    {/* Subheading removed per request */}
                </div>
            </div>

            {/* Main Input Box */}
            <div className="relative group rounded-2xl border bg-card/50 shadow-sm focus-within:ring-1 focus-within:ring-ring transition-all">
                <Textarea
                    placeholder="Describe what you want the AI agent to do..."
                    className="min-h-[120px] w-full resize-none border-0 bg-transparent p-6 text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <div className="flex items-center justify-between px-4 pb-4">
                    <div className="flex items-center gap-2">
                        <BranchSelector />
                        <ActionSelector />
                    </div>
                    <div>
                        {/* Send button moved to Session Page, but user interaction is Enter key. 
                    Maybe a visual indicator? Or just minimal Enter hint? 
                    Ref image shows circle arrow button, user said "Send button move to session page". 
                    But wait, how do we *start* it? Maybe Enter is the only way? 
                    Or the circular button *is* the start button?
                    "as send button move to session page" -> PROBABLY means the *chat* send button.
                    The *start* button is likely still needed.
                    I will keep a small Enter hint or button for clarity. */}
                        <Button size="icon" className="rounded-full h-10 w-10 shrink-0" onClick={handleCreate}>
                            <ArrowUp className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <RecentActivity />

        </div>
    )
}
