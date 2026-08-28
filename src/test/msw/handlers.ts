import { HttpResponse, http } from 'msw'
import type { AuthResponse, Dashboard, GameHistoryItem, GameState, GuessResult, PagedResult } from '@/types/api'

const API_BASE = 'http://localhost:5297'

export const mockAuthResponse: AuthResponse = {
  userId: 'user-1',
  email: 'player@example.com',
  accessToken: 'mock-access-token',
  expiresAtUtc: '2099-01-01T00:00:00Z',
}

export const mockGameState: GameState = {
  gameId: 'game-1',
  guessCount: 0,
  lowerBound: 1,
  upperBound: 43,
  status: 'InProgress',
  startedAt: '2026-01-01T00:00:00Z',
}

export const mockDashboard: Dashboard = {
  stats: { personalBest: 4, totalCompletedGames: 12, averageGuesses: 6.5 },
  topGames: [
    { gameId: 'g1', guessCount: 3, completedAt: '2026-01-05T10:00:00Z' },
    { gameId: 'g2', guessCount: 4, completedAt: '2026-01-04T10:00:00Z' },
    { gameId: 'g3', guessCount: 6, completedAt: '2026-01-03T10:00:00Z' },
  ],
}

export const mockHistory: PagedResult<GameHistoryItem> = {
  items: [
    { gameId: 'g1', secretNumber: 17, guessCount: 3, completedAt: '2026-01-05T10:00:00Z', isPersonalBest: true },
    { gameId: 'g2', secretNumber: 30, guessCount: 4, completedAt: '2026-01-04T10:00:00Z', isPersonalBest: false },
  ],
  totalCount: 2,
  page: 1,
  pageSize: 10,
  totalPages: 1,
}

export const handlers = [
  http.post(`${API_BASE}/api/auth/register`, () => HttpResponse.json(mockAuthResponse)),
  http.post(`${API_BASE}/api/auth/login`, () => HttpResponse.json(mockAuthResponse)),
  http.post(`${API_BASE}/api/auth/logout`, () => new HttpResponse(null, { status: 204 })),

  http.post(`${API_BASE}/api/games`, () => HttpResponse.json(mockGameState)),
  http.get(`${API_BASE}/api/games/current`, () => HttpResponse.json(null)),
  http.post<{ gameId: string }>(`${API_BASE}/api/games/:gameId/guesses`, () =>
    HttpResponse.json<GuessResult>({
      gameId: 'game-1',
      result: 'HIGHER',
      guessCount: 1,
      lowerBound: 16,
      upperBound: 43,
      isGameOver: false,
      isNewPersonalBest: false,
      personalBest: null,
    }),
  ),

  http.get(`${API_BASE}/api/dashboard`, () => HttpResponse.json(mockDashboard)),
  http.get(`${API_BASE}/api/games/history`, () => HttpResponse.json(mockHistory)),
]
