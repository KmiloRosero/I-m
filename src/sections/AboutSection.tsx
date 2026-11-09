import { ExternalAwareLink } from '@/components/common/ExternalAwareLink'
import { Section } from '@/components/ui/Section'
import { getPersonalInfo } from '@/data/personalInfo'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { getProfessionalLinks } from '@/utils/professionalLinks'

export function AboutSection({ locale }: { locale: Locale }) {
  const info = getPersonalInfo(locale)
  const copy = getMessages(locale).about
  const facts = [
    { label: copy.studies, values: [info.degree, copy.graduate(info.technicalDegree)] },
    { label: copy.university, values: [info.university] },
    { label: copy.semester, values: [info.semester] },
    { label: copy.livesIn, values: [info.location] },
  ]

  return (
    <Section locale={locale} section="about" tone="yellow">
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="about-statement">{info.about}</p>
          <div className="about-details">
            <div>
              <h3 className="about-label">{copy.personality}</h3>
              <p className="lead-text">
                {info.personality} {info.workStyle}
              </p>
            </div>
            <div>
              <h3 className="about-label">{copy.outsideCode}</h3>
              <ul className="about-interests">
                {info.interests.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>
            <div className="about-ambition">
              <h3 className="about-label">{copy.next}</h3>
              <p className="about-ambition-text">{info.ambition}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
          <dl className="grid gap-3">
            {facts.map(({ label, values }) => (
              <div key={label}>
                <dt className="font-display font-bold">{label}</dt>
                {values.map((value) => (
                  <dd key={value}>{value}</dd>
                ))}
              </div>
            ))}
          </dl>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {getProfessionalLinks(locale).map((link) => (
              <li key={link.url}>
                <ExternalAwareLink {...link} locale={locale} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
