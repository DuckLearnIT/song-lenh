import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import SplitChars from './SplitChars'
import Wave from './Wave'
import useReducedMotion from '../hooks/useReducedMotion'

/** Opening curtain: the title rises, then the vermilion cloth is pulled up to reveal the hero. */
export default function Curtain() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [done, setDone] = useState(false)

  useLayoutEffect(() => {
    if (reduced || !root.current) return
    let timer: number
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          onComplete: () => {
            setDone(true)
          },
        })
        .from('.cu .ch', { yPercent: 120, duration: 0.45, ease: 'expo.out', stagger: 0.025 })
        .from('.cu-sub', { opacity: 0, y: 6, duration: 0.3 }, 0.2)
        .to('.cu-inner', { yPercent: -30, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.5)
        .to(root.current, { yPercent: -105, duration: 0.6, ease: 'expo.inOut' }, 0.55)
    }, root)

    timer = window.setTimeout(() => setDone(true), 1300)

    return () => {
      window.clearTimeout(timer)
      ctx.revert()
    }
  }, [reduced])

  if (reduced || done) return null

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
