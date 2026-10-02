import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import SplitChars from './SplitChars'
import { byId } from '../data/cards'
import useReducedMotion from '../hooks/useReducedMotion'

const fan = [
  { id: 'thuyen-nhe', x: '-62%', y: '6%', r: -11, depth: 14 },
  { id: 'tham-quan', x: '62%', y: '12%', r: 10, depth: 22 },
  { id: 'nha-tuong', x: '0%', y: '-6%', r: -1.5, depth: 34 },
]

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // Rapid, fluid entrance: starts at 0.08s so LCP and FCP are instant!
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.08 })
      tl.from('.sun', { scale: 0.35, opacity: 0, duration: 1.4 })
        .from('.band', { yPercent: 100, duration: 1.2, stagger: 0.08 }, 0.05)
        .from('.hero-badge', { opacity: 0, y: -16, duration: 0.8 }, 0.1)
        .from('.hero-title .ch', { yPercent: 110, duration: 1.1, stagger: 0.04 }, 0.12)
        .from(
          '.hero-card',
          { yPercent: 60, opacity: 0, rotate: 0, duration: 1.2, stagger: 0.1 },
          0.25,
        )
        .from('.hero-fade', { opacity: 0, y: 18, duration: 0.9, stagger: 0.08 }, 0.5)

      // Scroll-driven parallax: letters glide apart gracefully, fan rises
      gsap.to('.title-a', {
        xPercent: -8,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.title-b', {
        xPercent: 8,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.fan', {
        yPercent: -14,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.band-1', {
        xPercent: -6,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.band-2', {
        xPercent: 5,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.band-3', {
        xPercent: -3,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.sun', {
        yPercent: 18,
        scale: 1.12,
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      // Pointer parallax for fine pointers
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
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          setters.forEach((s) => {
            s.x(nx * s.k * 1.4)
            s.y(ny * s.k)
          })
          sx(-nx * 36)
        }
        window.addEventListener('pointermove', onMove)
        return () => window.removeEventListener('pointermove', onMove)
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={root}
      id="top"
      className="hero-ground relative isolate min-h-svh overflow-hidden px-[clamp(1rem,3vw,2.5rem)] pt-20 pb-10 flex flex-col justify-between"
    >
      {/* Sun Disc */}
      <div
        className="sun absolute -z-10 rounded-full right-[-8vw] top-[12vh] size-[clamp(280px,54vw,800px)] max-lg:right-[-22vw] max-lg:top-[38vh] will-change-transform pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 38% 34%, #f7cf6a 0%, #e8a93a 42%, #c9782a 78%, #b5542a 100%)',
          boxShadow: '0 0 0 1px rgba(181,54,43,.25), 0 0 0 clamp(14px,2.2vw,34px) rgba(217,154,43,.16)',
        }}
        aria-hidden="true"
      />

      {/* River Bands */}
      <div className="absolute inset-x-0 bottom-0 z-[5] h-[clamp(90px,17vh,190px)] overflow-hidden pointer-events-none" aria-hidden="true">
        {[
          { c: '#15345f', d: 'M-80 92C200 36 380 150 640 98S1040 36 1240 88 1440 112 1520 76V200H-80Z', k: 'band-1' },
          { c: '#b5362b', d: 'M-80 132C240 92 420 172 700 132S1100 92 1520 142V200H-80Z', k: 'band-2' },
          { c: '#d99a2b', d: 'M-80 168C300 142 500 192 820 162S1200 152 1520 178V200H-80Z', k: 'band-3' },
        ].map((b) => (
          <svg key={b.k} viewBox="0 0 1440 200" preserveAspectRatio="none" className={`band ${b.k} absolute inset-0 size-full will-change-transform`}>
            <path d={b.d} fill={b.c} />
          </svg>
        ))}
      </div>

      {/* Top Tag & Hero Title */}
      <div className="relative z-10 max-w-5xl mt-2 lg:mt-6">
        <div className="hero-badge inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-ink/15 bg-paper/60 backdrop-blur-sm text-[0.68rem] tracking-[0.22em] uppercase font-semibold text-ink/80 mb-3 lg:mb-5">
          <span className="inline-block size-1.5 rounded-full bg-vermilion" />
          <span>Chiến thuật hợp tác · Bạch Đằng 938</span>
        </div>

        <h1 className="hero-title display relative z-0 select-none text-[clamp(3.8rem,14vw,14rem)] leading-[0.9] tracking-tight">
          <span className="title-a block text-ink will-change-transform">
            <SplitChars text="Thủy" />
          </span>
          <span className="title-b block pl-[14vw] lg:pl-[16vw] text-vermilion will-change-transform">
            <SplitChars text="Trận" />
          </span>
        </h1>
      </div>

      {/* Fan of Cards */}
      <div
        className="fan absolute z-10 right-[4vw] bottom-[4vh] lg:bottom-[6vh] w-[clamp(200px,24vw,340px)] max-lg:right-1/2 max-lg:translate-x-1/2 max-lg:bottom-[2vh] max-lg:w-[clamp(170px,46vw,260px)] will-change-transform"
        style={{ aspectRatio: '1500 / 2078' }}
      >
        {fan.map((f, i) => {
          const c = byId(f.id)
          return (
            <img
              key={f.id}
              src={c.image}
              alt={`Lá bài ${c.role}`}
              className="hero-card card-shadow absolute inset-0 w-full h-full rounded-[4%] object-cover transition-transform duration-500 hover:scale-105"
              style={{
                transform: `translate(${f.x}, ${f.y}) rotate(${f.r}deg)`,
                zIndex: f.depth,
              }}
              draggable={false}
              loading="eager"
              decoding="async"
              fetchPriority={i === 2 ? 'high' : 'auto'}
            />
          )
        })}
      </div>

      {/* Copy & CTA Section */}
      <div className="hero-fade relative z-20 max-w-[26rem] mb-4 lg:mb-8">
        <p className="font-serif italic text-[clamp(1.15rem,1.6vw,1.45rem)] leading-snug font-normal text-ink/90">
          “Sáu lệnh bài, một dòng sông. Mỗi lệnh ban ra, cả thế trận đổi hướng.”
        </p>
        <p className="mt-3 text-[0.72rem] tracking-[0.2em] uppercase font-medium text-ink/65">
          Board game chiến thuật sa bàn lịch sử Việt Nam
        </p>

        {/* Action CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#ke-sach"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-vermilion text-card text-[0.72rem] tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:bg-ochre hover:text-ink hover:shadow-lg active:scale-95"
          >
            <span>Khám phá thế trận</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#roles"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-ink/25 text-ink text-[0.72rem] tracking-[0.18em] uppercase font-medium transition-colors duration-300 hover:border-ink hover:bg-ink/5"
          >
            <span>Sáu lá lệnh</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator prompt */}
      <div className="hero-fade absolute right-[clamp(1rem,3vw,2.5rem)] top-20 z-20 flex items-center gap-3 text-[0.65rem] tracking-[0.25em] uppercase max-lg:hidden text-ink/80">
        <span>Cuộn để ra quân</span>
        <span className="block h-px w-14 bg-ink/70 origin-left animate-pulse" />
      </div>
    </section>
  )
}
