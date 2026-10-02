import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import cover from '../assets/bia-thuy-tran.webp'
import { cards } from '../data/cards'
import { strategies } from '../data/strategies'
import useReducedMotion from '../hooks/useReducedMotion'

const alt = 'Bìa board game Thủy trận Bạch Đằng: thuyền nhẹ cầm cờ len giữa bãi cọc nhọn, chiến thuyền buồm đỏ phía xa'

export default function Cover() {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [is3DReady, setIs3DReady] = useState(false)

  useEffect(() => {
    if (reduced || !canvas.current || !root.current) return

    let isDisposed = false
    let boxInstance: any = null
    let ctxInstance: any = null

    const initScene = async () => {
      if (isDisposed || boxInstance) return
      try {
        const { createBoxScene } = await import('./boxScene')
        if (isDisposed || !canvas.current || !root.current) return

        const box = createBoxScene({
          canvas: canvas.current,
          cover,
          cards: cards.map((c) => c.image),
          extra: strategies.map((k) => k.image),
          onHover: setActive,
        })
        boxInstance = box
        const st = box.state
        setIs3DReady(true)

        ctxInstance = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: '+=820%',
              pin: true,
              scrub: 0.6,
              onUpdate: (t) => setOpen(t.progress > 0.58 && t.progress < 0.7),
            },
          })
          tl.fromTo(st, { elev: 1.3, yaw: -0.5, zoom: 0.9 }, { elev: 1.0, yaw: -0.25, zoom: 1, ease: 'power3.out', duration: 1 }, 0)
          tl.to(st, { lift: 7, lidTilt: -0.1, ease: 'power2.inOut', duration: 1.4 }, 1)
          tl.to(st, { rise: 1, elev: 0.3, yaw: 0, zoom: 1.25, shift: 0.9, ease: 'power2.inOut', duration: 1.4 }, 2.2)
          tl.to(st, { drop: 8, ease: 'power2.in', duration: 1 }, 3.4)
          st.fan.forEach((_, i) => tl.to(st.fan, { [i]: 1, ease: 'power2.out', duration: 0.9 }, 4.2 + i * 0.1))
          tl.fromTo('.bx-side', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6 }, 5.2)
          tl.to({}, { duration: 0.6 })
          tl.to('.bx-side', { opacity: 0, x: -30, duration: 0.5 }, '>')
          const t0 = tl.duration() - 0.5
          tl.to(st, { swap: 1, zoom: 1.1, elev: 0.26, shift: 0, ease: 'power2.inOut', duration: 1.3 }, t0)
          st.fan2.forEach((_, i) => tl.to(st.fan2, { [i]: 1, ease: 'power2.out', duration: 0.9 }, t0 + 0.7 + i * 0.1))
          tl.to(root.current, { backgroundColor: '#e6cfa6', duration: 1.2, ease: 'none' }, '>-0.5')
          tl.to({}, { duration: 0.4 })
        }, root)
      } catch (err) {
        console.error('Failed to load 3D box scene:', err)
      }
    }

    // Lazy load Three.js box scene on first user scroll or when approaching viewport
    const onScrollOrTouch = () => {
      initScene()
      window.removeEventListener('scroll', onScrollOrTouch)
      window.removeEventListener('touchstart', onScrollOrTouch)
    }
    window.addEventListener('scroll', onScrollOrTouch, { once: true, passive: true })
    window.addEventListener('touchstart', onScrollOrTouch, { once: true, passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          initScene()
          observer.disconnect()
        }
      },
      { rootMargin: '150px' }
    )

    observer.observe(root.current)

    return () => {
      isDisposed = true
      window.removeEventListener('scroll', onScrollOrTouch)
      window.removeEventListener('touchstart', onScrollOrTouch)
      observer.disconnect()
      ctxInstance?.revert()
      boxInstance?.dispose()
    }
  }, [reduced])

  if (reduced) {
    return (
      <section className="bg-[#ffb627] px-4 py-16 text-ink" aria-label="Bìa hộp">
        <img src={cover} alt={alt} className="mx-auto w-full max-w-xl" loading="lazy" decoding="async" />
      </section>
    )
  }

  const c = active !== null ? cards[active] : null

  return (
    <section
      ref={root}
      className="relative h-svh overflow-hidden bg-[#ffb627] text-ink"
      aria-label="Hộp Thủy trận Bạch Đằng"
    >
      <div className="bx-side absolute top-1/2 left-[clamp(1rem,3vw,2.5rem)] z-20 hidden max-w-[19rem] -translate-y-1/2 lg:block">
        <p className="text-[0.68rem] tracking-[0.3em] uppercase">
          <span className="text-vermilion">00</span> — Trong hộp
        </p>
        {c ? (
          <div key={c.id} className="ks-info mt-4">
            <p className="text-[0.68rem] tracking-[0.25em] text-vermilion uppercase">{c.prefix ?? 'Lệnh bài'}</p>
            <p className="display text-[clamp(2.4rem,4.4vw,4.6rem)] !font-bold leading-[0.92]">{c.role}</p>
            <p className="mt-3 font-semibold">{c.skill}</p>
            <p className="mt-1 text-[0.95rem] leading-snug">{c.text}</p>
          </div>
        ) : (
          <p className="display mt-4 text-[clamp(2.4rem,4.4vw,4.6rem)] !font-bold leading-[0.92]">
            Sáu lệnh bài,
            <br />
            <span className="text-vermilion">bảy kế sách.</span>
          </p>
        )}
      </div>

      <p className="absolute right-[clamp(1rem,3vw,2.5rem)] bottom-[4svh] z-20 hidden text-right text-[0.68rem] tracking-[0.25em] uppercase md:block">
        {open ? 'Rê chuột lên từng lá bài' : 'Cuộn để mở hộp'}
      </p>

      {/* Static cover placeholder while 3D scene loads */}
      <div
        className={`absolute inset-0 z-[5] grid place-items-center transition-opacity duration-700 pointer-events-none ${
          is3DReady ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <img
          src={cover}
          alt={alt}
          className="w-[min(72vw,440px)] rounded-[3%] card-shadow object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>

      <canvas ref={canvas} className="absolute inset-0 size-full touch-pan-y" role="img" aria-label={alt} />
      <p className="sr-only">
        {cards.map((cd) => `${cd.role}: ${cd.skill}`).join('. ')}
      </p>
    </section>
  )
}
