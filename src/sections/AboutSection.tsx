import { ContourField } from '@/components/common/ContourField'
import { ExternalAwareLink } from '@/components/common/ExternalAwareLink'
import { Section } from '@/components/ui/Section'
import { personalInfo } from '@/data/personalInfo'
import { getProfessionalLinks } from '@/utils/professionalLinks'

export function AboutSection() {
  const facts = [
    {
      label: 'Estudio',
      values: [personalInfo.degree, `Egresado como ${personalInfo.technicalDegree}`],
    },
    { label: 'Universidad', values: [personalInfo.university] },
    { label: 'Semestre', values: [personalInfo.semester] },
    { label: 'Vivo en', values: [personalInfo.location] },
  ]

  return (
    <Section id="sobre-mi" title="Sobre mí" tone="yellow">
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="about-statement">{personalInfo.about}</p>
          <div className="about-details">
            <div>
              <h3 className="about-label">Cómo soy</h3>
              <p className="lead-text">
                {personalInfo.personality} {personalInfo.workStyle}
              </p>
            </div>
            <div>
              <h3 className="about-label">Fuera del código</h3>
              <ul className="about-interests">
                {personalInfo.interests.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>
            <div className="about-ambition">
              <h3 className="about-label">Lo que viene</h3>
              <p className="about-ambition-text">{personalInfo.ambition}</p>
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
