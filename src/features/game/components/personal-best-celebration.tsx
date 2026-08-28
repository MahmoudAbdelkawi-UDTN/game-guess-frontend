import { PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface PersonalBestCelebrationProps {
  open: boolean
  guessCount: number
  onOpenChange: (open: boolean) => void
  onPlayAgain: () => void
}

export function PersonalBestCelebration({ open, guessCount, onOpenChange, onPlayAgain }: PersonalBestCelebrationProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center sm:max-w-sm">
        <DialogHeader className="items-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PartyPopper className="size-7" />
          </div>
          <DialogTitle className="text-xl">New personal best!</DialogTitle>
          <DialogDescription className="text-base">
            You solved it in just <span className="font-semibold text-foreground">{guessCount}</span>{' '}
            {guessCount === 1 ? 'guess' : 'guesses'}. That&apos;s your new record.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={onPlayAgain} className="w-full sm:w-auto">
            Play again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
