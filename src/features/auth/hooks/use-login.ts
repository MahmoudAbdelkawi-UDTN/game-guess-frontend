import { useMutation } from '@tanstack/react-query'
import { authApi, type LoginPayload } from '@/features/auth/api/auth-api'
import { useAuthStore } from '@/stores/auth-store'

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => setAuth(data),
  })
}
