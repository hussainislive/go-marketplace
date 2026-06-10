import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useAppSelector } from '../../store/hooks'
import { useRegister } from '../../api/auth'
import { signupSchema, passwordStrength } from '../../utils/validation'
import type { SignupValues } from '../../utils/validation'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Logo } from '../../components/shared/Logo'
import { Seo } from '../../components/shared/Seo'
import { cn, apiErrorMessage } from '../../utils/format'

const API_BASE = (import.meta.env.VITE_API_URL as string).replace('/api/v1', '')
const STRENGTH_COLORS = ['bg-status-error', 'bg-status-warning', 'bg-status-info', 'bg-status-success']

export default function SignupPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAppSelector(s => s.auth)
  const registerMut = useRegister()
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  })
  const password = watch('password') ?? ''
  const strength = passwordStrength(password)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  async function onSubmit(values: SignupValues) {
    try {
      await registerMut.mutateAsync(values)
      setSuccess(true)
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not create account. Email may already be in use.'))
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Seo title="Sign Up" path="/signup" noIndex />
      <div className="hidden lg:flex flex-col justify-between bg-brand-gradient p-12 relative overflow-hidden">
        <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-white/5 blur-3xl rounded-full" />
        <Link to="/" className="relative z-10"><Logo variant="white" className="h-9" /></Link>
        <div className="relative z-10">
          <h1 className="text-hero font-bold text-white leading-tight">Join GO today.</h1>
          <p className="text-white/80 text-lg mt-4 max-w-md">
            Create a free account to start buying and selling in minutes.
          </p>
        </div>
        <p className="text-white/60 text-caption relative z-10">© 2026 GO Marketplace. Buy. Sell. Connect.</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-background-soft">
        <div className="w-full max-w-md">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-status-success/12 text-status-success flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={34} />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Check your email</h2>
              <p className="text-body text-text-primary/55 mt-2 mb-8">
                We sent a verification link to your inbox. Verify your email to start posting ads.
              </p>
              <Button fullWidth size="lg" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
          ) : (
            <>
              <Link to="/" className="lg:hidden inline-block mb-8"><Logo className="h-10 md:h-12" /></Link>
              <h2 className="text-2xl font-bold text-text-primary">Create your account</h2>
              <p className="text-body text-text-primary/55 mt-1 mb-8">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-pink font-medium hover:underline">Log in</Link>
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input label="Full name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
                <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
                <div>
                  <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
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
                <Button type="submit" fullWidth size="lg" loading={registerMut.isPending}>
                  Create Account
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center"><span className="bg-background-soft px-3 text-caption text-text-primary/40">or</span></div>
              </div>
              <a
                href={`${API_BASE}/api/v1/auth/google`}
                className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-button border border-border bg-white font-medium text-body hover:bg-background-soft transition-colors"
              >
                <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
                Continue with Google
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
