
"use client"

import * as React from "react"
import {
    Settings2,
    SquareTerminal,
    Home,
    ListTodo,
    Clock,
    Plug,
    Rocket,
    Settings,
    Command
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarInput,
} from "@/components/ui/sidebar"
import { useSourcesStore } from "@/stores/use-sources-store"
import { useEffect, useState } from "react"

// This is sample data.
const data = {
    navMain: [
        {
            title: "Home",
            url: "/dashboard",
            icon: Home,
            isActive: true,
        },
        {
            title: "Tasks",
            url: "/dashboard/tasks",
            icon: ListTodo,
        },
        {
            title: "Scheduled Tasks",
            url: "#",
            icon: Clock,
        },
        {
            title: "Integrations",
            url: "#",
            icon: Plug,
        },
        {
            title: "Deployments",
            url: "#",
            icon: Rocket,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { sources, fetchSources } = useSourcesStore()
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchSources()
    }, [fetchSources])

    const filteredSources = sources.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.githubRepo.repo.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">GitGlide</span>
                                    <span className="truncate text-xs">Autonomous Agent</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SidebarGroupLabel>Repositories</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="px-2 mb-2">
                            <SidebarInput
                                placeholder="Search repos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <SidebarMenu>
                            {filteredSources.map((source) => (
                                <SidebarMenuItem key={source.id}>
                                    <SidebarMenuButton asChild>
                                        <a href={`/sources/${source.id}`}>
                                            <span>{source.githubRepo.owner}/{source.githubRepo.repo}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            {filteredSources.length === 0 && (
                                <div className="px-4 py-2 text-xs text-muted-foreground">
                                    No repositories found.
                                </div>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
