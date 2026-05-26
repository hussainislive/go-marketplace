import * as Slider from '@radix-ui/react-slider'
import { formatPrice } from '../../utils/format'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  onCommit?: (value: [number, number]) => void
  step?: number
}

export function PriceRangeSlider({ min, max, value, onChange, onCommit, step = 100 }: PriceRangeSliderProps) {
  return (
    <div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={v => onChange([v[0], v[1]] as [number, number])}
        onValueCommit={v => onCommit?.([v[0], v[1]] as [number, number])}
        minStepsBetweenThumbs={1}
      >
        <Slider.Track className="bg-border relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-brand-gradient rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-brand-pink rounded-full shadow-card hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 transition-transform" aria-label="Min price" />
        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-brand-pink rounded-full shadow-card hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 transition-transform" aria-label="Max price" />
      </Slider.Root>
      <div className="flex justify-between mt-2.5 text-caption text-text-primary/60">
        <span>{formatPrice(value[0])}</span>
        <span>{formatPrice(value[1])}</span>
      </div>
    </div>
  )
}
