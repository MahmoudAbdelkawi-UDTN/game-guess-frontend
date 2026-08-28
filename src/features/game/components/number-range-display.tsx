import { GAME_MAX, GAME_MIN } from '@/features/game/constants'

interface NumberRangeDisplayProps {
  lowerBound: number
  upperBound: number
}

export function NumberRangeDisplay({ lowerBound, upperBound }: NumberRangeDisplayProps) {
  const span = GAME_MAX - GAME_MIN
  const leftPct = ((lowerBound - GAME_MIN) / span) * 100
  const widthPct = ((upperBound - lowerBound) / span) * 100

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{GAME_MIN}</span>
        <span>Possible range</span>
        <span>{GAME_MAX}</span>
      </div>

      <div className="relative h-3 w-full rounded-full bg-muted">
        <div
          className="absolute inset-y-0 rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 2)}%` }}
        />
      </div>

      <div className="relative mt-2 h-5 text-sm font-semibold text-foreground">
        <span
          className="absolute -translate-x-1/2 transition-all duration-500 ease-out"
          style={{ left: `${leftPct}%` }}
        >
          {lowerBound}
        </span>
        <span
          className="absolute -translate-x-1/2 transition-all duration-500 ease-out"
          style={{ left: `${leftPct + widthPct}%` }}
        >
          {upperBound}
        </span>
      </div>
    </div>
  )
}
