import { useMutation, useQueryClient } from '@tanstack/react-query'
import { gameApi } from '@/features/game/api/game-api'
import { gameKeys } from '@/features/game/api/query-keys'

export function useStartGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: gameApi.startGame,
    onSuccess: (game) => {
      queryClient.setQueryData(gameKeys.current, game)
    },
  })
}
