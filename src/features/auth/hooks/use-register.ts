import { useMutation } from '@tanstack/react-query'
import { authApi, type RegisterPayload } from '@/features/auth/api/auth-api'
import { useAuthStore } from '@/stores/auth-store'

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => setAuth(data),
  })
}
