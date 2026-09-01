import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useResetPassword } from '../../api/auth'
import { resetPasswordSchema, passwordStrength } from '../../utils/validation'
import type { ResetPasswordValues } from '../../utils/validation'
import { apiErrorMessage, cn } from '../../utils/format'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Logo } from '../../components/shared/Logo'
import { Seo } from '../../components/shared/Seo'

const STRENGTH_COLORS = ['bg-status-error', 'bg-status-warning', 'bg-status-info', 'bg-status-success']

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const resetPassword = useResetPassword()
  const token = params.get('token')
  const [isComplete, setIsComplete] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch('password') ?? ''
  const strength = passwordStrength(password)

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) return

    try {
      await resetPassword.mutateAsync({ token, password: values.password })
      setIsComplete(true)
      toast.success('Password updated. You can log in now.')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not reset password.'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-soft p-6">
      <Seo title="Reset Password" path="/reset-password" noIndex />
      <div className="w-full max-w-md bg-white rounded-card shadow-card p-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6"><Logo className="h-10 md:h-12" /></Link>
        </div>

        {!token && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-status-error/12 text-status-error flex items-center justify-center mx-auto mb-5">
              <XCircle size={34} />
            </div>
            <h1 className="text-card-title font-semibold text-text-primary">Reset link is missing</h1>
            <p className="text-body text-text-primary/55 mt-2 mb-6">
              Please request a fresh password reset link from the login page.
            </p>
            <Link to="/login"><Button fullWidth variant="secondary">Back to Login</Button></Link>
          </div>
        )}

        {token && isComplete && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-status-success/12 text-status-success flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={34} />
            </div>
            <h1 className="text-card-title font-semibold text-text-primary">Password updated</h1>
            <p className="text-body text-text-primary/55 mt-2 mb-6">
              Your password has been changed successfully.
            </p>
            <Button fullWidth onClick={() => navigate('/login')}>Log In</Button>
          </div>
        )}

        {token && !isComplete && (
          <>
            <h1 className="text-2xl font-bold text-text-primary">Create a new password</h1>
            <p className="text-body text-text-primary/55 mt-1 mb-6">
              Choose a strong password for your GO Marketplace account.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map(i => (
                        <div
                          key={i}
                          className={cn(
                            'h-1 flex-1 rounded-full transition-colors',
                            i < strength.score ? STRENGTH_COLORS[strength.score - 1] : 'bg-border'
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-caption text-text-primary/50 mt-1">Strength: {strength.label}</p>
                  </div>
                )}
              </div>
              <Input
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <Button type="submit" fullWidth size="lg" loading={resetPassword.isPending}>
                Update Password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
