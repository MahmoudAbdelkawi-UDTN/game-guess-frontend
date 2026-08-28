import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/features/auth/api/auth-api'
import { useAuthStore } from '@/stores/auth-store'

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => clearAuth(),
  })
}
