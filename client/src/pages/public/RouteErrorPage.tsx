import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export default function RouteErrorPage() {
  const error = useRouteError()

  let title = 'Something went wrong'
  let description = 'An unexpected error occurred. Try refreshing the page or head back home.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page not found'
      description = "The page you're looking for doesn't exist or may have been moved."
    } else {
      title = `${error.status} ${error.statusText}`
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-soft px-5 text-center">
      <Link to="/" className="text-3xl font-bold text-brand-gradient mb-8">GO</Link>
      <p className="text-[64px] leading-none mb-4">🧭</p>
      <h1 className="text-2xl font-bold text-text-primary mb-2">{title}</h1>
      <p className="text-body text-text-primary/55 max-w-sm mb-8">{description}</p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => window.location.reload()}>Refresh</Button>
        <Link to="/"><Button>Go home</Button></Link>
      </div>
    </div>
  )
}
