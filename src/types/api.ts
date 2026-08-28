export type DateRangeFilter = 'Today' | 'Last7Days' | 'Last30Days' | 'AllTime'

export interface AuthResponse {
  userId: string
  email: string
  accessToken: string
  expiresAtUtc: string
}

export type GameStatus = 'InProgress' | 'Completed'

export interface GameState {
  gameId: string
  guessCount: number
  lowerBound: number
  upperBound: number
  status: GameStatus
  startedAt: string
}

export type GuessOutcome = 'HIGHER' | 'LOWER' | 'CORRECT'

export interface GuessResult {
  gameId: string
  result: GuessOutcome
  guessCount: number
  lowerBound: number
  upperBound: number
  isGameOver: boolean
  isNewPersonalBest: boolean
  personalBest: number | null
}

export interface GameHistoryItem {
  gameId: string
  secretNumber: number
  guessCount: number
  completedAt: string
  isPersonalBest: boolean
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface TopGame {
  gameId: string
  guessCount: number
  completedAt: string
}

export interface DashboardStats {
  personalBest: number | null
  totalCompletedGames: number
  averageGuesses: number | null
}

export interface Dashboard {
  stats: DashboardStats
  topGames: TopGame[]
}

export interface ApiProblemDetails {
  type?: string
  title?: string
  status?: number
  instance?: string
  errors?: Record<string, string[]>
}
