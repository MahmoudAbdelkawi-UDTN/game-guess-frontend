import { ArrowDown, ArrowUp, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GuessOutcome } from '@/types/api'

interface GuessFeedbackBannerProps {
  result: GuessOutcome
  lastGuess: number
}

const CONFIG: Record<GuessOutcome, { label: string; className: string; icon: typeof ArrowUp }> = {
  HIGHER: {
    label: 'Go higher',
    className: 'border-primary/20 bg-primary/5 text-primary',
    icon: ArrowUp,
  },
  LOWER: {
    label: 'Go lower',
    className: 'border-primary/20 bg-primary/5 text-primary',
    icon: ArrowDown,
  },
  CORRECT: {
    label: 'Correct!',
    className: 'border-success/30 bg-success/10 text-success',
    icon: CheckCircle2,
  },
}

export function GuessFeedbackBanner({ result, lastGuess }: GuessFeedbackBannerProps) {
  const { label, className, icon: Icon } = CONFIG[result]

  return (
    <div
      key={`${result}-${lastGuess}`}
      role="status"
      className={cn(
        'flex animate-in items-center gap-3 rounded-lg border px-4 py-3 fade-in slide-in-from-top-1 duration-300',
        className,
      )}
    >
      <Icon className="size-5 shrink-0" />
      <p className="text-sm font-medium">
        {label}
        <span className="ml-1 font-normal text-muted-foreground">- you guessed {lastGuess}</span>
      </p>
    </div>
  )
}
