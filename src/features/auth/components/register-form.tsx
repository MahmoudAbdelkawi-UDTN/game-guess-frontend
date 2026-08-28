import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/features/auth/components/password-input'
import { useRegister } from '@/features/auth/hooks/use-register'
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/auth-schemas'
import { ApiError } from '@/lib/api-client'

export function RegisterForm() {
  const navigate = useNavigate()
  const registerUser = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = (values: RegisterFormValues) => {
    registerUser.mutate(
      { email: values.email, password: values.password },
      { onSuccess: () => navigate('/game', { replace: true }) },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : 'password-hint'}
          {...register('password')}
        />
        {errors.password ? (
          <p id="password-error" role="alert" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        ) : (
          <p id="password-hint" className="text-xs text-muted-foreground">
            At least 8 characters, with an uppercase letter, a lowercase letter, and a digit.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p id="confirm-password-error" role="alert" className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {registerUser.isError && (
        <p role="alert" className="text-sm text-destructive">
          {registerUser.error instanceof ApiError
            ? registerUser.error.message
            : 'Something went wrong. Please try again.'}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={registerUser.isPending}>
        {registerUser.isPending && <Loader2 className="size-4 animate-spin" />}
        Create account
      </Button>
    </form>
  )
}
