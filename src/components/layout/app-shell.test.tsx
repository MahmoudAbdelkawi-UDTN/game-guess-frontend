import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppShell } from '@/components/layout/app-shell'
import { useAuthStore } from '@/stores/auth-store'
import { renderWithProviders, screen, waitFor } from '@/test/render-with-providers'

beforeEach(() =>
  useAuthStore.getState().setAuth({
    userId: 'u1',
    email: 'player@example.com',
    accessToken: 'token',
    expiresAtUtc: '2099-01-01T00:00:00Z',
  }),
)

describe('AppShell profile menu', () => {
  it('opens without throwing and shows the account email and log out item', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <AppShell>
        <div>Page content</div>
      </AppShell>,
    )

    await user.click(screen.getByRole('button', { name: /account menu/i }))

    expect(await screen.findByText('player@example.com')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /log out/i })).toBeInTheDocument()
  })

  it('logs out and clears the authenticated session when "Log out" is selected', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <AppShell>
        <div>Page content</div>
      </AppShell>,
    )

    await user.click(screen.getByRole('button', { name: /account menu/i }))
    await user.click(await screen.findByRole('menuitem', { name: /log out/i }))

    await waitFor(() => expect(useAuthStore.getState().isAuthenticated).toBe(false))
    expect(useAuthStore.getState().accessToken).toBeNull()
  })
})
