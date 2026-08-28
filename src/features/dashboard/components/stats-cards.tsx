import { Gamepad2, Target, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardStats } from '@/types/api'

interface StatCardProps {
  label: string
  value: ReactNode
  icon: typeof Target
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="size-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
      </CardContent>
    </Card>
  )
}

export function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Personal best"
        icon={Target}
        value={stats.personalBest ?? '—'}
      />
      <StatCard label="Total games" icon={Gamepad2} value={stats.totalCompletedGames} />
      <StatCard
        label="Average guesses"
        icon={TrendingUp}
        value={stats.averageGuesses !== null ? stats.averageGuesses.toFixed(1) : '—'}
      />
    </div>
  )
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
