'use client'

import { useEffect, useRef, useState } from 'react'
import { personalInfo } from '@/data/personalInfo'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { getCvLinks } from '@/utils/professionalLinks'
import { LaptopPhoto } from './LaptopPhoto'
import type { LaptopScene } from './laptop3d/LaptopScene'
import type { ScreenContent } from './laptop3d/ScreenPainter'

type Status = 'loading' | 'ready' | 'fallback'

const MONO_FONT = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"

/**
 * The hero's MSI Cyborg 15, as a real-time 3D model: drag to orbit it, drag
 * the lid to close it (tap to open), press its keys or type on your own keyboard.
 * Falls back to a photo where WebGL is unavailable.
 */
export function HeroLaptop() {
  const reducedMotion = usePrefersReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    let cancelled = false
    let scene: LaptopScene | null = null

    void (async () => {
      try {
        const fonts = readFonts()
        await Promise.all([
          document.fonts.load(`900 64px ${fonts.display}`),
          document.fonts.load(`700 64px ${fonts.display}`),
          document.fonts.load(`400 32px ${fonts.body}`),
        ]).catch(() => undefined)
        if (!supportsWebGL()) throw new Error('WebGL unavailable')
        const { LaptopScene } = await import('./laptop3d/LaptopScene')
        if (cancelled) return
        scene = new LaptopScene({
          container: viewport,
          content: screenContent(fonts),
          reducedMotion,
          onFirstInteraction: () => setShowHint(false),
        })
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('fallback')
      }
    })()

    return () => {
      cancelled = true
      scene?.dispose()
    }
  }, [reducedMotion])

  return (
    <div className="laptop3d" data-status={status}>
      <div
        aria-label={`Modelo 3D interactivo del portátil MSI Cyborg 15 con el perfil de ${personalInfo.name}`}
        className="laptop3d-viewport"
        ref={viewportRef}
        role="img"
      >
        {status === 'loading' ? <span aria-hidden="true" className="laptop3d-loader" /> : null}
      </div>

      <LaptopPhoto hidden={status !== 'fallback'} />

      {status === 'ready' ? (
        <p aria-hidden={!showHint} className="laptop3d-hint" data-visible={showHint}>
          Arrastra para girarlo · arrastra la pantalla para cerrarlo · pulsa las teclas o escribe
        </p>
      ) : null}
    </div>
  )
}

function readFonts(): ScreenContent['fonts'] {
  const styles = getComputedStyle(document.documentElement)
  const display = styles.getPropertyValue('--font-display').trim() || 'sans-serif'
  const body = styles.getPropertyValue('--font-body').trim() || 'serif'
  return { display, body, mono: MONO_FONT }
}

function screenContent(fonts: ScreenContent['fonts']): ScreenContent {
  return {
    name: personalInfo.name,
    title: personalInfo.title,
    meta: `${personalInfo.position} · ${personalInfo.location.split(',')[0]}, CO`,
    stack: personalInfo.featuredStack.slice(0, 4),
    links: [...personalInfo.socialLinks, ...getCvLinks()],
    photoSrc: '/images/profile/camilo-rosero.png',
    fonts,
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}
