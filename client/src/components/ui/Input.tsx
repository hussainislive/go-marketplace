import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/format'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, leftIcon, rightIcon, className, id, ...props },
  ref
) {
  const inputId = id ?? props.name
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-label font-semibold text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/40">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-12 rounded-input bg-background-soft text-body text-text-primary',
            'border transition-all duration-150 placeholder:text-text-primary/40',
            'focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink',
            leftIcon ? 'pl-11' : 'pl-4',
            rightIcon ? 'pr-11' : 'pr-4',
            error ? 'border-status-error focus:ring-status-error/30 focus:border-status-error' : 'border-border',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-primary/40">
            {rightIcon}
          </span>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-caption text-status-error">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-caption text-text-primary/50">{helperText}</p>
      ) : null}
    </div>
  )
})
