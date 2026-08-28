import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AuthResponse } from '@/types/api'

interface AuthUser {
  userId: string
  email: string
}

interface AuthState {
  accessToken: string | null
  expiresAtUtc: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (auth: AuthResponse) => void
  clearAuth: () => void
}

function isExpired(expiresAtUtc: string | null): boolean {
  return expiresAtUtc === null || Date.now() >= new Date(expiresAtUtc).getTime()
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      expiresAtUtc: null,
      user: null,
      isAuthenticated: false,
      setAuth: (auth) =>
        set({
          accessToken: auth.accessToken,
          expiresAtUtc: auth.expiresAtUtc,
          user: { userId: auth.userId, email: auth.email },
          isAuthenticated: true,
        }),
      clearAuth: () => set({ accessToken: null, expiresAtUtc: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'pinpoint-auth',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && state.isAuthenticated && isExpired(state.expiresAtUtc)) {
          state.clearAuth()
        }
      },
    },
  ),
)
