import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/format'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  placeholder?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder, error, className, id, ...props },
  ref
) {
  const selectId = id ?? props.name
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-label font-semibold text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full h-12 rounded-input bg-background-soft text-body text-text-primary appearance-none',
            'border transition-all duration-150 pl-4 pr-10',
            'focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink',
            error ? 'border-status-error' : 'border-border',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-primary/40 pointer-events-none"
        />
      </div>
      {error && <p className="mt-1.5 text-caption text-status-error">{error}</p>}
    </div>
  )
})
