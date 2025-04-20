import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { userQueryOptions } from '@/features/auth/api/get-user'
import { useAuth } from '@/features/auth/api/use-auth'
import { useSuspenseQuery } from '@tanstack/react-query'

export function UserProfileDropdown() {
  const { logout } = useAuth()
  const { data: user } = useSuspenseQuery(userQueryOptions())

  if (!user) {
    return null
  }

  const handleLogOut = async () => {
    await logout()
  }

  const displayName = user.name || user.email || 'User'
  const displayEmail = user.email
  const initial = displayName ? displayName[0].toUpperCase() : '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{displayName}</p>
            {displayEmail && (
              <p className="text-muted-foreground text-xs leading-none">{displayEmail}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
