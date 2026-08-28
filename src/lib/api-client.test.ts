import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { apiClient } from '@/lib/api-client'
import { server } from '@/test/msw/server'
import { useAuthStore } from '@/stores/auth-store'

const API_BASE = 'http://localhost:5297'

describe('apiClient', () => {
  it('attaches the current access token as a Bearer Authorization header', async () => {
    useAuthStore.getState().setAuth({
      userId: 'u1',
      email: 'player@example.com',
      accessToken: 'the-current-token',
      expiresAtUtc: '2099-01-01T00:00:00Z',
    })

    let receivedAuthHeader: string | null = null
    server.use(
      http.get(`${API_BASE}/api/dashboard`, ({ request }) => {
        receivedAuthHeader = request.headers.get('authorization')
        return HttpResponse.json({ stats: { personalBest: null, totalCompletedGames: 0, averageGuesses: null }, topGames: [] })
      }),
    )

    await apiClient.get('/api/dashboard')

    expect(receivedAuthHeader).toBe('Bearer the-current-token')
  })

  it('does not send an Authorization header when there is no session', async () => {
    let receivedAuthHeader: string | null | undefined
    server.use(
      http.get(`${API_BASE}/api/dashboard`, ({ request }) => {
        receivedAuthHeader = request.headers.get('authorization')
        return HttpResponse.json({ stats: { personalBest: null, totalCompletedGames: 0, averageGuesses: null }, topGames: [] })
      }),
    )

    await apiClient.get('/api/dashboard')

    expect(receivedAuthHeader).toBeNull()
  })

  it('reads the token at request time rather than a stale value captured earlier', async () => {
    const staleAccessorSnapshot = useAuthStore.getState().accessToken
    expect(staleAccessorSnapshot).toBeNull()

    useAuthStore.getState().setAuth({
      userId: 'u1',
      email: 'player@example.com',
      accessToken: 'freshly-issued-token',
      expiresAtUtc: '2099-01-01T00:00:00Z',
    })

    let receivedAuthHeader: string | null = null
    server.use(
      http.get(`${API_BASE}/api/games/current`, ({ request }) => {
        receivedAuthHeader = request.headers.get('authorization')
        return HttpResponse.json(null)
      }),
    )

    await apiClient.get('/api/games/current')

    expect(receivedAuthHeader).toBe('Bearer freshly-issued-token')
  })

  it('clears the session when a request comes back 401', async () => {
    useAuthStore.getState().setAuth({
      userId: 'u1',
      email: 'player@example.com',
      accessToken: 'now-invalid-token',
      expiresAtUtc: '2099-01-01T00:00:00Z',
    })
    server.use(http.get(`${API_BASE}/api/dashboard`, () => HttpResponse.json({ title: 'Unauthorized' }, { status: 401 })))

    await expect(apiClient.get('/api/dashboard')).rejects.toThrow()

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().accessToken).toBeNull()
  })
})
