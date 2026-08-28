import { LayoutDashboard, LogOut, Target, User } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

const NAV_ITEMS = [
  { to: '/game', label: 'Game', icon: Target },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export function AppShell({ children }: { children: ReactNode }) {
  const email = useAuthStore((state) => state.user?.email)
  const logout = useLogout()

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <NavLink to="/game" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Target className="size-4.5" />
              </span>
              <span className="hidden sm:inline">Pinpoint</span>
            </NavLink>

            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                    )
                  }
                >
                  <item.icon className="size-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Account menu"
            >
              <User className="size-4.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {email && (
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{email}</DropdownMenuLabel>
                </DropdownMenuGroup>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout.mutate()}>
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  )
}
