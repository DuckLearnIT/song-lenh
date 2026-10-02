import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { strategies as list } from '../data/strategies'
import useReducedMotion from '../hooks/useReducedMotion'

const n = list.length
const STEP = 360 / n

function Lines({ s }: { s: (typeof list)[number] }) {
  return (
    <div className="space-y-3">
      {s.lines.map((l, i) => (
        <p key={i} className="text-[clamp(0.85rem,1.05vw,1.05rem)] leading-relaxed max-w-[34rem]">
          {l.label && (
            <span className="display mr-2 !font-bold !tracking-[0.04em] text-[1.15em] align-baseline">{l.label}.</span>
          )}
          <span className="opacity-90">{l.text}</span>
        </p>
      ))}
    </div>
  )
}

export default function Strategies() {
  const root = useRef<HTMLElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const trigger = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.ks-card')
      const radius = () => cards[0].offsetWidth * 1.32

      gsap.set(ring.current, { '--r': '0px', scale: 0.55, rotationY: -40 })

      const mm = gsap.matchMedia()
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const rx = gsap.quickTo('.ks-scene', 'rotationX', { duration: 1.1, ease: 'power3' })
        const ry = gsap.quickTo('.ks-scene', 'rotationY', { duration: 1.1, ease: 'power3' })
        const move = (e: PointerEvent) => {
          ry((e.clientX / window.innerWidth - 0.5) * 16)
          rx(-(e.clientY / window.innerHeight - 0.5) * 10)
        }
        window.addEventListener('pointermove', move)
        return () => window.removeEventListener('pointermove', move)
      })

      let last = -1
      const paint = (k: number) => {
        cards.forEach((el, i) => {
          let d = (((i - k) % n) + n) % n
          if (d > n / 2) d -= n
          const a = Math.min(Math.abs(d), 2)
          el.style.filter = `brightness(${1 - a * 0.2}) saturate(${1 - a * 0.15})`
        })
        const idx = Math.round(k)
        if (idx !== last) {
          last = idx
          setActive(idx)
        }
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => paint(Math.min(Math.max(tl.time() - 1, 0), n - 1)),
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${(n + 0.5) * window.innerHeight * 0.9}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (v: number) => {
              const time = v * n
              return (time < 1 ? Math.round(time) : 1 + Math.round(time - 1)) / n
            },
            duration: { min: 0.25, max: 0.7 },
            ease: 'power2.inOut',
          },
        },
      })
      trigger.current = tl.scrollTrigger as ScrollTrigger

      // opening: the seven cards unfold from one point into a ring
      tl.to(ring.current, { '--r': () => radius() + 'px', scale: 1, rotationY: 0, duration: 1, ease: 'expo.out' }, 0)
      tl.fromTo(
        root.current,
        { backgroundColor: '#1a3a26', '--fg': '#f6e9d7' },
        { backgroundColor: list[0].bg, '--fg': list[0].fg, duration: 1 },
        0,
      )

      for (let i = 1; i < n; i++) {
        tl.to(ring.current, { rotationY: -i * STEP, duration: 1, ease: 'power2.inOut' }, i)
        tl.to(root.current, { backgroundColor: list[i].bg, '--fg': list[i].fg, duration: 1 }, i)
      }
      paint(0)
    }, root)
    return () => ctx.revert()
  }, [reduced])

  const jump = (j: number) => {
    const st = trigger.current
    if (!st) return
    const p = (1 + j) / n
    window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: 'smooth' })
  }

  if (reduced) {
    return (
      <section className="bg-paper px-[clamp(1rem,3vw,2.5rem)] py-20 text-ink">
        <h2 className="display text-[clamp(3rem,10vw,8rem)]">Bảy kế sách</h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <article key={s.id} className="rounded-2xl p-6" style={{ background: s.bg, color: s.fg }}>
              <img src={s.image} alt={`Lá bài ${s.name}`} className="card-shadow w-full rounded-[3%]" />
              <h3 className="display mt-5 text-3xl">{s.name}</h3>
              <div className="mt-3">
                <Lines s={s} />
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }

  const cur = list[active]

  return (
    <section
      ref={root}
      id="ke-sach"
      className="relative h-svh overflow-hidden"
      style={{ background: '#1a3a26', color: 'var(--fg)', ['--fg' as string]: '#f6e9d7' }}
    >
      {/* giant outlined name behind the ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[30%] lg:top-[26%] z-0 flex justify-center overflow-hidden"
      >
        <span
          key={cur.id}
          className="ks-name display whitespace-nowrap text-[clamp(4.5rem,21vw,24rem)] leading-none"
          style={{ color: 'transparent', WebkitTextStroke: '2px var(--fg)', opacity: 0.55 }}
        >
          {cur.name}
        </span>
      </div>

      <p className="absolute left-[clamp(1rem,3vw,2.5rem)] top-16 lg:top-20 z-20 text-[0.68rem] tracking-[0.3em] uppercase">
        02 — Bảy kế sách
      </p>

      {/* 3D ring */}
      <div className="absolute inset-x-0 top-[12%] bottom-[30%] lg:bottom-[22%] z-10 grid place-items-center [perspective:1800px]">
        <div className="ks-scene relative [transform-style:preserve-3d]">
          <div
            ref={ring}
            className="relative w-[min(44vw,27svh)] lg:w-[min(20vw,31svh)] [transform-style:preserve-3d]"
            style={{ aspectRatio: '1500 / 2078' }}
          >
            {list.map((s, i) => (
              <img
                key={s.id}
                src={s.image}
                alt={`Lá kế sách ${s.name}`}
                draggable={false}
                className="ks-card card-shadow absolute inset-0 size-full rounded-[3%] object-cover"
                style={{ transform: `rotateY(${i * STEP}deg) translateZ(var(--r))` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* info */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-4 px-[clamp(1rem,3vw,2.5rem)] pb-6 lg:flex-row lg:items-end lg:justify-between lg:pb-10">
        <div key={cur.id} className="ks-info max-w-xl">
          <p className="text-[0.68rem] tracking-[0.3em] uppercase opacity-80">{cur.tag}</p>
          <h3 className="display mt-1 mb-3 text-[clamp(1.8rem,3.6vw,3.4rem)] !font-bold">{cur.name}</h3>
          <Lines s={cur} />
        </div>
        <div className="flex items-center gap-1.5 self-start lg:self-end" role="tablist" aria-label="Chọn lá kế sách">
          {list.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={s.name}
              onClick={() => jump(i)}
              className="display grid size-9 place-items-center rounded-full border text-sm !font-bold transition-all duration-500"
              style={{
                borderColor: 'var(--fg)',
                background: i === active ? 'var(--fg)' : 'transparent',
                color: i === active ? cur.bg : 'var(--fg)',
                transform: i === active ? 'scale(1.2)' : undefined,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
