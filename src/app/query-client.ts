import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status !== undefined && error.status < 500) {
          return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

useAuthStore.subscribe((state, prevState) => {
  if (prevState.isAuthenticated && !state.isAuthenticated) {
    queryClient.clear()
  }
})
