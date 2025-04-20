import ThemeToggle from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { UserProfileDropdown } from '@/components/user-profile-dropdown'
import { userQueryOptions } from '@/features/auth/api/get-user'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Bell, HelpCircle, Search, Settings } from 'lucide-react'

export function Header() {
  const { data: user } = useSuspenseQuery(userQueryOptions())

  return (
    <header className="bg-background/95 sticky top-0 z-50 flex w-full justify-center border-b backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo and App Name */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
              <span className="text-primary-foreground font-bold">EX</span>
            </div>
            <span className="text-lg font-semibold">Extensions Hub</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="relative hidden w-1/3 md:flex">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input type="search" placeholder="Search extensions..." className="w-full pl-8" />
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>New update available</DropdownMenuItem>
              <DropdownMenuItem>3 extensions need attention</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>About</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-1 items-center justify-end space-x-4">
            {user ? (
              <UserProfileDropdown />
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
