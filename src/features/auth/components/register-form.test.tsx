import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { RegisterForm } from '@/features/auth/components/register-form'
import { renderWithProviders, screen } from '@/test/render-with-providers'
import { server } from '@/test/msw/server'

const API_BASE = 'http://localhost:5297'

function renderRegisterFlow() {
  return renderWithProviders(
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/game" element={<div>Game screen</div>} />
    </Routes>,
    { initialEntries: ['/register'] },
  )
}

describe('RegisterForm', () => {
  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    renderRegisterFlow()

    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/^password is required$/i)).toBeInTheDocument()
  })

  it('rejects a password missing complexity requirements', async () => {
    const user = userEvent.setup()
    renderRegisterFlow()

    await user.type(screen.getByLabelText(/^email$/i), 'weak@example.com')
    await user.type(screen.getByLabelText('Password', { exact: true }), 'alllowercase1')
    await user.type(screen.getByLabelText(/confirm password/i), 'alllowercase1')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/uppercase letter/i)).toBeInTheDocument()
  })

  it('rejects mismatched password confirmation', async () => {
    const user = userEvent.setup()
    renderRegisterFlow()

    await user.type(screen.getByLabelText(/^email$/i), 'player@example.com')
    await user.type(screen.getByLabelText('Password', { exact: true }), 'Passw0rd123')
    await user.type(screen.getByLabelText(/confirm password/i), 'Different123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/passwords don't match/i)).toBeInTheDocument()
  })

  it('shows a conflict error when the email is already registered', async () => {
    server.use(
      http.post(`${API_BASE}/api/auth/register`, () =>
        HttpResponse.json({ title: "Email 'dup@example.com' is already taken." }, { status: 409 }),
      ),
    )
    const user = userEvent.setup()
    renderRegisterFlow()

    await user.type(screen.getByLabelText(/^email$/i), 'dup@example.com')
    await user.type(screen.getByLabelText('Password', { exact: true }), 'Passw0rd123')
    await user.type(screen.getByLabelText(/confirm password/i), 'Passw0rd123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/already taken/i)).toBeInTheDocument()
  })

  it('navigates to /game after successful registration', async () => {
    const user = userEvent.setup()
    renderRegisterFlow()

    await user.type(screen.getByLabelText(/^email$/i), 'player@example.com')
    await user.type(screen.getByLabelText('Password', { exact: true }), 'Passw0rd123')
    await user.type(screen.getByLabelText(/confirm password/i), 'Passw0rd123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/game screen/i)).toBeInTheDocument()
  })
})
