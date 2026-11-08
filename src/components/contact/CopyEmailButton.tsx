'use client'

import { useEffect, useRef, useState } from 'react'

type CopyState = 'idle' | 'copied' | 'failed'

const LABELS: Record<CopyState, string> = {
  idle: 'Copiar correo',
  copied: '¡Copiado!',
  failed: 'Cópialo a mano',
}

export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>('idle')
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setState('copied')
    } catch {
      setState('failed')
    }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 2200)
  }

  return (
    <button className="contact-copy" data-state={state} onClick={copy} type="button">
      <span aria-live="polite">{LABELS[state]}</span>
    </button>
  )
}
