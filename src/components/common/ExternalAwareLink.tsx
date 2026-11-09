import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import type { SocialLink } from '@/types/personalInfo'

interface ExternalAwareLinkProps extends SocialLink {
  context?: string
  locale: Locale
}

export function ExternalAwareLink({ context, label, locale, url }: ExternalAwareLinkProps) {
  const isExternal = url.startsWith('https://')
  const copy = getMessages(locale).common

  return (
    <a
      className="text-link"
      href={url}
      rel={isExternal ? 'noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      {label}
      {context ? <span className="sr-only">{copy.linkContext(context)}</span> : null}
      {isExternal ? <span className="sr-only">{copy.opensInNewTab}</span> : null}
    </a>
  )
}
