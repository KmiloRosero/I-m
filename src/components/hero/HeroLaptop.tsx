'use client'

import { Laptop, Power, RotateCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { personalInfo } from '@/data/personalInfo'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { getCvLinks } from '@/utils/professionalLinks'
import { LaptopPhoto } from './LaptopPhoto'
import type { LaptopScene, LaptopSceneState, LaptopView } from './laptop3d/LaptopScene'
import type { ScreenContent } from './laptop3d/ScreenPainter'

type Status = 'loading' | 'ready' | 'fallback'

const VIEW_BUTTONS: { view: LaptopView; label: string }[] = [
  { view: 'threeQuarter', label: '3/4' },
  { view: 'front', label: 'Frente' },
  { view: 'side', label: 'Lado' },
  { view: 'back', label: 'Atrás' },
  { view: 'top', label: 'Arriba' },
  { view: 'bottom', label: 'Abajo' },
]

const MONO_FONT = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"

/**
 * The hero's MSI Cyborg 15, as a real-time 3D model: orbit it, open and close
 * the lid, press its keys (or type on your own keyboard), turn the screen off.
 * Falls back to a photo where WebGL is unavailable.
 */
export function HeroLaptop() {
  const reducedMotion = usePrefersReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<LaptopScene | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [state, setState] = useState<LaptopSceneState>({ lidOpen: true, screenOn: true, autoRotate: false })
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
          onState: setState,
          onFirstInteraction: () => setShowHint(false),
        })
        sceneRef.current = scene
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('fallback')
      }
    })()

    return () => {
      cancelled = true
      scene?.dispose()
      sceneRef.current = null
    }
  }, [reducedMotion])

  const ready = status === 'ready'

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

      {ready ? (
        <div className="laptop3d-controls">
          <div aria-label="Ángulo de vista" className="laptop3d-group" role="group">
            {VIEW_BUTTONS.map(({ view, label }) => (
              <button
                className="laptop3d-button"
                key={view}
                onClick={() => sceneRef.current?.setView(view)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          <div aria-label="Acciones del portátil" className="laptop3d-group" role="group">
            <button className="laptop3d-button" onClick={() => sceneRef.current?.toggleLid()} type="button">
              <Laptop aria-hidden="true" />
              {state.lidOpen ? 'Cerrar' : 'Abrir'}
            </button>
            <button
              aria-pressed={state.screenOn}
              className="laptop3d-button"
              onClick={() => sceneRef.current?.toggleScreen()}
              type="button"
            >
              <Power aria-hidden="true" />
              Pantalla
            </button>
            {reducedMotion ? null : (
              <button
                aria-pressed={state.autoRotate}
                className="laptop3d-button"
                onClick={() => sceneRef.current?.setAutoRotate(!state.autoRotate)}
                type="button"
              >
                <RotateCw aria-hidden="true" />
                Girar
              </button>
            )}
          </div>
          <p aria-hidden={!showHint} className="laptop3d-hint" data-visible={showHint}>
            Arrastra para girarlo · arrastra la pantalla para cerrarlo · pulsa las teclas o escribe
          </p>
        </div>
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
