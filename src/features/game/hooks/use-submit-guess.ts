import { useMutation, useQueryClient } from '@tanstack/react-query'
import { gameApi } from '@/features/game/api/game-api'
import { gameKeys } from '@/features/game/api/query-keys'
import type { GameState } from '@/types/api'

export function useSubmitGuess(gameId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (number: number) => gameApi.submitGuess(gameId, number),
    onSuccess: (result) => {
      if (result.isGameOver) {
        queryClient.setQueryData(gameKeys.current, null)
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        queryClient.invalidateQueries({ queryKey: ['game-history'] })
        return
      }

      queryClient.setQueryData<GameState>(gameKeys.current, (current) =>
        current
          ? {
              ...current,
              guessCount: result.guessCount,
              lowerBound: result.lowerBound,
              upperBound: result.upperBound,
            }
          : current,
      )
    },
  })
}
