import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import banner1 from '../../assets/banner1.webp'
import banner2 from '../../assets/banner2.webp'
import { cn } from '../../utils/format'

const SLIDES = [
  { src: banner1, alt: 'GO Marketplace — Find anything near you' },
  { src: banner2, alt: 'GO Marketplace — Buy. Sell. Connect.' },
]

const AUTOPLAY_DELAY = 3000

export function HeroCarousel() {
  // Respect users who prefer reduced motion: no autoplay for them.
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const autoplay = useRef(
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', duration: 22 },
    reducedMotion ? [] : [autoplay.current]
  )

  const [selected, setSelected] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <section className="relative">
      {/* Viewport — overflow-hidden clips the sliding track */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Track — promoted to its own GPU layer so slides composite without
            repainting, keeping transitions smooth. */}
        <div className="flex touch-pan-y" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
          {SLIDES.map((slide, i) => (
            <div key={slide.src} className="relative flex-[0_0_100%] min-w-0">
              <img
                src={slide.src}
                alt={slide.alt}
                width={2240}
                height={702}
                // Both slides load + decode eagerly so neither image has to be
                // decoded mid-transition (the cause of the slide hitch).
                loading="eager"
                fetchPriority={i === 0 ? 'high' : 'low'}
                decoding="async"
                className="block w-full h-auto select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/85 hover:bg-white text-text-primary shadow-card flex items-center justify-center transition-colors active:scale-95"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/85 hover:bg-white text-text-primary shadow-card flex items-center justify-center transition-colors active:scale-95"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={selected === i}
            className={cn(
              'rounded-full transition-all duration-300',
              selected === i ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/60 hover:bg-white/80'
            )}
          />
        ))}
      </div>
    </section>
  )
}
