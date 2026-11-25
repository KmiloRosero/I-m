'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

import { NeuroNoiseBackground } from '@/components/ui/NeuroNoiseBackground'

export const HERO_BACKDROPS = ['neuro', 'split'] as const
export type HeroBackdropName = (typeof HERO_BACKDROPS)[number]

const STORAGE_KEY = 'hero-backdrop'
const CHANGE_EVENT = 'hero-backdrop-change'

function isBackdrop(value: unknown): value is HeroBackdropName {
  return HERO_BACKDROPS.includes(value as HeroBackdropName)
}

function readBackdrop(): HeroBackdropName {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isBackdrop(stored) ? stored : 'neuro'
  } catch {
    return 'neuro'
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

function saveBackdrop(backdrop: HeroBackdropName) {
  try {
    window.localStorage.setItem(STORAGE_KEY, backdrop)
  } catch {
    // Private mode: the choice still applies to this visit.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/**
 * Runs while the HTML is parsed, before the first paint, so a saved choice
 * shows straight away instead of flashing the default first.
 */
export const HERO_BACKDROP_SCRIPT = `try{var b=localStorage.getItem('${STORAGE_KEY}');if(b==='split'){var s=document.currentScript.parentElement;s.dataset.backdrop=b}}catch(e){}`

/** The hero's background layers: the blue shader, or a white and blue diagonal split. */
export function HeroBackdrop() {
  // Null until hydrated: the server can't know the saved choice, and the inline
  // script has already applied it, so nothing is touched before then.
  const backdrop = useSyncExternalStore(subscribe, readBackdrop, () => null)
  const layerRef = useRef<HTMLDivElement>(null)

  // The attribute lives on the hero so its text and buttons can follow the background.
  useEffect(() => {
    const hero = layerRef.current?.parentElement
    if (hero && backdrop) hero.dataset.backdrop = backdrop
  }, [backdrop])

  return (
    <>
      {backdrop === 'neuro' ? <NeuroNoiseBackground /> : null}
      <div aria-hidden="true" className="hero-split pointer-events-none absolute inset-0" ref={layerRef} />
    </>
  )
}

interface HeroBackdropSwitchProps {
  label: string
  names: Record<HeroBackdropName, string>
}

export function HeroBackdropSwitch({ label, names }: HeroBackdropSwitchProps) {
  const backdrop = useSyncExternalStore(subscribe, readBackdrop, () => null)

  return (
    <div aria-label={label} className="hero-backdrop-switch" role="group">
      {HERO_BACKDROPS.map((name) => (
        <button
          aria-pressed={backdrop === null ? undefined : backdrop === name}
          className="hero-backdrop-option"
          data-backdrop={name}
          key={name}
          onClick={() => saveBackdrop(name)}
          title={names[name]}
          type="button"
        >
          <span className="sr-only">{names[name]}</span>
        </button>
      ))}
    </div>
  )
}
