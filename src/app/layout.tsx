import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/sonner'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/sidebar'
import { UserNav } from '@/components/home/user-nav'
import { Separator } from '@/components/ui/separator'
import { DynamicBreadcrumbs } from '@/components/layout/dynamic-breadcrumbs'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'GitGlide',
  description: 'Autonomous AI Coding Agent',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <AppSidebar />
              <main className="flex h-dvh w-full flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
                <header className="bg-background/95 backdrop-blur-md border-b border-border/50 flex h-16 shrink-0 items-center gap-2 px-4 sticky top-0 z-40">
                  <SidebarTrigger className="-ml-1 text-accent hover:bg-accent/10" />
                  <Separator orientation="vertical" className="mr-2 h-4 bg-border/30" />
                  <DynamicBreadcrumbs />
                  <div className="ml-auto flex items-center gap-2">
                    <UserNav />
                  </div>
                </header>
                <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-background/95">
                  {children}
                </div>
              </main>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
