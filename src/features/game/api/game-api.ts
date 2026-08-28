import { apiClient } from '@/lib/api-client'
import type { GameState, GuessResult } from '@/types/api'

export const gameApi = {
  startGame: () => apiClient.post<GameState>('/api/games').then((r) => r.data),

  getCurrentGame: () => apiClient.get<GameState | null>('/api/games/current').then((r) => r.data || null),

  submitGuess: (gameId: string, number: number) =>
    apiClient.post<GuessResult>(`/api/games/${gameId}/guesses`, { number }).then((r) => r.data),
}
