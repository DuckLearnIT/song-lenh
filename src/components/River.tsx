import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useReducedMotion from '../hooks/useReducedMotion'

const H = 1000
const D =
  'M6 0C6 60 22 90 8 150S2 260 12 330S94 420 90 500S4 620 8 700S96 800 92 880S50 950 50 1000'

/** A single line that draws down the whole page as you scroll, with a tiny boat at its tip. */
export default function River() {
  const host = useRef<HTMLDivElement>(null)
  const path = useRef<SVGPathElement>(null)
  const reveal = useRef<SVGRectElement>(null)
  const boat = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !host.current || !path.current) return
    const p = path.current
    const len = p.getTotalLength()
    const samples: { x: number; y: number }[] = []
    let maxY = -1
    for (let i = 0; i <= 600; i++) {
      const pt = p.getPointAtLength((i / 600) * len)
      if (pt.y >= maxY) {
        maxY = pt.y
        samples.push({ x: pt.x, y: pt.y })
      }
    }
    const xAt = (y: number) => {
      let lo = 0
      let hi = samples.length - 1
      while (lo < hi) {
        const m = (lo + hi) >> 1
        if (samples[m].y < y) lo = m + 1
        else hi = m
      }
      return samples[lo].x
    }

    const st = ScrollTrigger.create({
      trigger: host.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      refreshPriority: -1,
      onUpdate: (self) => {
        const y = self.progress * H
        reveal.current?.setAttribute('height', String(y))
        if (boat.current) {
          boat.current.style.left = `${xAt(y)}%`
          boat.current.style.top = `${(y / H) * 100}%`
        }
      },
    })
    return () => st.kill()
  }, [reduced])

  if (reduced) return null

  return (
    <div
      ref={host}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 max-lg:hidden"
    >
      <svg viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full">
        <defs>
          <mask id="river-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height={H}>
            <rect ref={reveal} x="0" y="0" width="100" height="0" fill="#fff" />
          </mask>
        </defs>
        <path
          ref={path}
          d={D}
          fill="none"
          stroke="#d99a2b"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          mask="url(#river-mask)"
          opacity="0.75"
        />
      </svg>
      <span
        ref={boat}
        className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-vermilion ring-2 ring-card"
        style={{ left: '6%', top: 0 }}
      />
    </div>
  )
}
