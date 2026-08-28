import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface GuessFormValues {
  number: number
}

interface GuessFormProps {
  lowerBound: number
  upperBound: number
  disabled: boolean
  onSubmit: (number: number) => void
}

export function GuessForm({ lowerBound, upperBound, disabled, onSubmit }: GuessFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<GuessFormValues>()

  useEffect(() => {
    setFocus('number')
  }, [setFocus])

  const submit = handleSubmit(({ number }) => {
    onSubmit(number)
    reset({ number: undefined })
    setFocus('number')
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <Label htmlFor="guess" className="sr-only">
          Your guess
        </Label>
        <Input
          id="guess"
          type="number"
          inputMode="numeric"
          placeholder={`Guess between ${lowerBound} and ${upperBound}`}
          disabled={disabled}
          aria-invalid={!!errors.number}
          aria-describedby={errors.number ? 'guess-error' : undefined}
          className="h-12 text-center text-lg font-medium sm:text-left"
          {...register('number', {
            required: 'Enter a number',
            valueAsNumber: true,
            min: { value: lowerBound, message: `Must be at least ${lowerBound}` },
            max: { value: upperBound, message: `Must be at most ${upperBound}` },
          })}
        />
        {errors.number && (
          <p id="guess-error" role="alert" className="mt-1.5 text-sm text-destructive">
            {errors.number.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="h-12 sm:w-32" disabled={disabled}>
        {disabled && <Loader2 className="size-4 animate-spin" />}
        Guess
      </Button>
    </form>
  )
}
