import { AlertTriangle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
      <AlertTriangle className="size-8 text-destructive" />
      <div className="space-y-1">
        <p className="font-medium text-foreground">{title}</p>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          <RotateCw className="size-3.5" />
          Try again
        </Button>
      )}
    </div>
  )
}
