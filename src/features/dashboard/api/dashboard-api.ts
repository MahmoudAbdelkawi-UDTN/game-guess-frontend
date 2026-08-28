import { apiClient } from '@/lib/api-client'
import type { Dashboard, DateRangeFilter, GameHistoryItem, PagedResult } from '@/types/api'

export const dashboardApi = {
  getDashboard: (filter: DateRangeFilter) =>
    apiClient.get<Dashboard>('/api/dashboard', { params: { filter } }).then((r) => r.data),

  getHistory: (filter: DateRangeFilter, page: number, pageSize: number) =>
    apiClient
      .get<PagedResult<GameHistoryItem>>('/api/games/history', { params: { filter, page, pageSize } })
      .then((r) => r.data),
}
