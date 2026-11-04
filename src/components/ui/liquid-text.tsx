'use client'

import { useEffect, useId, useRef } from 'react'

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

/** Seconds each text stays fully readable before morphing. */
const HOLD_TIME = 2.2
/** Seconds the liquid morph between two texts lasts. */
const MORPH_TIME = 1.1
/** Blur cap in px: past this the text is already invisible, so more blur only costs paint time. */
const MAX_BLUR = 24
/** Largest frame delta accepted, so a backgrounded tab doesn't skip a whole morph on return. */
const MAX_FRAME_DELTA = 0.1

function blurFor(fraction: number): string {
  if (fraction <= 0) return `blur(${MAX_BLUR}px)`
  return `blur(${Math.min(8 / fraction - 8, MAX_BLUR)}px)`
}

function useMorphingText(texts: readonly string[], enabled: boolean, firstHoldTime: number) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const currentRef = useRef<HTMLSpanElement>(null)
  const nextRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const current = currentRef.current
    const next = nextRef.current
    if (!enabled || !container || !current || !next || texts.length < 2) return

    let index = 0
    let phase: 'hold' | 'morph' = 'hold'
    let elapsed = 0
    let lastTime: number | null = null
    let frameId = 0

    const holdTime = () => (index % texts.length === 0 ? firstHoldTime : HOLD_TIME)

    const showResting = () => {
      current.textContent = texts[index % texts.length] ?? ''
      next.textContent = texts[(index + 1) % texts.length] ?? ''
      current.style.filter = 'none'
      current.style.opacity = '1'
      next.style.filter = blurFor(0)
      next.style.opacity = '0'
    }

    const applyMorph = (fraction: number) => {
      next.style.filter = blurFor(fraction)
      next.style.opacity = String(Math.pow(fraction, 0.4))
      const inverted = 1 - fraction
      current.style.filter = blurFor(inverted)
      current.style.opacity = String(Math.pow(inverted, 0.4))
    }

    const tick = (time: number) => {
      frameId = requestAnimationFrame(tick)
      const delta = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, MAX_FRAME_DELTA)
      lastTime = time
      elapsed += delta

      if (phase === 'hold') {
        if (elapsed >= holdTime()) {
          phase = 'morph'
          elapsed = 0
        }
        return
      }

      const fraction = Math.min(elapsed / MORPH_TIME, 1)
      applyMorph(fraction)

      if (fraction === 1) {
        index++
        phase = 'hold'
        elapsed = 0
        showResting()
      }
    }

    const start = () => {
      if (frameId) return
      lastTime = null
      frameId = requestAnimationFrame(tick)
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
      frameId = 0
    }

    showResting()

    // Only animate while the text is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) start()
      else stop()
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      stop()
      index = 0
      showResting()
    }
  }, [texts, enabled, firstHoldTime])

  return { containerRef, currentRef, nextRef }
}

interface MorphingTextProps {
  className?: string
  /** Texts to cycle through. Use `\n` for a line break; set `lines` to the most lines any text uses. */
  texts: readonly string[]
  /** Lines of height to reserve, so the layout doesn't jump between texts. */
  lines?: number
  /** Seconds the first text holds before each cycle, e.g. to keep a name on screen longer. */
  firstHoldTime?: number
  /** Class on the inner wrapper, e.g. a CSS entrance animation. */
  innerClassName?: string
}

/**
 * Cycles through `texts` with a liquid morph (blur plus an SVG alpha threshold).
 * It is decorative: it renders `aria-hidden`, so callers must expose the text another way.
 * With `prefers-reduced-motion` it shows the first text without animating.
 */
function MorphingText({
  texts,
  className,
  lines = 1,
  firstHoldTime = HOLD_TIME,
  innerClassName,
}: MorphingTextProps) {
  const reducedMotion = usePrefersReducedMotion()
  const { containerRef, currentRef, nextRef } = useMorphingText(texts, !reducedMotion, firstHoldTime)
  const filterId = `morph-threshold-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  return (
    <span
      aria-hidden="true"
      className={cn('relative block w-full', className)}
      ref={containerRef}
      style={{
        height: `${lines}lh`,
        whiteSpace: lines > 1 ? 'pre-line' : 'nowrap',
        filter: reducedMotion ? undefined : `url(#${filterId}) blur(0.6px)`,
      }}
    >
      <span className={cn('absolute inset-0 block', innerClassName)}>
        <span className="absolute inset-x-0 top-0 block" ref={currentRef}>
          {texts[0]}
        </span>
        <span className="absolute inset-x-0 top-0 block opacity-0" ref={nextRef}>
          {texts[1]}
        </span>
      </span>
      <svg className="absolute size-0" focusable="false">
        <defs>
          <filter height="160%" id={filterId} width="130%" x="-15%" y="-30%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </span>
  )
}

export { MorphingText }
