'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { personalInfo } from '@/data/personalInfo'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { LaptopBody } from '@/utils/laptopPhysics'
import { getCvLinks } from '@/utils/professionalLinks'
import { expandQuad, quadTransform, type Quad } from '@/utils/quadTransform'

/** Width of the laptop artwork (1423 × 963), and its display measured on it (TL, TR, BR, BL). */
const ART_WIDTH = 1423
const SCREEN_QUAD: Quad = [
  { x: 656, y: 118 },
  { x: 1387, y: 34 },
  { x: 1301, y: 598 },
  { x: 565, y: 570 },
]
/** The Cyborg 15 panel is 16:9. */
const SCREEN_ASPECT = 9 / 16
/** Pointer travel before a press counts as a drag instead of a tap. */
const DRAG_THRESHOLD = 6
/** The entrance drops it in from above, turned a little, already falling. */
const ENTRANCE = { y: -160, vy: 260, angle: -7 }

const profileLinks = [...personalInfo.socialLinks, ...getCvLinks()]
const stack = personalInfo.featuredStack.slice(0, 3)

export function HeroLaptop() {
  const reducedMotion = usePrefersReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLSpanElement>(null)

  // Lays the flat screen element onto the photographed display.
  useEffect(() => {
    const art = artRef.current
    const screen = screenRef.current
    if (!art || !screen) return

    const fit = () => {
      const scale = art.clientWidth / ART_WIDTH
      if (!scale) return
      const [tl, tr, br, bl] = SCREEN_QUAD.map(({ x, y }) => ({ x: x * scale, y: y * scale }))
      if (!tl || !tr || !br || !bl) return
      // A hair of overscan so none of the photo's own screen shows at the edges.
      const quad = expandQuad([tl, tr, br, bl], 1.5)
      // Sized close to the drawn display so the text renders near 1:1 and stays crisp.
      const width = Math.hypot(quad[1].x - quad[0].x, quad[1].y - quad[0].y)
      const height = width * SCREEN_ASPECT
      screen.style.width = `${width}px`
      screen.style.height = `${height}px`
      screen.style.transform = quadTransform(width, height, quad)
      screen.dataset.fitted = 'true'
    }

    const observer = new ResizeObserver(fit)
    observer.observe(art)
    fit()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    const body = bodyRef.current
    const tilt = tiltRef.current
    const shadow = shadowRef.current
    if (!stage || !body || !tilt || !shadow) return

    if (reducedMotion) {
      body.style.transform = ''
      tilt.style.transform = ''
      tilt.style.removeProperty('--lean')
      shadow.style.transform = ''
      shadow.style.opacity = ''
      stage.dataset.ready = 'true'
      return
    }

    const laptop = new LaptopBody(ENTRANCE)
    let frame = 0
    let lastTime = 0
    let isVisible = true

    const render = () => {
      const { x, y } = laptop.position
      const lift = Math.max(0, -y)
      body.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${laptop.angle.toFixed(3)}deg)`
      tilt.style.transform = `rotateX(${laptop.tilt.x.toFixed(3)}deg) rotateY(${laptop.tilt.y.toFixed(3)}deg)`
      tilt.style.setProperty('--lean', laptop.tilt.y.toFixed(2))
      // The floor shadow stays on the floor: it follows x, shrinks and fades as the laptop rises.
      const spread = Math.max(0.55, 1 - lift / 420)
      shadow.style.transform = `translateX(${x.toFixed(2)}px) scale(${spread.toFixed(3)})`
      shadow.style.opacity = Math.max(0.25, 1 - lift / 300).toFixed(3)
    }

    const tick = (time: number) => {
      frame = 0
      const seconds = lastTime ? Math.min((time - lastTime) / 1000, 1 / 20) : 1 / 60
      lastTime = time
      laptop.advance(seconds)
      if (laptop.atRest) {
        laptop.settle()
        render()
        return
      }
      render()
      if (isVisible) frame = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (frame || !isVisible) return
      lastTime = 0
      frame = requestAnimationFrame(tick)
    }

    // How far it can be pulled: about its own size, so it never leaves the hero.
    const measure = () => laptop.setReach({ x: body.offsetWidth * 0.55, y: body.offsetHeight * 0.45 })
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(body)
    measure()

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true
      if (isVisible) wake()
    })
    visibilityObserver.observe(stage)

    render()
    stage.dataset.ready = 'true'
    wake()

    let pointerId: number | null = null
    let startX = 0
    let startY = 0
    let dragged = false

    // Pointer offset from where the press started, in the body's resting space.
    let grabOrigin = { x: 0, y: 0 }
    const toOffset = (event: PointerEvent) => ({
      x: event.clientX - grabOrigin.x,
      y: event.clientY - grabOrigin.y,
    })

    const onPointerDown = (event: PointerEvent) => {
      if (pointerId !== null || (event.pointerType === 'mouse' && event.button !== 0)) return
      pointerId = event.pointerId
      startX = event.clientX
      startY = event.clientY
      dragged = false
      const { x, y } = laptop.position
      grabOrigin = { x: event.clientX - x, y: event.clientY - y }
      laptop.grab(toOffset(event))
      wake()
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return
      if (!dragged && Math.hypot(event.clientX - startX, event.clientY - startY) >= DRAG_THRESHOLD) {
        dragged = true
        stage.dataset.dragging = 'true'
      }
      laptop.moveTo(toOffset(event))
      wake()
    }

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return
      pointerId = null
      laptop.release()
      delete stage.dataset.dragging
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      const pressedControl = event.target instanceof Element && event.target.closest('a, button')
      if (!dragged && event.type === 'pointerup' && !pressedControl) {
        const rect = body.getBoundingClientRect()
        laptop.hop(event.clientX < rect.left + rect.width / 2 ? -1 : 1)
      }
      wake()
    }

    // A drag that ends on a link must not also open it.
    const onClickCapture = (event: MouseEvent) => {
      if (!dragged) return
      event.preventDefault()
      event.stopPropagation()
      dragged = false
    }

    // Hover lean, for fine pointers only.
    const onHover = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || pointerId !== null) return
      const rect = body.getBoundingClientRect()
      laptop.hover({
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
      })
      wake()
    }

    const onLeave = () => {
      laptop.hover(null)
      wake()
    }

    body.addEventListener('pointerdown', onPointerDown)
    body.addEventListener('pointermove', onHover)
    body.addEventListener('pointerleave', onLeave)
    body.addEventListener('click', onClickCapture, true)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      body.removeEventListener('pointerdown', onPointerDown)
      body.removeEventListener('pointermove', onHover)
      body.removeEventListener('pointerleave', onLeave)
      body.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [reducedMotion])

  return (
    <div className="laptop-stage" ref={stageRef}>
      <div className="laptop-dock">
        <span aria-hidden="true" className="laptop-glow" />
        <span aria-hidden="true" className="laptop-shadow" ref={shadowRef} />

        <div
          aria-label={`Portátil con el perfil de ${personalInfo.name}`}
          className="laptop-body"
          ref={bodyRef}
          role="group"
        >
          <div className="laptop-float">
            <div className="laptop-tilt" ref={tiltRef}>
              <div className="laptop-art" ref={artRef}>
                <Image
                  alt=""
                  className="laptop-image"
                  draggable={false}
                  fill
                  preload
                  sizes="(min-width: 64rem) 42vw, 92vw"
                  src="/images/hero/msi-cyborg-15.webp"
                />
                <span aria-hidden="true" className="laptop-hit" />

                <div className="laptop-screen" ref={screenRef}>
                  <div className="laptop-ui">
                    <div aria-hidden="true" className="laptop-ui-bar">
                      <span className="laptop-ui-dots">
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className="laptop-ui-url">portafolio / {personalInfo.firstName.toLowerCase()}</span>
                      <span className="laptop-ui-live">
                        <i /> en línea
                      </span>
                    </div>

                    <div className="laptop-ui-main">
                      <div className="laptop-ui-photo">
                        <Image
                          alt={`Fotografía de ${personalInfo.name}`}
                          className="object-cover object-[50%_25%]"
                          draggable={false}
                          fill
                          sizes="(min-width: 64rem) 12vw, 30vw"
                          src="/images/profile/camilo-rosero.png"
                        />
                      </div>

                      <div className="laptop-ui-info">
                        <p aria-hidden="true" className="laptop-ui-hello">
                          Hola, soy
                        </p>
                        <p className="laptop-ui-name">{personalInfo.name}</p>
                        <p className="laptop-ui-role">{personalInfo.title}</p>
                        <p className="laptop-ui-meta">
                          {personalInfo.position} · {personalInfo.location.split(',')[0]}, CO
                        </p>
                        <ul aria-label="Tecnologías principales" className="laptop-ui-stack">
                          {stack.map((name) => (
                            <li key={name}>{name}</li>
                          ))}
                        </ul>
                        <ul className="laptop-ui-links">
                          {profileLinks.map((link) => (
                            <li key={link.url}>
                              <a href={link.url} rel="noreferrer" target="_blank">
                                {link.label}
                                <span aria-hidden="true"> ↗</span>
                                <span className="sr-only"> (se abre en una pestaña nueva)</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <p aria-hidden="true" className="laptop-ui-terminal">
                      <span>~/portafolio</span> $ npm run dev <b>✓ listo</b>
                      <i className="laptop-ui-caret" />
                    </p>
                  </div>
                  <span aria-hidden="true" className="laptop-ui-glare" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
