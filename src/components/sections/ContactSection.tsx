import { SectionShell } from '@/components/ui/SectionShell'
import { profile } from '@/data/profile'

function getContactLinks() {
  const links = [
    { href: `mailto:${profile.email}`, label: profile.email },
    { href: profile.githubUrl, label: 'GitHub' },
    { href: profile.linkedinUrl, label: 'LinkedIn' },
  ]
  return profile.cvUrl ? [...links, { href: profile.cvUrl, label: 'Ver CV' }] : links
}

export function ContactSection() {
  return (
    <SectionShell id="contacto" title="Contacto" tone="cobalt">
      <ul className="mt-10 flex flex-col gap-2 text-2xl">
        {getContactLinks().map(({ href, label }) => (
          <li key={href}>
            <a className="text-link" href={href}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  )
}
