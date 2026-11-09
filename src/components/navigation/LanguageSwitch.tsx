'use client'

import { usePathname } from 'next/navigation'
import type { MouseEvent } from 'react'
import { locales, otherLocale } from '@/i18n/config'
import { useLocale, useMessages } from '@/i18n/LocaleProvider'
import { translateHash, translatePath } from '@/i18n/paths'

/** ES · EN: links to this same page in the other language, keeping the section the reader is on. */
export function LanguageSwitch() {
  const locale = useLocale()
  const copy = useMessages().header
  const pathname = usePathname()
  const target = otherLocale(locale)
  const href = translatePath(pathname, target)

  // Carry the reader's section over: the link picks up the translated anchor
  // just before the browser follows it.
  const keepSection = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.hash = translateHash(window.location.hash, locale, target)
  }

  return (
    <div aria-label={copy.language} className="language-switch" role="group">
      {locales.map((code) =>
        code === locale ? (
          <span aria-current="true" className="language-option" key={code} lang={code}>
            {code.toUpperCase()}
          </span>
        ) : (
          <a
            aria-label={copy.switchTo}
            className="language-option"
            href={href}
            hrefLang={code}
            key={code}
            lang={code}
            onClick={keepSection}
          >
            {code.toUpperCase()}
          </a>
        ),
      )}
    </div>
  )
}
