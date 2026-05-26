import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
          <p className="text-6xl mb-6">⚠️</p>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Something went wrong</h1>
          <p className="text-body text-text-primary/55 max-w-sm mb-8">
            An unexpected error occurred. Try refreshing the page or go back home.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => this.setState({ hasError: false })}>
              Try again
            </Button>
            <Link to="/"><Button>Go home</Button></Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
