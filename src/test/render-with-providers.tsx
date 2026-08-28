import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  })
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries = ['/'], queryClient = createTestQueryClient(), ...renderOptions }: RenderWithProvidersOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
