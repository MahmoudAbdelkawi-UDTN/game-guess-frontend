import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { PublicOnlyRoute } from '@/app/router/public-only-route'
import { useAuthStore } from '@/stores/auth-store'
import { renderWithProviders, screen } from '@/test/render-with-providers'

function renderPublicOnly(initialEntries: string[]) {
  return renderWithProviders(
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <div>Login screen</div>
          </PublicOnlyRoute>
        }
      />
      <Route path="/game" element={<div>Game screen</div>} />
    </Routes>,
    { initialEntries },
  )
}

describe('PublicOnlyRoute', () => {
  it('renders the public content for unauthenticated users', () => {
    renderPublicOnly(['/login'])

    expect(screen.getByText(/login screen/i)).toBeInTheDocument()
  })

  it('redirects already-authenticated users away to /game', () => {
    useAuthStore.getState().setAuth({
      userId: 'u1',
      email: 'player@example.com',
      accessToken: 'token',
      expiresAtUtc: '2099-01-01T00:00:00Z',
    })

    renderPublicOnly(['/login'])

    expect(screen.getByText(/game screen/i)).toBeInTheDocument()
    expect(screen.queryByText(/login screen/i)).not.toBeInTheDocument()
  })
})
