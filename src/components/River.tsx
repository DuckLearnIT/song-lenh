import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useReducedMotion from '../hooks/useReducedMotion'

/**
 * An elegant, non-intrusive scroll progress indicator pinned to the top edge.
 * Completely eliminates center screen distractions while providing smooth scroll feedback.
 */
export default function River() {
  const bar = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !bar.current) return

    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2,
      onUpdate: (self) => {
        if (bar.current) {
          bar.current.style.transform = `scaleX(${self.progress})`
        }
      },
    })

    return () => st.kill()
  }, [reduced])

  if (reduced) return null

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-ink/10"
    >
      <div
        ref={bar}
        className="h-full w-full origin-left bg-gradient-to-r from-ochre via-vermilion to-ochre opacity-90 will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </aside>
  )
}
