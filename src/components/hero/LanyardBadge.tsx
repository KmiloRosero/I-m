'use client'

import { RotateCcw } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { personalInfo } from '@/data/personalInfo'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { Lanyard, strapPath, type LanyardLayout, type Point } from '@/utils/lanyardPhysics'
import { getCvLinks } from '@/utils/professionalLinks'

/** The strap is fixed this far above the stage, so it enters from off-screen. */
const ANCHOR_OFFSET = 90
/** Pointer travel before a press counts as a drag instead of a tap. */
const DRAG_THRESHOLD = 6
/** Moves under this (px per step) for this many frames put the loop to sleep. */
const REST_DISTANCE = 0.02
const REST_FRAMES = 90
/** Swing speed (px/s) to card tilt (deg), and its limit. */
const TILT_PER_SPEED = 0.014
const MAX_TILT = 22
/** Sideways push given on a flip, so the card turns on its strap. */
const FLIP_NUDGE = 5
/** The entrance starts with the card held out this far (radians) from vertical. */
const ENTRANCE_ANGLE = 0.6

const STRAP_TEXT = Array.from({ length: 10 }, () => `${personalInfo.name.toUpperCase()}  ·  `).join('')
const profileLinks = [...personalInfo.socialLinks, ...getCvLinks()]

export function LanyardBadge() {
  const [isFlipped, setIsFlipped] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const strapRef = useRef<HTMLDivElement>(null)
  const showBackRef = useRef<HTMLButtonElement>(null)
  const showFrontRef = useRef<HTMLButtonElement>(null)
  const nudgeRef = useRef<() => void>(null)
  const hasInteractedRef = useRef(false)

  useEffect(() => {
    if (!hasInteractedRef.current) return
    const target = isFlipped ? showFrontRef : showBackRef
    target.current?.focus({ preventScroll: true })
  }, [isFlipped])

  function flip() {
    hasInteractedRef.current = true
    setIsFlipped((current) => !current)
    nudgeRef.current?.()
  }

  const flipFromTap = useEffectEvent(flip)

  useEffect(() => {
    const stage = stageRef.current
    const badge = badgeRef.current
    const tilt = tiltRef.current
    const strap = strapRef.current?.querySelector('path')
    if (!stage || !badge || !tilt || !strap) return

    let lanyard: Lanyard | null = null
    let layout: LanyardLayout | null = null
    let frame = 0
    let lastTime = 0
    let restFrames = 0
    let isVisible = true

    const render = () => {
      if (!lanyard || !layout) return
      const { clip, angle } = lanyard
      const dx = clip.x - layout.clip.x
      const dy = clip.y - layout.clip.y
      badge.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad) translateX(-50%)`
      const swing = Math.max(-MAX_TILT, Math.min(MAX_TILT, lanyard.swingSpeed * TILT_PER_SPEED))
      tilt.style.setProperty('--swing', swing.toFixed(2))
      strap.setAttribute('d', strapPath(lanyard))
    }

    const tick = (time: number) => {
      frame = 0
      if (!lanyard) return
      const seconds = lastTime ? Math.min((time - lastTime) / 1000, 1 / 20) : 1 / 60
      lastTime = time
      const moved = lanyard.advance(seconds)
      render()
      restFrames = !lanyard.isDragging && moved < REST_DISTANCE ? restFrames + 1 : 0
      if (restFrames < REST_FRAMES && isVisible) frame = requestAnimationFrame(tick)
    }

    const wake = () => {
      restFrames = 0
      if (frame || reducedMotion || !isVisible) return
      lastTime = 0
      frame = requestAnimationFrame(tick)
    }

    // The badge's CSS position is its resting pose; the strap is measured from it.
    const measure = () => {
      const next: LanyardLayout = {
        anchor: { x: stage.clientWidth / 2, y: -ANCHOR_OFFSET },
        clip: { x: stage.clientWidth / 2, y: badge.offsetTop },
        badgeHeight: badge.offsetHeight,
      }
      const changed =
        !layout ||
        Math.abs(next.clip.x - layout.clip.x) > 1 ||
        Math.abs(next.clip.y - layout.clip.y) > 1 ||
        Math.abs(next.badgeHeight - layout.badgeHeight) > 1
      if (!changed) return

      const isFirst = !layout
      layout = next
      let start: Point = next.clip
      if (isFirst && !reducedMotion) {
        const length = next.clip.y - next.anchor.y
        start = {
          x: next.anchor.x + Math.sin(ENTRANCE_ANGLE) * length,
          y: next.anchor.y + Math.cos(ENTRANCE_ANGLE) * length,
        }
      }
      lanyard = new Lanyard(next, start)
      render()
      stage.dataset.ready = 'true'
      wake()
    }

    nudgeRef.current = () => {
      lanyard?.nudge(FLIP_NUDGE)
      wake()
    }

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(stage)
    resizeObserver.observe(badge)

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true
      if (isVisible) wake()
    })
    visibilityObserver.observe(stage)

    // Dragging: the pressed point of the card follows the pointer.
    let pointerId: number | null = null
    let startX = 0
    let startY = 0
    let dragged = false

    const toStage = (event: PointerEvent): Point => {
      const rect = stage.getBoundingClientRect()
      return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!lanyard || pointerId !== null || (event.pointerType === 'mouse' && event.button !== 0)) return
      pointerId = event.pointerId
      startX = event.clientX
      startY = event.clientY
      dragged = false
      const point = toStage(event)
      if (!reducedMotion) {
        lanyard.grab(lanyard.gripAt(point), point)
        wake()
      }
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId || !lanyard) return
      if (!dragged && Math.hypot(event.clientX - startX, event.clientY - startY) >= DRAG_THRESHOLD) {
        dragged = true
        stage.dataset.dragging = 'true'
      }
      if (!reducedMotion) lanyard.moveTo(toStage(event))
    }

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return
      pointerId = null
      lanyard?.release()
      delete stage.dataset.dragging
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      wake()
      const pressedControl = event.target instanceof Element && event.target.closest('a, button')
      if (!dragged && event.type === 'pointerup' && !pressedControl) flipFromTap()
    }

    // A drag that ends on a link must not also open it.
    const onClickCapture = (event: MouseEvent) => {
      if (!dragged) return
      event.preventDefault()
      event.stopPropagation()
      dragged = false
    }

    badge.addEventListener('pointerdown', onPointerDown)
    badge.addEventListener('click', onClickCapture, true)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      nudgeRef.current = null
      badge.removeEventListener('pointerdown', onPointerDown)
      badge.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [reducedMotion])

  return (
    <div className="lanyard" ref={stageRef}>
      <div aria-hidden="true" className="lanyard-strap" ref={strapRef}>
        <svg>
          <path id="lanyard-strap-path" />
          <text>
            <textPath href="#lanyard-strap-path" startOffset="40">
              {STRAP_TEXT}
            </textPath>
          </text>
        </svg>
      </div>

      <div
        aria-label={`Carnet de ${personalInfo.name}`}
        className="lanyard-badge"
        ref={badgeRef}
        role="group"
      >
        <span aria-hidden="true" className="lanyard-clip" />
        <div className="lanyard-tilt" ref={tiltRef}>
          <div className="lanyard-flip" data-flipped={isFlipped}>
            <article className="lanyard-face" data-side="front" inert={isFlipped}>
              <div className="lanyard-paper">
                <div className="lanyard-row">
                  <span className="lanyard-chip">Freelance</span>
                  <span>Pasto · CO</span>
                </div>
                <p aria-hidden="true" className="lanyard-headline">
                  Developer
                </p>
                <div className="lanyard-photo">
                  <Image
                    alt={`Fotografía de ${personalInfo.name}`}
                    className="object-cover object-[50%_30%]"
                    draggable={false}
                    fill
                    preload
                    sizes="(min-width: 1024px) 20rem, 70vw"
                    src="/images/profile/camilo-rosero.png"
                  />
                  <p className="lanyard-nameplate">{personalInfo.name}</p>
                  <p aria-hidden="true" className="lanyard-vertical">
                    {personalInfo.title}
                  </p>
                </div>
                <div className="lanyard-row lanyard-foot">
                  <span aria-hidden="true" className="lanyard-portfolio">
                    Portfolio
                  </span>
                  <button className="lanyard-turn" onClick={flip} ref={showBackRef} type="button">
                    <RotateCcw aria-hidden="true" />
                    Voltear
                  </button>
                </div>
              </div>
            </article>

            <article className="lanyard-face" data-side="back" inert={!isFlipped}>
              <div className="lanyard-paper">
                <div className="lanyard-row">
                  <span className="lanyard-chip">Contacto</span>
                  <span>KR</span>
                </div>
                <div>
                  <p className="lanyard-hello">Hola, soy {personalInfo.firstName}</p>
                  <p className="lanyard-role">
                    {personalInfo.title} en formación · {personalInfo.position}
                  </p>
                </div>
                <span aria-hidden="true" className="lanyard-barcode" />
                <ul className="lanyard-links">
                  {profileLinks.map((link) => (
                    <li key={link.url}>
                      <a href={link.url} rel="noreferrer" target="_blank">
                        <ProfileIcon label={link.label} />
                        <span className="lanyard-link-text">
                          <span className="lanyard-link-label">{link.label}</span>
                          <span className="lanyard-link-handle">{getHandle(link.url)}</span>
                        </span>
                        <span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="lanyard-row lanyard-foot">
                  <span>{personalInfo.location.split(',')[0]}, Colombia</span>
                  <button className="lanyard-turn" onClick={flip} ref={showFrontRef} type="button">
                    <RotateCcw aria-hidden="true" />
                    Volver
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}

/** "https://github.com/KmiloRosero" → "@KmiloRosero"; "…/in/name-1a2b3c4d/" → "in/name". */
function getHandle(url: string): string {
  const { hostname, pathname } = new URL(url)
  const path = pathname.replace(/^\/|\/$/g, '')
  if (hostname.endsWith('github.com')) return `@${path}`
  // LinkedIn appends a numeric id to the slug; the name reads better without it.
  return path.replace(/-[0-9a-f]{6,}$/, '') || hostname
}

function ProfileIcon({ label }: { label: string }) {
  const name = label.toLowerCase()
  if (name.includes('github')) {
    return (
      <svg aria-hidden="true" className="lanyard-link-icon" viewBox="0 0 24 24">
        <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
      </svg>
    )
  }
  if (name.includes('linkedin')) {
    return (
      <svg aria-hidden="true" className="lanyard-link-icon" viewBox="0 0 24 24">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" className="lanyard-link-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 3h7v7M21 3l-9 9M19 14v6H4V5h6" />
    </svg>
  )
}
