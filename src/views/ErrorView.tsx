'use client'

import { useMessages } from '@/i18n/LocaleProvider'

export function ErrorView({ reset }: { reset: () => void }) {
  const copy = useMessages().error

  return (
    <main
      className="flex min-h-dvh flex-col justify-center gap-6 bg-black px-gutter pt-24 pb-10 text-white"
      id="contenido"
    >
      <div className="mx-auto w-full max-w-content">
        <h1 className="section-title">{copy.heading}</h1>
        <p className="lead-text mt-6 max-w-text">{copy.body}</p>
        <button className="button-link mt-8" data-variant="primary" onClick={reset} type="button">
          {copy.retry}
        </button>
      </div>
    </main>
  )
}
