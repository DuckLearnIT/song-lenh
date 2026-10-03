import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import SplitChars from './SplitChars'
import { byId } from '../data/cards'
import useReducedMotion from '../hooks/useReducedMotion'

const fan = [
  { id: 'thuyen-nhe', x: '-62%', y: '6%', r: -11, depth: 14 },
  { id: 'tham-quan', x: '62%', y: '12%', r: 10, depth: 22 },
  { id: 'nha-tuong', x: '0%', y: '-6%', r: -1.5, depth: 34 },
]

export default function Hero({ ready = false }: { ready?: boolean }) {
  const root = useRef<HTMLElement>(null)
  const introTlRef = useRef<gsap.core.Timeline | null>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return

    const ctx = gsap.context(() => {
      // 1. Intro timeline (starts paused, plays smoothly when preloader signals ready)
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, paused: true })
      tl.from('.sun-core', { scale: 0.2, opacity: 0, duration: 1.2 })
        .from('.band', { yPercent: 100, duration: 1.1, stagger: 0.08 }, 0.06)
        .from('.hero-title .ch', { yPercent: 115, duration: 1.0, stagger: 0.04 }, 0.08)
        .from(
          '.hero-card',
          { yPercent: 70, opacity: 0, rotate: 0, duration: 1.2, stagger: 0.08 },
          0.2,
        )
        .from('.hero-fade', { opacity: 0, y: 16, duration: 0.8, stagger: 0.08 }, 0.5)

      introTlRef.current = tl

      // 2. Scroll transition: registered immediately on mount in natural DOM order!
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
        },
      })

      // Elements depart / fade out cleanly (autoAlpha ensures no invisible layout interference)
      scrollTl
        .to('.hero-depart', { autoAlpha: 0, y: -24, duration: 0.35, ease: 'power2.in' }, 0)
        .to('.title-a', { xPercent: -50, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 0)
        .to('.title-b', { xPercent: 50, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 0)
        .to('.fan', { xPercent: 30, yPercent: 60, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, 0)
        .to('.hero-rivers', { yPercent: 130, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, 0)

      // Sun expands dramatically until it covers the ENTIRE viewport and transitions to #ffb627
      scrollTl
        .to(
          '.sun',
          {
            scale: 35,
            xPercent: -45,
            yPercent: 20,
            boxShadow: '0 0 0 0px transparent, 0 0 0 0px transparent',
            duration: 1.4,
            ease: 'power2.inOut',
          },
          0,
        )
        .to('.sun-fill', { opacity: 1, duration: 0.9, ease: 'power2.inOut' }, 0.25)
        .to(root.current, { backgroundColor: '#ffb627', duration: 0.7, ease: 'none' }, 0.6)
        .to({}, { duration: 0.4 }) // Pure solid #ffb627 hold period before Hero unpins

      // Pointer parallax (fine pointers only, active near top)
      const mm = gsap.matchMedia()
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const layers = gsap.utils.toArray<HTMLElement>('.hero-card')
        const setters = layers.map((el, i) => ({
          x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }),
          y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' }),
          k: fan[i].depth,
        }))
        const sx = gsap.quickTo('.sun', 'x', { duration: 1.4, ease: 'power3' })
        const onMove = (e: PointerEvent) => {
          if (scrollTl.scrollTrigger && scrollTl.scrollTrigger.progress > 0.08) return
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          setters.forEach((s) => {
            s.x(nx * s.k * 1.4)
            s.y(ny * s.k)
          })
          sx(-nx * 40)
        }
        window.addEventListener('pointermove', onMove)
        return () => window.removeEventListener('pointermove', onMove)
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  useEffect(() => {
    if (ready && introTlRef.current) {
      introTlRef.current.play()
    }
  }, [ready])

  return (
    <section
      ref={root}
      id="top"
      className="hero-ground relative isolate h-svh overflow-hidden px-[clamp(1rem,3vw,2.5rem)] pt-20 pb-10"
    >
      {/* sun disc */}
      <div
        className="sun pointer-events-none absolute -z-10 rounded-full right-[-8vw] top-[14vh] size-[clamp(260px,52vw,780px)] max-lg:right-[-20vw] max-lg:top-[42vh]"
        style={{
          boxShadow: '0 0 0 1px rgba(181,54,43,.25), 0 0 0 clamp(14px,2.2vw,34px) rgba(217,154,43,.16)',
        }}
        aria-hidden="true"
      >
        <div
          className="sun-core size-full rounded-full"
          style={{
            background:
              'radial-gradient(circle at 38% 34%, #f7cf6a 0%, #e8a93a 42%, #c9782a 78%, #b5542a 100%)',
          }}
        />
        <div className="sun-fill absolute inset-0 rounded-full bg-[#ffb627] opacity-0" />
      </div>

      {/* river bands */}
      <div className="hero-rivers absolute inset-x-0 bottom-0 z-[5] h-[clamp(90px,17vh,190px)] overflow-hidden" aria-hidden="true">
        {[
          { c: '#15345f', d: 'M-80 92C200 36 380 150 640 98S1040 36 1240 88 1440 112 1520 76V200H-80Z', k: 'band-1' },
          { c: '#b5362b', d: 'M-80 132C240 92 420 172 700 132S1100 92 1520 142V200H-80Z', k: 'band-2' },
          { c: '#d99a2b', d: 'M-80 168C300 142 500 192 820 162S1200 152 1520 178V200H-80Z', k: 'band-3' },
        ].map((b) => (
          <svg key={b.k} viewBox="0 0 1440 200" preserveAspectRatio="none" className={`band ${b.k} absolute inset-0 size-full`}>
            <path d={b.d} fill={b.c} />
          </svg>
        ))}
      </div>

      {/* title */}
      <h1 className="hero-title display relative z-0 select-none text-[clamp(4.5rem,21vw,26rem)] max-lg:mt-6">
        <span className="title-a block">
          <SplitChars text="Thủy" />
        </span>
        <span className="title-b block pl-[22vw] text-vermilion max-lg:pl-[16vw]">
          <SplitChars text="Trận" />
        </span>
      </h1>

      {/* fan of cards */}
      <div
        className="fan absolute z-10 right-[3vw] bottom-[-12vh] w-[clamp(190px,24vw,360px)] max-lg:right-1/2 max-lg:translate-x-1/2 max-lg:bottom-[-2vh] max-lg:w-[clamp(150px,42vw,260px)]"
        style={{ aspectRatio: '1500 / 2078' }}
      >
        {fan.map((f) => {
          const c = byId(f.id)
          return (
            <img
              key={f.id}
              src={c.image}
              alt={`Lá bài ${c.role}`}
              className="hero-card card-shadow absolute inset-0 w-full h-full rounded-[3%] object-cover"
              style={{
                transform: `translate(${f.x}, ${f.y}) rotate(${f.r}deg)`,
                zIndex: f.depth,
              }}
              draggable={false}
              fetchPriority="high"
            />
          )
        })}
      </div>

      {/* copy */}
      <div className="hero-depart absolute left-[clamp(1rem,3vw,2.5rem)] bottom-[clamp(7rem,21vh,13rem)] z-20 max-w-[22rem] max-lg:hidden">
        <div className="hero-fade">
          <p className="font-serif italic text-[1.35rem] leading-relaxed font-normal">
            Sáu lá lệnh, một dòng sông. Mỗi lệnh ban ra, cả đội hình đổi hướng.
          </p>
          <p className="mt-4 text-[0.76rem] tracking-[0.22em] uppercase opacity-75 font-medium">
            Board game chiến thuật hợp tác · Việt Nam
          </p>
        </div>
      </div>

      <div className="hero-depart relative z-20 mt-8 hidden max-lg:block max-w-[18rem]">
        <div className="hero-fade">
          <p className="font-serif italic text-lg leading-relaxed font-normal">
            Sáu lá lệnh, một dòng sông.
          </p>
          <p className="mt-3 text-[0.72rem] tracking-[0.22em] uppercase opacity-75 font-medium">
            Board game chiến thuật · Việt Nam
          </p>
        </div>
      </div>

      <div className="hero-depart absolute right-[clamp(1rem,3vw,2.5rem)] top-20 z-20 flex items-center gap-3 text-[0.74rem] tracking-[0.25em] uppercase max-lg:hidden">
        <div className="hero-fade flex items-center gap-3">
          <span>Cuộn để ra quân</span>
          <span className="block h-px w-14 bg-ink origin-left animate-pulse" />
        </div>
      </div>
    </section>
  )
}
