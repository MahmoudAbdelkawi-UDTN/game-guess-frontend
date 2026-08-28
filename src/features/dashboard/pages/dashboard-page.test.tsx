import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page'
import { mockAuthResponse, mockDashboard, mockHistory } from '@/test/msw/handlers'
import { server } from '@/test/msw/server'
import { renderWithProviders, screen, waitFor, within } from '@/test/render-with-providers'
import { useAuthStore } from '@/stores/auth-store'
import type { Dashboard, DateRangeFilter, PagedResult } from '@/types/api'
import type { GameHistoryItem } from '@/types/api'

const API_BASE = 'http://localhost:5297'

beforeEach(() => useAuthStore.getState().setAuth(mockAuthResponse))

describe('DashboardPage', () => {
  it('renders statistics, top games, and history once loaded', async () => {
    renderWithProviders(<DashboardPage />)

    const personalBestCard = (await screen.findByText('Personal best')).closest('[data-slot="card"]')
    expect(within(personalBestCard as HTMLElement).getByText('4')).toBeInTheDocument()

    const totalGamesCard = screen.getByText('Total games').closest('[data-slot="card"]')
    expect(within(totalGamesCard as HTMLElement).getByText('12')).toBeInTheDocument()

    const averageCard = screen.getByText('Average guesses').closest('[data-slot="card"]')
    expect(within(averageCard as HTMLElement).getByText('6.5')).toBeInTheDocument()

    expect(screen.getByText(/top 3 best games/i)).toBeInTheDocument();
    ['17', '30'].forEach((secret) => expect(screen.getByText(secret)).toBeInTheDocument())
  })

  it('flags the personal-best game in the history table', async () => {
    renderWithProviders(<DashboardPage />)

    const rows = await screen.findAllByRole('row')
    const bestRow = rows.find((row) => within(row).queryByText('17'))
    expect(bestRow).toBeDefined()
    expect(within(bestRow!).getByText(/best/i)).toBeInTheDocument()
  })

  it('shows an empty state when there is no history in range', async () => {
    const empty: PagedResult<GameHistoryItem> = { items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 }
    server.use(http.get(`${API_BASE}/api/games/history`, () => HttpResponse.json(empty)))

    renderWithProviders(<DashboardPage />)

    expect(await screen.findByText(/no completed games in this range yet/i)).toBeInTheDocument()
  })

  it('shows an empty state on the chart when there are no top games', async () => {
    const emptyDashboard: Dashboard = { stats: { personalBest: null, totalCompletedGames: 0, averageGuesses: null }, topGames: [] }
    server.use(http.get(`${API_BASE}/api/dashboard`, () => HttpResponse.json(emptyDashboard)))

    renderWithProviders(<DashboardPage />)

    expect(await screen.findByText(/finish a game to see your best runs here/i)).toBeInTheDocument()
  })

  it('shows an error state with retry when statistics fail to load', async () => {
    server.use(http.get(`${API_BASE}/api/dashboard`, () => HttpResponse.error()))

    renderWithProviders(<DashboardPage />)

    expect(await screen.findByText(/couldn't load your dashboard/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('re-requests dashboard and history data when the date filter changes', async () => {
    const requestedFilters: DateRangeFilter[] = []
    server.use(
      http.get(`${API_BASE}/api/dashboard`, ({ request }) => {
        const filter = new URL(request.url).searchParams.get('filter') as DateRangeFilter
        requestedFilters.push(filter)
        return HttpResponse.json(mockDashboard)
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<DashboardPage />)

    await screen.findByText(/top 3 best games/i)
    await user.click(screen.getByRole('button', { name: /^today$/i }))

    await waitFor(() => expect(requestedFilters).toContain('Today'))
  })

  it('resets to page 1 when the date filter changes', async () => {
    const requestedPages: number[] = []
    server.use(
      http.get(`${API_BASE}/api/games/history`, ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get('page'))
        requestedPages.push(page)
        return HttpResponse.json(mockHistory)
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<DashboardPage />)

    await screen.findByText(/^game history$/i)
    await user.click(screen.getByRole('button', { name: /last 7 days/i }))

    await waitFor(() => expect(requestedPages[requestedPages.length - 1]).toBe(1))
  })
})
