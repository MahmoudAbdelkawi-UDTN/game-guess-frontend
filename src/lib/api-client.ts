import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import type { ApiProblemDetails } from '@/types/api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5297',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export class ApiError extends Error {
  readonly status: number | undefined
  readonly fieldErrors: Record<string, string[]> | undefined

  constructor(message: string, status: number | undefined, fieldErrors: Record<string, string[]> | undefined) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiProblemDetails>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
    }

    const problem = error.response?.data
    const message = problem?.title ?? error.message ?? 'Something went wrong. Please try again.'

    return Promise.reject(new ApiError(message, error.response?.status, problem?.errors))
  },
)
