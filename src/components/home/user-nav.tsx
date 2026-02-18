import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LogOut, Key, Box, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useClerk, useUser } from '@clerk/nextjs'

export function UserNav() {
  const { theme, setTheme } = useTheme()
  const { user } = useUser()
  const { signOut } = useClerk()

  if (!user) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
            <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" forceMount>
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5">
                <CardTitle className="text-sm font-medium">
                  {user.fullName}
                </CardTitle>
                <CardDescription className="max-w-[180px] truncate text-xs">
                  {user.primaryEmailAddress?.emailAddress}
                </CardDescription>
              </div>
            </div>
            <div className="text-muted-foreground mt-2 text-xs">
              {/* Example of accessing public metadata if available */}
              {/* {session.user.publicMetadata.role as string} */}
              3/5 messages remaining today
            </div>
          </CardHeader>
          <div className="border-t" />
          <CardContent className="grid gap-1 p-2">
            {/* Theme Submenu - Simplified for now as a toggle cycle */}
            <Button
              variant="ghost"
              className="h-8 w-full justify-start gap-2 px-2 text-sm font-normal"
              onClick={() => {
                const themes = ['light', 'dark', 'system']
                const current = themes.indexOf(theme || 'system')
                setTheme(themes[(current + 1) % themes.length])
              }}
            >
              <Monitor className="h-4 w-4" />
              <span>Theme</span>
              <span className="text-muted-foreground ml-auto text-xs">
                Cycle
              </span>
            </Button>

            <Button
              variant="ghost"
              className="h-8 w-full justify-start gap-2 px-2 text-sm font-normal"
            >
              <Key className="h-4 w-4" />
              <span>API Keys</span>
            </Button>
            <Button
              variant="ghost"
              className="h-8 w-full justify-start gap-2 px-2 text-sm font-normal"
            >
              <Box className="h-4 w-4" />
              <span>Sandboxes</span>
            </Button>
            <div className="my-1 border-t" />
            <Button
              variant="ghost"
              className="h-8 w-full justify-start gap-2 px-2 text-sm font-normal text-red-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
