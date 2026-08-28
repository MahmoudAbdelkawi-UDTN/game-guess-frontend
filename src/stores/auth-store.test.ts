import { describe, expect, it } from 'vitest'
import { useAuthStore } from '@/stores/auth-store'
import type { AuthResponse } from '@/types/api'

const authResponse: AuthResponse = {
  userId: 'user-1',
  email: 'player@example.com',
  accessToken: 'token-abc',
  expiresAtUtc: '2099-01-01T00:00:00Z',
}

describe('useAuthStore', () => {
  it('starts unauthenticated', () => {
    const state = useAuthStore.getState()

    expect(state.isAuthenticated).toBe(false)
    expect(state.accessToken).toBeNull()
    expect(state.user).toBeNull()
  })

  it('setAuth stores the token and user, and marks the session authenticated', () => {
    useAuthStore.getState().setAuth(authResponse)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.accessToken).toBe('token-abc')
    expect(state.user).toEqual({ userId: 'user-1', email: 'player@example.com' })
  })

  it('clearAuth resets the session back to unauthenticated', () => {
    useAuthStore.getState().setAuth(authResponse)

    useAuthStore.getState().clearAuth()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.accessToken).toBeNull()
    expect(state.user).toBeNull()
  })

  it('discards a persisted session whose token has already expired on rehydration', () => {
    window.localStorage.setItem(
      'pinpoint-auth',
      JSON.stringify({
        state: {
          accessToken: 'stale-token',
          expiresAtUtc: '2000-01-01T00:00:00Z',
          user: { userId: 'user-1', email: 'player@example.com' },
          isAuthenticated: true,
        },
        version: 0,
      }),
    )

    useAuthStore.persist.rehydrate()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.accessToken).toBeNull()
  })

  it('keeps a persisted session whose token has not expired yet on rehydration', () => {
    window.localStorage.setItem(
      'pinpoint-auth',
      JSON.stringify({
        state: {
          accessToken: 'still-good-token',
          expiresAtUtc: '2099-01-01T00:00:00Z',
          user: { userId: 'user-1', email: 'player@example.com' },
          isAuthenticated: true,
        },
        version: 0,
      }),
    )

    useAuthStore.persist.rehydrate()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.accessToken).toBe('still-good-token')
  })
})
