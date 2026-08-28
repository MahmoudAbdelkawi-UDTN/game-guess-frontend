import { useQuery } from '@tanstack/react-query'
import { gameApi } from '@/features/game/api/game-api'
import { gameKeys } from '@/features/game/api/query-keys'
import { useAuthStore } from '@/stores/auth-store'

export function useCurrentGame() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: gameKeys.current,
    queryFn: gameApi.getCurrentGame,
    enabled: isAuthenticated,
  })
}
