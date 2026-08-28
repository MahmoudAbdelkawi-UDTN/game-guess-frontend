import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/auth-layout'
import { LoginForm } from '@/features/auth/components/login-form'

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to pick up your streak where you left off."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}
