import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/auth-layout'
import { RegisterForm } from '@/features/auth/components/register-form'

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Guess the number, beat your best, and track every streak."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  )
}
