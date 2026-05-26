import { cn } from '../../utils/format'

export interface TabItem {
  value: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 border-b border-border overflow-x-auto scrollbar-thin', className)}>
      {tabs.map(tab => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative px-4 py-2.5 text-body font-medium whitespace-nowrap transition-colors',
              active ? 'text-brand-pink' : 'text-text-primary/60 hover:text-text-primary'
            )}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'ml-1.5 rounded-badge px-1.5 py-0.5 text-caption font-semibold',
                  active ? 'bg-brand-pink/12 text-brand-pink' : 'bg-background-soft text-text-primary/50'
                )}
              >
                {tab.count}
              </span>
            )}
            {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gradient rounded-full" />}
          </button>
        )
      })}
    </div>
  )
}
