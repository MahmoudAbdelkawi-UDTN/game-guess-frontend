import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/features/auth/components/password-input'
import { useLogin } from '@/features/auth/hooks/use-login'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth-schemas'
import { ApiError } from '@/lib/api-client'

export function LoginForm() {
  const navigate = useNavigate()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => navigate('/game', { replace: true }),
    })
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
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
        />
        {errors.password && (
          <p id="password-error" role="alert" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {login.isError && (
        <p role="alert" className="text-sm text-destructive">
          {login.error instanceof ApiError ? login.error.message : 'Something went wrong. Please try again.'}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending && <Loader2 className="size-4 animate-spin" />}
        Sign in
      </Button>
    </form>
  )
}
