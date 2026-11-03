import { ExternalAwareLink } from '@/components/common/ExternalAwareLink'
import { Section } from '@/components/ui/Section'
import { personalInfo } from '@/data/personalInfo'
import { getCvLinks } from '@/utils/professionalLinks'

export function ContactSection() {
  const [emailUser, emailDomain] = personalInfo.email.split('@')
  const links = [...personalInfo.socialLinks, ...getCvLinks()]

  return (
    <Section id="contacto" title="Contacto" tone="cobalt">
      <p className="lead-text mt-6 max-w-text">
        Si quieres hablar de un proyecto, escríbeme a este correo.
      </p>
      <a className="contact-email" href={`mailto:${personalInfo.email}`}>
        {emailUser}
        <wbr />@{emailDomain}
      </a>
      <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-2xl">
        {links.map((link) => (
          <li key={link.url}>
            <ExternalAwareLink {...link} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
