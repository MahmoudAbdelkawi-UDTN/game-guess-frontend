import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { dashboardApi } from '@/features/dashboard/api/dashboard-api'
import { dashboardKeys } from '@/features/dashboard/api/query-keys'
import { useAuthStore } from '@/stores/auth-store'
import type { DateRangeFilter } from '@/types/api'

export function useGameHistory(filter: DateRangeFilter, page: number, pageSize: number) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: dashboardKeys.history(filter, page, pageSize),
    queryFn: () => dashboardApi.getHistory(filter, page, pageSize),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated,
  })
}
