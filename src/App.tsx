import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './components/Header'
import Hero from './components/Hero'
import Cover from './components/Cover'
import Manifesto from './components/Manifesto'
import Roles from './components/Roles'
import Strategies from './components/Strategies'
import Finale from './components/Finale'
import River from './components/River'
import Curtain from './components/Curtain'
import Cursor from './components/Cursor'

gsap.registerPlugin(ScrollTrigger)
if (typeof window !== 'undefined') {
  ;(window as any).ScrollTrigger = ScrollTrigger
  ;(window as any).gsap = gsap
}

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!ready) {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = ''
      ScrollTrigger.refresh()
    }
  }, [ready])

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <main className="grain relative">
      <Curtain onReady={() => setReady(true)} />
      <Cursor />
      <Header />
      <Hero ready={ready} />
      <Cover />
      <Manifesto />
      <Roles />
      <Strategies />
      <Finale />
      <River />
    </main>
  )
}

