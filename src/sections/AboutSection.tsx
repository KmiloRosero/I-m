import { ContourField } from '@/components/common/ContourField'
import { ExternalAwareLink } from '@/components/common/ExternalAwareLink'
import { Section } from '@/components/ui/Section'
import { personalInfo } from '@/data/personalInfo'
import { getProfessionalLinks } from '@/utils/professionalLinks'

export function AboutSection() {
  const facts = [
    { label: 'Estudio', value: 'Ingeniería de Software' },
    { label: 'Universidad', value: personalInfo.university },
    { label: 'Semestre', value: personalInfo.semester },
    { label: 'Vivo en', value: personalInfo.location },
  ]

  return (
    <Section id="sobre-mi" title="Sobre mí" tone="yellow">
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="about-statement">{personalInfo.about}</p>
          {personalInfo.interests.length > 0 ? (
            <p className="lead-text mt-6">Fuera del código: {personalInfo.interests.join(', ')}.</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
          <dl className="grid gap-3">
            {facts.map(({ label, value }) => (
              <div key={label}>
                <dt className="font-display font-bold">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {getProfessionalLinks().map((link) => (
              <li key={link.url}>
                <ExternalAwareLink {...link} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ContourField />
    </Section>
  )
}
