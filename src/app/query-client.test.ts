import { describe, expect, it } from 'vitest'
import { queryClient } from '@/app/query-client'
import { useAuthStore } from '@/stores/auth-store'

describe('queryClient auth subscription', () => {
  it('clears cached data once the session ends, regardless of what ended it', () => {
    useAuthStore.getState().setAuth({
      userId: 'u1',
      email: 'player@example.com',
      accessToken: 'token',
      expiresAtUtc: '2099-01-01T00:00:00Z',
    })
    queryClient.setQueryData(['dashboard', 'AllTime'], { stats: { personalBest: 4 } })
    expect(queryClient.getQueryData(['dashboard', 'AllTime'])).toBeDefined()

    useAuthStore.getState().clearAuth()

    expect(queryClient.getQueryData(['dashboard', 'AllTime'])).toBeUndefined()
  })

  it('does not clear the cache while the session stays authenticated', () => {
    useAuthStore.getState().setAuth({
      userId: 'u1',
      email: 'player@example.com',
      accessToken: 'token',
      expiresAtUtc: '2099-01-01T00:00:00Z',
    })
    queryClient.setQueryData(['games', 'current'], { gameId: 'g1' })

    useAuthStore.getState().setAuth({
      userId: 'u1',
      email: 'player@example.com',
      accessToken: 'token-2',
      expiresAtUtc: '2099-01-01T00:00:00Z',
    })

    expect(queryClient.getQueryData(['games', 'current'])).toBeDefined()
  })
})
