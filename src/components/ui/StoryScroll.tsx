'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const ENTRY_ROTATION_DEGREES = 30

export function StoryScroll({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container || prefersReducedMotion) return

      const tracks = Array.from(container.querySelectorAll<HTMLElement>('.story-track'))
      const triggers: ScrollTrigger[] = []
      container.dataset['storyActive'] = 'true'

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(({ target }) => {
          if (target instanceof HTMLElement) {
            target.parentElement?.style.setProperty('--story-height', `${target.offsetHeight}px`)
          }
        })
        ScrollTrigger.refresh()
      })

      tracks.forEach((track, index) => {
        gsap.set(track, { zIndex: index + 1 })
        const inner = track.querySelector<HTMLElement>('.story-section-inner')
        if (!inner) return
        resizeObserver.observe(inner)
        if (index === 0) return

        gsap.set(inner, { rotation: ENTRY_ROTATION_DEGREES, transformOrigin: 'top left' })
        const tween = gsap.to(inner, {
          ease: 'none',
          rotation: 0,
          scrollTrigger: { end: 'top 25%', scrub: true, start: 'top bottom', trigger: track },
        })
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      })

      // Opened on an anchor (#contacto, or after switching language)? Each refresh
      // above can still move the sections, so land on it again after every one,
      // until the visitor scrolls on their own.
      const hash = decodeURIComponent(window.location.hash.slice(1))
      const anchor = hash ? document.getElementById(hash) : null
      let settled = !anchor
      const settle = () => {
        settled = true
      }
      const realign = () => {
        if (!settled) anchor?.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
      const userInputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
      if (anchor) {
        ScrollTrigger.addEventListener('refresh', realign)
        userInputs.forEach((type) => window.addEventListener(type, settle, { once: true, passive: true }))
      }

      return () => {
        resizeObserver.disconnect()
        triggers.forEach((trigger) => trigger.kill())
        ScrollTrigger.removeEventListener('refresh', realign)
        userInputs.forEach((type) => window.removeEventListener(type, settle))
        delete container.dataset['storyActive']
      }
    },
    { dependencies: [prefersReducedMotion], revertOnUpdate: true, scope: containerRef },
  )

  return (
    <div className="story-scroll" ref={containerRef}>
      {children}
    </div>
  )
}
