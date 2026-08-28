import type { DateRangeFilter } from '@/types/api'

export const dashboardKeys = {
  dashboard: (filter: DateRangeFilter) => ['dashboard', filter] as const,
  history: (filter: DateRangeFilter, page: number, pageSize: number) =>
    ['game-history', filter, page, pageSize] as const,
}
