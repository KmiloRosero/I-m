'use client'

import { useEffect, useRef, useState } from 'react'
import { useMessages } from '@/i18n/LocaleProvider'

type CopyState = 'idle' | 'copied' | 'failed'

export function CopyEmailButton({ email }: { email: string }) {
  const text = useMessages().contact
  const labels: Record<CopyState, string> = { idle: text.copy, copied: text.copied, failed: text.copyFailed }
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
      <span aria-live="polite">{labels[state]}</span>
    </button>
  )
}
