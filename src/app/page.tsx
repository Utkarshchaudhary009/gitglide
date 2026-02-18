import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-6">
        <div className="text-xl font-bold">GitGlide</div>
        <div className="ml-auto flex gap-4">
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Autonomous Coding Agent Wrapper
        </h1>
        <p className="text-muted-foreground max-w-[600px] text-xl">
          Beautiful UI for Jules. Automate your code reviews and deployment
          fixes.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
