import { Target } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-muted/40 to-background">
      <header className="px-6 py-6 sm:px-10">
        <Link to="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Target className="size-4.5" />
          </span>
          <span className="text-lg">Pinpoint</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">{children}</div>

          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </main>
    </div>
  )
}
