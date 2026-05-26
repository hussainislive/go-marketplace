import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setUser } from '../../store/authSlice'
import { useLogin } from '../../api/auth'
import { loginSchema } from '../../utils/validation'
import type { LoginValues } from '../../utils/validation'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

const API_BASE = (import.meta.env.VITE_API_URL as string).replace('/api/v1', '')

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useAppSelector(s => s.auth)
  const login = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  async function onSubmit(values: LoginValues) {
    try {
      const user = await login.mutateAsync(values)
      dispatch(setUser(user))
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch {
      toast.error('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between bg-brand-gradient p-12 relative overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-white/5 blur-3xl rounded-full" />
        <Link to="/" className="text-3xl font-bold text-white relative z-10">GO</Link>
        <div className="relative z-10">
          <h1 className="text-hero font-bold text-white leading-tight">Welcome back.</h1>
          <p className="text-white/80 text-lg mt-4 max-w-md">
            Log in to manage your listings, chat with buyers, and pick up where you left off.
          </p>
        </div>
        <p className="text-white/60 text-caption relative z-10">© 2026 GO Marketplace. Buy. Sell. Connect.</p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background-soft">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden text-3xl font-bold text-brand-gradient block mb-8">GO</Link>
          <h2 className="text-2xl font-bold text-text-primary">Log in to your account</h2>
          <p className="text-body text-text-primary/55 mt-1 mb-8">
            New here?{' '}
            <Link to="/signup" className="text-brand-pink font-medium hover:underline">Create an account</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            <div className="flex justify-end">
              <Link to="/" className="text-caption text-brand-pink hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" fullWidth size="lg" loading={login.isPending}>Log In</Button>
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
        </div>
      </div>
    </div>
  )
}
