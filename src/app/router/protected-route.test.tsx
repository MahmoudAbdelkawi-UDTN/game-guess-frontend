import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ProtectedRoute } from '@/app/router/protected-route'
import { useAuthStore } from '@/stores/auth-store'
import { act, renderWithProviders, screen } from '@/test/render-with-providers'

function renderProtected(initialEntries: string[]) {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<div>Login screen</div>} />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <div>Game screen</div>
          </ProtectedRoute>
        }
      />
    </Routes>,
    { initialEntries },
  )
}

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to /login', () => {
    renderProtected(['/game'])

    expect(screen.getByText(/login screen/i)).toBeInTheDocument()
    expect(screen.queryByText(/game screen/i)).not.toBeInTheDocument()
  })

  it('renders the protected content for authenticated users', () => {
    useAuthStore.getState().setAuth({
      userId: 'u1',
      email: 'player@example.com',
      accessToken: 'token',
      expiresAtUtc: '2099-01-01T00:00:00Z',
    })

    renderProtected(['/game'])

    expect(screen.getByText(/game screen/i)).toBeInTheDocument()
  })

  it('redirects to /login once the session ends while already on a protected route', () => {
    useAuthStore.getState().setAuth({
      userId: 'u1',
      email: 'player@example.com',
      accessToken: 'token',
      expiresAtUtc: '2099-01-01T00:00:00Z',
    })
    renderProtected(['/game'])
    expect(screen.getByText(/game screen/i)).toBeInTheDocument()

    act(() => useAuthStore.getState().clearAuth())

    expect(screen.getByText(/login screen/i)).toBeInTheDocument()
    expect(screen.queryByText(/game screen/i)).not.toBeInTheDocument()
  })
})
