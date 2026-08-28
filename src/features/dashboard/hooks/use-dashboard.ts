import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/features/dashboard/api/dashboard-api'
import { dashboardKeys } from '@/features/dashboard/api/query-keys'
import { useAuthStore } from '@/stores/auth-store'
import type { DateRangeFilter } from '@/types/api'

export function useDashboard(filter: DateRangeFilter) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: dashboardKeys.dashboard(filter),
    queryFn: () => dashboardApi.getDashboard(filter),
    enabled: isAuthenticated,
  })
}
