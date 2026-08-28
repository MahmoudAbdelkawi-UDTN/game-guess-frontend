import { Trophy } from 'lucide-react'
import { useState } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { ErrorState } from '@/components/error-state'
import { GameSkeleton } from '@/features/game/components/game-skeleton'
import { GuessFeedbackBanner } from '@/features/game/components/guess-feedback-banner'
import { GuessForm } from '@/features/game/components/guess-form'
import { NumberRangeDisplay } from '@/features/game/components/number-range-display'
import { PersonalBestCelebration } from '@/features/game/components/personal-best-celebration'
import { StartGamePanel } from '@/features/game/components/start-game-panel'
import { useCurrentGame } from '@/features/game/hooks/use-current-game'
import { useStartGame } from '@/features/game/hooks/use-start-game'
import { useSubmitGuess } from '@/features/game/hooks/use-submit-guess'
import { useDashboard } from '@/features/dashboard/hooks/use-dashboard'
import type { GuessResult } from '@/types/api'

export function GamePage() {
  const currentGame = useCurrentGame()
  const dashboard = useDashboard('AllTime')
  const startGame = useStartGame()
  const submitGuess = useSubmitGuess(currentGame.data?.gameId ?? '')

  const [lastResult, setLastResult] = useState<GuessResult | null>(null)
  const [lastGuessedNumber, setLastGuessedNumber] = useState<number | null>(null)
  const [celebrationOpen, setCelebrationOpen] = useState(false)

  const handleStart = () => {
    setLastResult(null)
    setLastGuessedNumber(null)
    startGame.mutate()
  }

  const handleGuess = (number: number) => {
    submitGuess.mutate(number, {
      onSuccess: (result) => {
        setLastResult(result)
        setLastGuessedNumber(number)
        if (result.isGameOver && result.isNewPersonalBest) {
          setCelebrationOpen(true)
        }
      },
    })
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Guess the number</h1>
          {typeof dashboard.data?.stats.personalBest === 'number' && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Trophy className="size-4 text-primary" />
              Best: {dashboard.data.stats.personalBest}
            </span>
          )}
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
          {currentGame.isLoading ? (
            <GameSkeleton />
          ) : currentGame.isError ? (
            <ErrorState message="Couldn't load your game." onRetry={() => currentGame.refetch()} />
          ) : currentGame.data ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Attempt <span className="font-semibold text-foreground">{currentGame.data.guessCount + 1}</span>
                </span>
                {typeof dashboard.data?.stats.personalBest === 'number' && (
                  <span className="flex items-center gap-1.5">
                    <Trophy className="size-3.5 text-primary" />
                    Best: {dashboard.data.stats.personalBest}
                  </span>
                )}
              </div>

              <NumberRangeDisplay lowerBound={currentGame.data.lowerBound} upperBound={currentGame.data.upperBound} />

              {lastResult &&
                lastGuessedNumber !== null &&
                lastResult.gameId === currentGame.data.gameId &&
                !lastResult.isGameOver && (
                  <GuessFeedbackBanner result={lastResult.result} lastGuess={lastGuessedNumber} />
                )}

              <GuessForm
                lowerBound={currentGame.data.lowerBound}
                upperBound={currentGame.data.upperBound}
                disabled={submitGuess.isPending}
                onSubmit={handleGuess}
              />

              {submitGuess.isError && <ErrorState message={submitGuess.error.message} />}
            </div>
          ) : (
            <StartGamePanel
              onStart={handleStart}
              isStarting={startGame.isPending}
              personalBest={dashboard.data?.stats.personalBest}
              lastCompleted={lastResult?.isGameOver ? { guessCount: lastResult.guessCount } : null}
            />
          )}
        </div>
      </div>

      {lastResult && (
        <PersonalBestCelebration
          open={celebrationOpen}
          guessCount={lastResult.guessCount}
          onOpenChange={setCelebrationOpen}
          onPlayAgain={() => {
            setCelebrationOpen(false)
            handleStart()
          }}
        />
      )}
    </AppShell>
  )
}
