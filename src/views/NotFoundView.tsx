import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { homePath } from '@/i18n/paths'

export function NotFoundView({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).notFound

  return (
    <main
      className="flex min-h-dvh flex-col justify-center gap-6 bg-red px-gutter pt-24 pb-10 text-white"
      id="contenido"
    >
      <div className="mx-auto w-full max-w-content">
        <h1 className="section-title">{copy.heading}</h1>
        <p className="lead-text mt-6 max-w-text">{copy.body}</p>
        <Link className="button-link mt-8 w-fit" data-variant="primary" href={homePath(locale)}>
          {copy.home}
        </Link>
      </div>
    </main>
  )
}
