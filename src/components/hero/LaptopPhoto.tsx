'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { personalInfo } from '@/data/personalInfo'
import { getCvLinks } from '@/utils/professionalLinks'
import { expandQuad, quadTransform, type Quad } from '@/utils/quadTransform'

/** Width of the laptop photo (1423 × 963), and its display measured on it (TL, TR, BR, BL). */
const ART_WIDTH = 1423
const SCREEN_QUAD: Quad = [
  { x: 656, y: 118 },
  { x: 1387, y: 34 },
  { x: 1301, y: 598 },
  { x: 565, y: 570 },
]
const SCREEN_ASPECT = 9 / 16

const profileLinks = [...personalInfo.socialLinks, ...getCvLinks()]

/**
 * The laptop as a still photo with the profile laid onto its display.
 * Shown where WebGL is unavailable, or without JavaScript.
 */
export function LaptopPhoto({ hidden }: { hidden: boolean }) {
  const artRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const art = artRef.current
    const screen = screenRef.current
    if (!art || !screen || hidden) return

    const fit = () => {
      const scale = art.clientWidth / ART_WIDTH
      const [tl, tr, br, bl] = SCREEN_QUAD.map(({ x, y }) => ({ x: x * scale, y: y * scale }))
      if (!scale || !tl || !tr || !br || !bl) return
      const quad = expandQuad([tl, tr, br, bl], 1.5)
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
  }, [hidden])

  return (
    <div className="laptop-photo" data-hidden={hidden} hidden={hidden}>
      <div className="laptop-art" ref={artRef}>
        <Image
          alt={`Portátil MSI Cyborg 15 con el perfil de ${personalInfo.name}`}
          className="laptop-image"
          draggable={false}
          fill
          sizes="(min-width: 64rem) 42vw, 92vw"
          src="/images/hero/msi-cyborg-15.webp"
        />
        <div className="laptop-screen" ref={screenRef}>
          <div className="laptop-ui">
            <div aria-hidden="true" className="laptop-ui-bar">
              <span className="laptop-ui-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="laptop-ui-url">portafolio / {personalInfo.firstName.toLowerCase()}</span>
            </div>
            <div className="laptop-ui-main">
              <div className="laptop-ui-photo">
                <Image
                  alt=""
                  className="object-cover object-[50%_25%]"
                  draggable={false}
                  fill
                  sizes="(min-width: 64rem) 12vw, 30vw"
                  src={personalInfo.photoSrc}
                />
              </div>
              <div className="laptop-ui-info">
                <p aria-hidden="true" className="laptop-ui-hello">
                  Hola, soy
                </p>
                <p className="laptop-ui-name">{personalInfo.name}</p>
                <p className="laptop-ui-role">{personalInfo.title}</p>
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
          </div>
        </div>
      </div>
    </div>
  )
}
