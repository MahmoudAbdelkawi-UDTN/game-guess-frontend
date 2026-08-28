import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { GamePage } from '@/features/game/pages/game-page'
import { server } from '@/test/msw/server'
import { mockAuthResponse, mockGameState } from '@/test/msw/handlers'
import { renderWithProviders, screen, waitFor, within } from '@/test/render-with-providers'
import { useAuthStore } from '@/stores/auth-store'
import type { GuessResult } from '@/types/api'

const API_BASE = 'http://localhost:5297'

beforeEach(() => useAuthStore.getState().setAuth(mockAuthResponse))

function mockGuessResponse(overrides: Partial<GuessResult>) {
  server.use(
    http.post(`${API_BASE}/api/games/:gameId/guesses`, () =>
      HttpResponse.json<GuessResult>({
        gameId: mockGameState.gameId,
        result: 'HIGHER',
        guessCount: 1,
        lowerBound: 1,
        upperBound: 43,
        isGameOver: false,
        isNewPersonalBest: false,
        personalBest: null,
        ...overrides,
      }),
    ),
  )
}

describe('GamePage', () => {
  it('shows the "start new game" panel with the personal best when there is no active game', async () => {
    server.use(http.get(`${API_BASE}/api/games/current`, () => HttpResponse.json(null)))
    renderWithProviders(<GamePage />)

    expect(await screen.findByRole('button', { name: /start new game/i })).toBeInTheDocument()
    expect(screen.getByText(/personal best: 4 guesses/i)).toBeInTheDocument()
  })

  it('starts a new game and shows the in-progress board', async () => {
    server.use(http.get(`${API_BASE}/api/games/current`, () => HttpResponse.json(null)))
    const user = userEvent.setup()
    renderWithProviders(<GamePage />)

    await user.click(await screen.findByRole('button', { name: /start new game/i }))

    expect(await screen.findByPlaceholderText(/guess between 1 and 43/i)).toBeInTheDocument()
    expect(screen.getByText(/attempt/i)).toBeInTheDocument()
  })

  it('resumes an already in-progress game on load', async () => {
    server.use(http.get(`${API_BASE}/api/games/current`, () => HttpResponse.json(mockGameState)))
    renderWithProviders(<GamePage />)

    expect(await screen.findByPlaceholderText(/guess between 1 and 43/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /start new game/i })).not.toBeInTheDocument()
  })

  it('shows a HIGHER banner and narrows the range', async () => {
    server.use(http.get(`${API_BASE}/api/games/current`, () => HttpResponse.json(mockGameState)))
    mockGuessResponse({ result: 'HIGHER', guessCount: 1, lowerBound: 16, upperBound: 43 })
    const user = userEvent.setup()
    renderWithProviders(<GamePage />)

    const input = await screen.findByPlaceholderText(/guess between 1 and 43/i)
    await user.type(input, '15')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))

    expect(await screen.findByText(/go higher/i)).toBeInTheDocument()
    expect(screen.getByText(/you guessed 15/i)).toBeInTheDocument()
  })

  it('shows a LOWER banner', async () => {
    server.use(http.get(`${API_BASE}/api/games/current`, () => HttpResponse.json(mockGameState)))
    mockGuessResponse({ result: 'LOWER', guessCount: 1, lowerBound: 1, upperBound: 29 })
    const user = userEvent.setup()
    renderWithProviders(<GamePage />)

    const input = await screen.findByPlaceholderText(/guess between 1 and 43/i)
    await user.type(input, '30')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))

    expect(await screen.findByText(/go lower/i)).toBeInTheDocument()
    expect(screen.getByText(/you guessed 30/i)).toBeInTheDocument()
  })

  it('handles a CORRECT guess and celebrates a new personal best', async () => {
    server.use(http.get(`${API_BASE}/api/games/current`, () => HttpResponse.json(mockGameState)))
    mockGuessResponse({
      result: 'CORRECT',
      guessCount: 3,
      isGameOver: true,
      isNewPersonalBest: true,
      personalBest: 3,
    })
    const user = userEvent.setup()
    renderWithProviders(<GamePage />)

    const input = await screen.findByPlaceholderText(/guess between 1 and 43/i)
    await user.type(input, '20')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))

    expect(await screen.findByText(/new personal best/i)).toBeInTheDocument()
    expect(screen.getByText(/solved it in just/i)).toBeInTheDocument()
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('3')).toBeInTheDocument()
  })

  it('rejects an out-of-range guess client-side without calling the API', async () => {
    server.use(http.get(`${API_BASE}/api/games/current`, () => HttpResponse.json(mockGameState)))
    let guessCalled = false
    server.use(
      http.post(`${API_BASE}/api/games/:gameId/guesses`, () => {
        guessCalled = true
        return HttpResponse.json({}, { status: 200 })
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<GamePage />)

    const input = await screen.findByPlaceholderText(/guess between 1 and 43/i)
    await user.type(input, '99')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))

    expect(await screen.findByText(/must be at most 43/i)).toBeInTheDocument()
    expect(guessCalled).toBe(false)
  })

  it('disables the guess button while a guess is submitting', async () => {
    server.use(http.get(`${API_BASE}/api/games/current`, () => HttpResponse.json(mockGameState)))
    server.use(
      http.post(`${API_BASE}/api/games/:gameId/guesses`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        return HttpResponse.json<GuessResult>({
          gameId: mockGameState.gameId,
          result: 'HIGHER',
          guessCount: 1,
          lowerBound: 1,
          upperBound: 43,
          isGameOver: false,
          isNewPersonalBest: false,
          personalBest: null,
        })
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<GamePage />)

    const input = await screen.findByPlaceholderText(/guess between 1 and 43/i)
    await user.type(input, '20')
    await user.click(screen.getByRole('button', { name: /^guess$/i }))

    await waitFor(() => expect(screen.getByRole('button', { name: /^guess$/i })).toBeDisabled())
  })

  it('shows an error state when the current game fails to load', async () => {
    server.use(http.get(`${API_BASE}/api/games/current`, () => HttpResponse.error()))
    renderWithProviders(<GamePage />)

    expect(await screen.findByText(/couldn't load your game/i)).toBeInTheDocument()
  })

  it('does not request protected data once the session is gone', async () => {
    useAuthStore.getState().clearAuth()
    let requested = false
    server.use(
      http.get(`${API_BASE}/api/games/current`, () => {
        requested = true
        return HttpResponse.json(mockGameState)
      }),
    )

    renderWithProviders(<GamePage />)
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(requested).toBe(false)
  })
})
