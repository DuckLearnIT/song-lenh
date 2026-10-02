import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import SplitChars from './SplitChars'
import Wave from './Wave'
import useReducedMotion from '../hooks/useReducedMotion'

/** Opening curtain: the title rises, then the vermilion cloth is pulled up to reveal the hero. */
export default function Curtain() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (reduced || !root.current) return
    const html = document.documentElement
    html.style.overflow = 'hidden'
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          onComplete: () => {
            html.style.overflow = ''
            root.current?.remove()
          },
        })
        .from('.cu .ch', { yPercent: 120, duration: 0.55, ease: 'expo.out', stagger: 0.035 })
        .from('.cu-sub', { opacity: 0, y: 8, duration: 0.35 }, 0.3)
        .to('.cu-inner', { yPercent: -40, opacity: 0, duration: 0.45, ease: 'power3.in' }, 0.75)
        .to(root.current, { y: () => -(window.innerHeight + 100), duration: 0.75, ease: 'expo.inOut' }, 0.8)
    }, root)
    return () => {
      html.style.overflow = ''
      ctx.revert()
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[80] bg-vermilion text-card">
      <div className="cu-inner absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="cu display text-[clamp(4rem,14vw,12rem)]">
            <SplitChars text="Sông Lệnh" />
          </p>
          <p className="cu-sub mt-4 text-[0.68rem] tracking-[0.4em] uppercase text-card/80">Ra quân</p>
        </div>
      </div>
      <div className="absolute inset-x-0 top-full -mt-px">
        <Wave fill="#b5362b" flip />
      </div>
    </div>
  )
}
