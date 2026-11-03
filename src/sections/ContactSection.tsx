import { Section } from '@/components/ui/Section'
import { personalInfo } from '@/data/personalInfo'

function getContactLinks() {
  const links = [
    { label: personalInfo.email, url: `mailto:${personalInfo.email}` },
    ...personalInfo.socialLinks,
  ]
  return personalInfo.cvUrl ? [...links, { label: 'Ver CV', url: personalInfo.cvUrl }] : links
}

export function ContactSection() {
  return (
    <Section id="contacto" title="Contacto" tone="cobalt">
      <ul className="mt-10 flex flex-col gap-2 text-2xl">
        {getContactLinks().map(({ label, url }) => (
          <li key={url}>
            <a className="text-link" href={url}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
