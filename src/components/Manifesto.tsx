import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Wave from './Wave'
import { byId, cards } from '../data/cards'
import useReducedMotion from '../hooks/useReducedMotion'

const roles = [...new Set(cards.map((c) => c.role))]
const line = 'Trên sông, không ai đi một mình. Một lệnh ban ra — thế trận tự tìm đường mà chảy.'

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const card = byId('tham-quan')

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.m-word',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.m-text',
            start: 'top 78%',
            end: 'bottom 45%',
            scrub: true,
          },
        },
      )
      gsap.fromTo(
        '.m-card',
        { yPercent: 18, rotate: 6 },
        {
          yPercent: -18,
          rotate: -4,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.fromTo(
        '.m-arch',
        { clipPath: 'inset(100% 0% 0% 0% round 50% 50% 0 0)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 50% 50% 0 0)',
          ease: 'none',
          scrollTrigger: { trigger: '.m-arch', start: 'top 95%', end: 'top 35%', scrub: true },
        },
      )
      gsap.fromTo(
        '.m-track',
        { xPercent: 0 },
        {
          xPercent: -33,
          ease: 'none',
          scrollTrigger: { trigger: '.m-track', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      )
      gsap.to('.m-diamond', {
        rotate: 225,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={root}
      className="manifesto-ground relative overflow-hidden pt-[clamp(6rem,14vw,12rem)] pb-[clamp(5rem,10vw,10rem)]"
    >
      <div className="grid grid-cols-12 gap-x-4 items-start px-[clamp(1rem,3vw,2.5rem)]">
        <p className="col-span-12 lg:col-span-2 text-[0.76rem] font-medium tracking-[0.25em] uppercase mb-10 lg:mb-0 lg:pt-4">
          <span className="text-vermilion">01</span> — Lời lệnh
        </p>

        <h2 className="m-text col-span-12 lg:col-span-7 lg:col-start-3 display !font-semibold !leading-[1.02] text-[clamp(2.4rem,6.4vw,6.6rem)]">
          {line.split(' ').map((w, i) => (
            <span key={i} className="m-word inline-block mr-[0.22em]">
              {w}
            </span>
          ))}
        </h2>

        {/* arch window with scout card */}
        <div className="col-span-7 col-start-5 lg:col-span-3 lg:col-start-10 lg:-mt-24 mt-16 relative">
          <div
            className="m-arch relative w-full overflow-hidden rounded-t-[999px]"
            style={{ background: 'linear-gradient(170deg,#e9a93a 0%,#c9782a 55%,#b5362b 100%)', aspectRatio: '3 / 4.2' }}
          >
            <img
              src={card.image}
              alt={`Lá bài ${card.role}`}
              className="m-card absolute left-1/2 top-1/2 w-[128%] max-w-none -translate-x-1/2 -translate-y-[46%] rounded-[3%] card-shadow"
              draggable={false}
              loading="lazy"
            />
          </div>
          <div className="m-diamond absolute -left-6 bottom-10 size-10 rotate-45 bg-vermilion" aria-hidden="true" />
        </div>

      </div>

      {/* role marquee */}
      <div className="mt-[clamp(3rem,7vw,7rem)] overflow-hidden text-vermilion select-none" aria-hidden="true">
        <div className="m-track flex w-max items-center gap-[0.5em] display text-[clamp(4.5rem,13vw,15rem)] pr-[0.5em]">
          {[0, 1, 2].flatMap((k) =>
            roles.map((r, i) => (
              <span key={`${k}-${r}`} className="flex items-center gap-[0.5em]">
                <span className={i % 2 ? 'text-outline' : ''}>{r}</span>
                <span className="inline-block size-[0.16em] rotate-45 bg-ochre" />
              </span>
            )),
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-[1px]">
        <Wave fill={cards[0].bg} />
      </div>
    </section>
  )
}
