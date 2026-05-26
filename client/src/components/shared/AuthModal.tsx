import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { closeAuthModal, openAuthModal } from '../../store/uiSlice'
import { setUser } from '../../store/authSlice'
import { useLogin, useRegister } from '../../api/auth'
import api from '../../lib/axios'
import type { AuthUser } from '../../store/authSlice'
import { loginSchema, signupSchema } from '../../utils/validation'
import type { LoginValues, SignupValues } from '../../utils/validation'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Tabs } from '../ui/Tabs'

const API_BASE = (import.meta.env.VITE_API_URL as string).replace('/api/v1', '')

export function AuthModal() {
  const { authModalOpen, authModalTab } = useAppSelector(s => s.ui)
  const dispatch = useAppDispatch()

  return (
    <Modal
      open={authModalOpen}
      onOpenChange={open => (open ? undefined : dispatch(closeAuthModal()))}
      className="sm:max-w-md"
      showClose
    >
      <div className="text-center mb-5 -mt-2">
        <span className="text-2xl font-bold text-brand-gradient">GO</span>
        <p className="text-body text-text-primary/55 mt-1">Buy. Sell. Connect.</p>
      </div>
      <Tabs
        tabs={[
          { value: 'login', label: 'Log In' },
          { value: 'signup', label: 'Sign Up' },
        ]}
        value={authModalTab}
        onChange={v => dispatch(openAuthModal(v as 'login' | 'signup'))}
        className="mb-5"
      />
      {authModalTab === 'login' ? <LoginForm /> : <SignupForm />}

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center"><span className="bg-white px-3 text-caption text-text-primary/40">or</span></div>
      </div>
      <a
        href={`${API_BASE}/api/v1/auth/google`}
        className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-button border border-border font-medium text-body hover:bg-background-soft transition-colors"
      >
        <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
        Continue with Google
      </a>
    </Modal>
  )
}

function LoginForm() {
  const dispatch = useAppDispatch()
  const login = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginValues) {
    try {
      const user = await login.mutateAsync(values)
      dispatch(setUser(user))
      dispatch(closeAuthModal())
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
    } catch {
      toast.error('Invalid email or password')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
      <Button type="submit" fullWidth loading={login.isPending}>Log In</Button>
    </form>
  )
}

function SignupForm() {
  const dispatch = useAppDispatch()
  const registerMut = useRegister()
  const login = useLogin()
  const [done, setDone] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(values: SignupValues) {
    try {
      await registerMut.mutateAsync(values)
      // auto-login after register
      const user = await login.mutateAsync({ email: values.email, password: values.password })
      // refresh /me to be safe
      await api.get<{ data: AuthUser }>('/users/me').catch(() => undefined)
      dispatch(setUser(user))
      setDone(true)
      toast.success('Account created! Verify your email to post ads.')
      setTimeout(() => dispatch(closeAuthModal()), 1200)
    } catch {
      toast.error('Could not create account. Email may already be in use.')
    }
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <p className="text-body text-text-primary/70">You're all set! Check your inbox to verify your email.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
      <Button type="submit" fullWidth loading={registerMut.isPending || login.isPending}>Create Account</Button>
    </form>
  )
}
