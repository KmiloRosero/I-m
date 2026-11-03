import type { SocialLink } from '@/types/personalInfo'

export function ExternalAwareLink({ label, url }: SocialLink) {
  const isExternal = url.startsWith('https://')

  return (
    <a
      className="text-link"
      href={url}
      rel={isExternal ? 'noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      {label}
    </a>
  )
}
