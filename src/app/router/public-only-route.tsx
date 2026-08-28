import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/game" replace />
  }

  return children
}
