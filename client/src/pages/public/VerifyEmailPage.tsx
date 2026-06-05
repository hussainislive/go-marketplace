import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import api, { setTokens } from '../../lib/axios'
import { useAppDispatch } from '../../store/hooks'
import { setUser } from '../../store/authSlice'
import type { AuthUser } from '../../store/authSlice'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

type Status = 'verifying' | 'success' | 'error'

interface VerifyResponseData {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState<Status>('verifying')
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    api
      .post<{ data: VerifyResponseData }>('/auth/verify-email', { token })
      .then(res => {
        // Log the user in immediately so "Go to Dashboard" lands them authenticated.
        const { user, accessToken, refreshToken } = res.data.data
        setTokens(accessToken, refreshToken)
        dispatch(setUser(user))
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [token, dispatch])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-soft p-6">
      <div className="w-full max-w-md bg-white rounded-card shadow-card p-8 text-center">
        <Link to="/" className="text-3xl font-bold text-brand-gradient block mb-6">GO</Link>

        {status === 'verifying' && (
          <>
            <div className="flex justify-center mb-4 text-brand-pink"><Spinner size="lg" /></div>
            <h1 className="text-card-title font-semibold text-text-primary">Verifying your email…</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-status-success/12 text-status-success flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={34} />
            </div>
            <h1 className="text-card-title font-semibold text-text-primary">Email verified!</h1>
            <p className="text-body text-text-primary/55 mt-2 mb-6">
              Your account is now verified. You can post listings and chat with buyers.
            </p>
            <Link to="/dashboard"><Button fullWidth>Go to Dashboard</Button></Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-status-error/12 text-status-error flex items-center justify-center mx-auto mb-5">
              <XCircle size={34} />
            </div>
            <h1 className="text-card-title font-semibold text-text-primary">Verification failed</h1>
            <p className="text-body text-text-primary/55 mt-2 mb-6">
              This verification link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/"><Button fullWidth variant="secondary">Back to Home</Button></Link>
          </>
        )}
      </div>
    </div>
  )
}
