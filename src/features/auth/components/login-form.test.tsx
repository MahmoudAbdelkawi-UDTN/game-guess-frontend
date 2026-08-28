import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LoginForm } from '@/features/auth/components/login-form'
import { renderWithProviders, screen, waitFor } from '@/test/render-with-providers'
import { server } from '@/test/msw/server'

const API_BASE = 'http://localhost:5297'

function renderLoginFlow() {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/game" element={<div>Game screen</div>} />
    </Routes>,
    { initialEntries: ['/login'] },
  )
}

describe('LoginForm', () => {
  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    renderLoginFlow()

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it('shows an error message on invalid credentials', async () => {
    server.use(
      http.post(`${API_BASE}/api/auth/login`, () =>
        HttpResponse.json({ title: 'Invalid email or password.' }, { status: 401 }),
      ),
    )
    const user = userEvent.setup()
    renderLoginFlow()

    await user.type(screen.getByLabelText(/email/i), 'nobody@example.com')
    await user.type(screen.getByLabelText('Password', { exact: true }), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument()
    expect(screen.queryByText(/game screen/i)).not.toBeInTheDocument()
  })

  it('navigates to /game after a successful login', async () => {
    const user = userEvent.setup()
    renderLoginFlow()

    await user.type(screen.getByLabelText(/email/i), 'player@example.com')
    await user.type(screen.getByLabelText('Password', { exact: true }), 'Passw0rd123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/game screen/i)).toBeInTheDocument()
  })

  it('disables the submit button while the request is pending', async () => {
    server.use(
      http.post(`${API_BASE}/api/auth/login`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 50))
        return HttpResponse.json({ title: 'Invalid email or password.' }, { status: 401 })
      }),
    )
    const user = userEvent.setup()
    renderLoginFlow()

    await user.type(screen.getByLabelText(/email/i), 'player@example.com')
    await user.type(screen.getByLabelText('Password', { exact: true }), 'Passw0rd123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled())
  })
})
