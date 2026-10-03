import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import SplitChars from './SplitChars'
import Wave from './Wave'
import useReducedMotion from '../hooks/useReducedMotion'
import cover from '../assets/bia-thuy-tran.webp'
import { cards } from '../data/cards'
import { strategies } from '../data/strategies'

/** Opening curtain: game-like tactical preloader that buffers assets before launching */
export default function Curtain({ onReady }: { onReady?: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [percent, setPercent] = useState(0)
  const [status, setStatus] = useState('Khởi tạo chiến trường...')
  const [done, setDone] = useState(false)
  const progressObj = useRef({ value: 0 })

  useEffect(() => {
    if (reduced) {
      onReady?.()
      setDone(true)
      return
    }

    const allImages = [cover, ...cards.map((c) => c.image), ...strategies.map((s) => s.image)]
    let loadedCount = 0
    const totalAssets = allImages.length + 1 // +1 for fonts
    let isComplete = false

    const updateProgress = (target: number, text?: string) => {
      if (text) setStatus(text)
      gsap.to(progressObj.current, {
        value: target,
        duration: 0.35,
        ease: 'power1.out',
        onUpdate: () => setPercent(Math.round(progressObj.current.value)),
      })
    }

    const triggerOpening = () => {
      if (isComplete) return
      isComplete = true

      setPercent(100)
      setStatus('Sẵn sàng ra quân!')

      setTimeout(() => {
        if (!root.current) {
          setDone(true)
          onReady?.()
          return
        }
        const tl = gsap.timeline({
          onComplete: () => {
            setDone(true)
            onReady?.()
          },
        })
        tl.to('.cu-loader', { opacity: 0, y: -12, duration: 0.35, ease: 'power2.in' })
          .to('.cu-inner', { yPercent: -30, opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.15)
          .to(root.current, { yPercent: -125, duration: 0.7, ease: 'expo.inOut' }, 0.25)
      }, 300)
    }

    const checkComplete = () => {
      loadedCount++
      const rawPct = Math.round((loadedCount / totalAssets) * 100)
      let msg = 'Nạp khí giới & lệnh bài...'
      if (rawPct > 65) msg = 'Dàn thế trận Bạch Đằng...'
      updateProgress(Math.min(95, rawPct), msg)

      if (loadedCount >= totalAssets) {
        triggerOpening()
      }
    }

    // 1. Preload fonts
    if (document.fonts) {
      document.fonts.ready.then(checkComplete).catch(checkComplete)
    } else {
      checkComplete()
    }

    // 2. Preload all card & cover textures (with cached image check)
    allImages.forEach((src) => {
      const img = new Image()
      let handled = false
      const onAssetDone = () => {
        if (handled) return
        handled = true
        checkComplete()
      }
      img.onload = onAssetDone
      img.onerror = onAssetDone
      img.src = src
      if (img.complete) {
        onAssetDone()
      }
    })

    // 3. Fallback safety timer: in case of poor network, max 2.5s then force open
    const safety = setTimeout(() => {
      triggerOpening()
    }, 2500)

    return () => clearTimeout(safety)
  }, [reduced])

  if (reduced || done) return null

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[80] flex flex-col justify-between bg-vermilion p-6 sm:p-10 text-card select-none"
    >
      {/* Top watermark / branding */}
      <div className="flex justify-between items-center text-[0.72rem] tracking-[0.25em] uppercase opacity-75 font-medium">
        <span>Bạch Đằng Thủy Trận</span>
        <span>Chiến Thuật Thẻ Bài</span>
      </div>

      {/* Center content */}
      <div className="cu-inner my-auto flex flex-col items-center text-center">
        <p className="cu display text-[clamp(4.2rem,16vw,14rem)] !font-bold leading-none tracking-[0.02em]">
          <SplitChars text="Thủy Trận" />
        </p>

        {/* Game Preloader / Tactical Loading Bar */}
        <div className="cu-loader mt-8 flex flex-col items-center">
          <div className="relative h-1.5 w-60 sm:w-80 rounded-full bg-card/25 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ochre via-[#ffe082] to-card transition-all duration-150 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="mt-3.5 flex items-center justify-between w-60 sm:w-80 text-[0.72rem] tracking-[0.2em] uppercase font-medium">
            <span className="text-card/85">{status}</span>
            <span className="font-mono text-ochre font-bold">{percent}%</span>
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="text-center text-[0.7rem] tracking-[0.25em] uppercase opacity-60 font-medium">
        Khí Giới · Lệnh Bài · Binh Pháp Đại Việt
      </div>

      <div className="absolute inset-x-0 top-full -mt-px pointer-events-none">
        <Wave fill="#b5362b" flip />
      </div>
    </div>
  )
}
