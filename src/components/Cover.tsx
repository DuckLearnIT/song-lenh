import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import cover from '../assets/bia-thuy-tran.webp'
import { cards } from '../data/cards'
import { strategies } from '../data/strategies'
import { createBoxScene } from './boxScene'
import useReducedMotion from '../hooks/useReducedMotion'

const alt = 'Bìa board game Thủy trận Bạch Đằng: thuyền nhẹ cầm cờ len giữa bãi cọc nhọn, chiến thuyền buồm đỏ phía xa'

export default function Cover() {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)

  useLayoutEffect(() => {
    if (reduced || !canvas.current) return
    const box = createBoxScene({
      canvas: canvas.current,
      cover,
      cards: cards.map((c) => c.image),
      extra: strategies.map((k) => k.image),
    })
    const st = box.state
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=820%',
          pin: true,
          scrub: 0.6,
          onUpdate: (t) => setOpen(t.progress > 0.35),
        },
      })
      // Hộp box từ từ đi lên từ phía dưới vào trung tâm màn hình
      tl.fromTo(
        canvas.current,
        { y: '50vh', opacity: 0 },
        { y: '0vh', opacity: 1, ease: 'power2.out', duration: 1.4 },
        0
      )
      tl.fromTo(
        st,
        { rootY: -6, elev: 1.25, yaw: -0.4, zoom: 0.92 },
        { rootY: 0, elev: 1.0, yaw: -0.25, zoom: 1, ease: 'power2.out', duration: 1.4 },
        0
      )
      // Mở nắp hộp
      tl.to(st, { lift: 7, lidTilt: -0.1, ease: 'power2.inOut', duration: 1.4 }, 1.4)
      // Các lá bài nâng lên từ lòng hộp
      tl.to(st, { rise: 1, elev: 0.3, yaw: 0, zoom: 1.25, shift: 0.9, ease: 'power2.inOut', duration: 1.4 }, 2.8)
      // Đáy hộp chìm xuống
      tl.to(st, { drop: 8, ease: 'power2.in', duration: 1.0 }, 4.0)
      // 6 lá lệnh bài xòe ra
      st.fan.forEach((_, i) => tl.to(st.fan, { [i]: 1, ease: 'power2.out', duration: 0.9 }, 4.6 + i * 0.1))
      // Giới thiệu bên trái hiển thị
      tl.fromTo('.bx-side', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7 }, 5.5)
      tl.to({}, { duration: 1.0 })
      tl.to('.bx-side', { opacity: 0, x: -30, duration: 0.5 }, '>')
      // Chuyển sang 7 kế sách
      const t0 = tl.duration() - 0.5
      tl.to(st, { swap: 1, zoom: 1.1, elev: 0.26, shift: 0, ease: 'power2.inOut', duration: 1.3 }, t0)
      st.fan2.forEach((_, i) => tl.to(st.fan2, { [i]: 1, ease: 'power2.out', duration: 0.9 }, t0 + 0.7 + i * 0.1))
      tl.to(root.current, { backgroundColor: '#e6cfa6', duration: 1.2, ease: 'none' }, '>-0.5')
      tl.to({}, { duration: 0.4 })
    }, root)

    return () => {
      ctx.revert()
      box.dispose()
    }
  }, [reduced])

  if (reduced) {
    return (
      <section className="bg-[#ffb627] px-4 py-16 text-ink" aria-label="Bìa hộp">
        <img src={cover} alt={alt} className="mx-auto w-full max-w-xl" />
      </section>
    )
  }

  return (
    <section
      ref={root}
      className="relative h-svh overflow-hidden bg-[#ffb627] text-ink"
      aria-label="Hộp Thủy trận Bạch Đằng"
    >
      <div className="bx-side absolute top-1/2 left-[clamp(1rem,3vw,2.5rem)] z-20 hidden max-w-[21rem] -translate-y-1/2 lg:block">
        <p className="text-[0.76rem] font-medium tracking-[0.25em] uppercase">
          <span className="text-vermilion">00</span> — Trong hộp
        </p>
        <p className="display mt-4 text-[clamp(2.4rem,4.4vw,4.6rem)] !font-bold leading-[0.92]">
          Sáu lệnh bài,
          <br />
          <span className="text-vermilion">bảy kế sách.</span>
        </p>
        <p className="mt-4 text-[1.05rem] leading-relaxed opacity-85 font-normal">
          Mở nắp chiến trận Bạch Đằng — toàn bộ binh lực và mưu lược nằm trọn trong tay bạn.
        </p>
      </div>

      <p className="absolute right-[clamp(1rem,3vw,2.5rem)] bottom-[4svh] z-20 hidden text-right text-[0.76rem] font-medium tracking-[0.25em] uppercase md:block">
        {open ? 'Cuộn tiếp để khám phá' : 'Cuộn để mở hộp'}
      </p>

      <canvas ref={canvas} className="absolute inset-0 size-full touch-pan-y" role="img" aria-label={alt} />
      <p className="sr-only">
        {cards.map((cd) => `${cd.role}: ${cd.skill}`).join('. ')}
      </p>
    </section>
  )
}
