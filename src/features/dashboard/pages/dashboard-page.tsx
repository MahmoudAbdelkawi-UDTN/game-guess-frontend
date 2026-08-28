import { useState } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { ErrorState } from '@/components/error-state'
import { DateFilterToggle } from '@/features/dashboard/components/date-filter-toggle'
import { HistoryTable, HistoryTableSkeleton } from '@/features/dashboard/components/history-table'
import { StatsCards, StatsCardsSkeleton } from '@/features/dashboard/components/stats-cards'
import { TopGamesChart, TopGamesChartSkeleton } from '@/features/dashboard/components/top-games-chart'
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import { useGameHistory } from '@/features/dashboard/hooks/use-game-history'
import type { DateRangeFilter } from '@/types/api'

const PAGE_SIZE = 10

export function DashboardPage() {
  const [filter, setFilter] = useState<DateRangeFilter>('AllTime')
  const [page, setPage] = useState(1)

  const dashboard = useDashboard(filter)
  const history = useGameHistory(filter, page, PAGE_SIZE)

  const handleFilterChange = (next: DateRangeFilter) => {
    setFilter(next)
    setPage(1)
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your stats, best runs, and full game history.</p>
          </div>
          <DateFilterToggle value={filter} onChange={handleFilterChange} />
        </div>

        {dashboard.isLoading ? (
          <>
            <StatsCardsSkeleton />
            <TopGamesChartSkeleton />
          </>
        ) : dashboard.isError ? (
          <ErrorState message="Couldn't load your dashboard." onRetry={() => dashboard.refetch()} />
        ) : dashboard.data ? (
          <>
            <StatsCards stats={dashboard.data.stats} />
            <TopGamesChart topGames={dashboard.data.topGames} />
          </>
        ) : null}

        {history.isLoading ? (
          <HistoryTableSkeleton />
        ) : history.isError ? (
          <ErrorState message="Couldn't load your game history." onRetry={() => history.refetch()} />
        ) : history.data ? (
          <HistoryTable history={history.data} page={page} onPageChange={setPage} />
        ) : null}
      </div>
    </AppShell>
  )
}
