import { apiClient } from '@/lib/api-client'
import type { AuthResponse } from '@/types/api'

export interface RegisterPayload {
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/api/auth/register', payload).then((r) => r.data),

  login: (payload: LoginPayload) => apiClient.post<AuthResponse>('/api/auth/login', payload).then((r) => r.data),

  logout: () => apiClient.post<void>('/api/auth/logout'),
}
