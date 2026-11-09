import { CopyEmailButton } from '@/components/contact/CopyEmailButton'
import { Section } from '@/components/ui/Section'
import { getPersonalInfo } from '@/data/personalInfo'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { getCvLinks } from '@/utils/professionalLinks'

export function ContactSection({ locale }: { locale: Locale }) {
  const info = getPersonalInfo(locale)
  const messages = getMessages(locale)
  const copy = messages.contact
  const [emailUser, emailDomain] = info.email.split('@')
  const links = [
    ...info.socialLinks,
    ...(info.whatsappUrl ? [{ label: 'WhatsApp', url: info.whatsappUrl }] : []),
    ...getCvLinks(locale),
  ]

  return (
    <Section locale={locale} section="contact" tone="cobalt">
      <div className="contact-grid">
        <div className="contact-card">
          <p className="contact-status">
            <span aria-hidden="true" className="contact-status-dot" />
            {info.availability}
          </p>
          <p className="contact-lead">{copy.lead}</p>
          <a className="contact-email" href={`mailto:${info.email}`}>
            {emailUser}
            <wbr />@{emailDomain}
          </a>
          <div className="contact-actions">
            <a className="button-link" data-variant="primary" href={`mailto:${info.email}`}>
              {copy.write}
            </a>
            <CopyEmailButton email={info.email} />
          </div>
        </div>

        <div className="contact-aside">
          <h3 className="contact-label">{copy.elsewhere}</h3>
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
                    {isExternal ? <span className="sr-only">{messages.common.opensInNewTab}</span> : null}
                  </a>
                </li>
              )
            })}
          </ul>
          <p className="contact-place">{info.location}</p>
        </div>
      </div>
    </Section>
  )
}
