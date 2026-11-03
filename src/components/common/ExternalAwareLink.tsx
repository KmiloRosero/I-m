import type { SocialLink } from '@/types/personalInfo'

interface ExternalAwareLinkProps extends SocialLink {
  context?: string
}

export function ExternalAwareLink({ context, label, url }: ExternalAwareLinkProps) {
  const isExternal = url.startsWith('https://')

  return (
    <a
      className="text-link"
      href={url}
      rel={isExternal ? 'noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      {label}
      {context ? <span className="sr-only"> de {context}</span> : null}
      {isExternal ? <span className="sr-only"> (se abre en una pestaña nueva)</span> : null}
    </a>
  )
}
