import { CopyEmailButton } from '@/components/contact/CopyEmailButton'
import { Section } from '@/components/ui/Section'
import { personalInfo } from '@/data/personalInfo'
import { getCvLinks } from '@/utils/professionalLinks'

export function ContactSection() {
  const [emailUser, emailDomain] = personalInfo.email.split('@')
  const links = [
    ...personalInfo.socialLinks,
    ...(personalInfo.whatsappUrl ? [{ label: 'WhatsApp', url: personalInfo.whatsappUrl }] : []),
    ...getCvLinks(),
  ]

  return (
    <Section id="contacto" title="Contacto" tone="cobalt">
      <div className="contact-grid">
        <div className="contact-card">
          <p className="contact-status">
            <span aria-hidden="true" className="contact-status-dot" />
            {personalInfo.availability}
          </p>
          <p className="contact-lead">Si quieres hablar de un proyecto, escríbeme a este correo.</p>
          <a className="contact-email" href={`mailto:${personalInfo.email}`}>
            {emailUser}
            <wbr />@{emailDomain}
          </a>
          <div className="contact-actions">
            <a className="button-link" data-variant="primary" href={`mailto:${personalInfo.email}`}>
              Escribirme
            </a>
            <CopyEmailButton email={personalInfo.email} />
          </div>
        </div>

        <div className="contact-aside">
          <h3 className="contact-label">También estoy en</h3>
          <ul className="contact-links">
            {links.map((link) => {
              const isExternal = link.url.startsWith('https://')
              return (
                <li key={link.url}>
                  <a
                    className="contact-link"
                    href={link.url}
                    rel={isExternal ? 'noreferrer' : undefined}
                    target={isExternal ? '_blank' : undefined}
                  >
                    {link.label}
                    <span aria-hidden="true" className="contact-link-arrow">
                      ↗
                    </span>
                    {isExternal ? <span className="sr-only"> (se abre en una pestaña nueva)</span> : null}
                  </a>
                </li>
              )
            })}
          </ul>
          <p className="contact-place">{personalInfo.location}</p>
        </div>
      </div>
    </Section>
  )
}
