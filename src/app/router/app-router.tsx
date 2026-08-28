import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './protected-route'
import { PublicOnlyRoute } from './public-only-route'

const LoginPage = lazy(() => import('@/features/auth/pages/login-page').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/register-page').then((m) => ({ default: m.RegisterPage })),
)
const GamePage = lazy(() => import('@/features/game/pages/game-page').then((m) => ({ default: m.GamePage })))
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/dashboard-page').then((m) => ({ default: m.DashboardPage })),
)

function RouteFallback() {
  return <div className="min-h-svh bg-background" aria-hidden="true" />
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/game" replace />} />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
