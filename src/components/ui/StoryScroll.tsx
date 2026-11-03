'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Children, useRef, type CSSProperties, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const ENTRY_ROTATION_DEGREES = 30

interface FlowSectionProps {
  'aria-label'?: string
  children: ReactNode
  className?: string
  style?: CSSProperties | undefined
}

export function FlowSection({ 'aria-label': ariaLabel, children, className, style }: FlowSectionProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={`story-section ${className ?? ''}`}
      data-flow-section
    >
      <div className="story-section-inner" style={style}>
        {children}
      </div>
    </section>
  )
}

interface FlowArtProps {
  'aria-label'?: string
  children: ReactNode
  className?: string
  navSectionId?: string
}

export function FlowArt({ 'aria-label': ariaLabel, children, className, navSectionId }: FlowArtProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const sectionCount = Children.count(children)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container || prefersReducedMotion) return

      const sections = Array.from(container.querySelectorAll<HTMLElement>('[data-flow-section]'))
      const triggers: ScrollTrigger[] = []

      sections.forEach((section, index) => {
        gsap.set(section, { zIndex: index + 1 })
        const inner = section.querySelector<HTMLElement>('.story-section-inner')
        if (!inner) return

        if (index > 0) {
          gsap.set(inner, { rotation: ENTRY_ROTATION_DEGREES, transformOrigin: 'bottom left' })
          const tween = gsap.to(inner, {
            ease: 'none',
            rotation: 0,
            scrollTrigger: { end: 'top 25%', scrub: true, start: 'top bottom', trigger: section },
          })
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
        }

        if (index < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
              start: 'bottom bottom',
              trigger: section,
            }),
          )
        }
      })

      let isActive = true
      void document.fonts.ready.then(() => {
        if (isActive) ScrollTrigger.refresh()
      })

      return () => {
        isActive = false
        triggers.forEach((trigger) => trigger.kill())
      }
    },
    { dependencies: [sectionCount, prefersReducedMotion], revertOnUpdate: true, scope: containerRef },
  )

  return (
    <div
      aria-label={ariaLabel}
      className={`story-scroll ${className ?? ''}`}
      data-nav-section={navSectionId}
      ref={containerRef}
      role="group"
    >
      {children}
    </div>
  )
}
