import { Loader2, Target, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GAME_MAX, GAME_MIN } from '@/features/game/constants'

interface StartGamePanelProps {
  onStart: () => void
  isStarting: boolean
  personalBest?: number | null
  lastCompleted?: { guessCount: number } | null
}

export function StartGamePanel({ onStart, isStarting, personalBest, lastCompleted }: StartGamePanelProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Target className="size-8" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">
          {lastCompleted ? `Solved in ${lastCompleted.guessCount} guesses!` : 'Ready to play?'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {`Guess the secret number between ${GAME_MIN} and ${GAME_MAX}.`}
        </p>
      </div>

      {typeof personalBest === 'number' && (
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
          <Trophy className="size-4 text-primary" />
          Personal best: {personalBest} {personalBest === 1 ? 'guess' : 'guesses'}
        </div>
      )}

      <Button size="lg" onClick={onStart} disabled={isStarting} className="min-w-44">
        {isStarting && <Loader2 className="size-4 animate-spin" />}
        {lastCompleted ? 'Play again' : 'Start new game'}
      </Button>
    </div>
  )
}
