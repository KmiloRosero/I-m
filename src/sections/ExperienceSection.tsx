import Link from 'next/link'
import { Section } from '@/components/ui/Section'
import { experience, experienceKindLabels } from '@/data/experience'

export function ExperienceSection() {
  return (
    <Section id="experiencia" title="Experiencia" titleAlign="center" tone="white">
      <ol className="timeline">
        {experience.map(({ description, href, kind, period, result, role, technologies, title }) => (
          <li className="timeline-entry" key={title}>
            <p className="timeline-kind" data-kind={kind}>
              {experienceKindLabels[kind]}
            </p>
            <h3 className="timeline-title">{title}</h3>
            <p className="mt-1">{period}</p>
            {role ? <p>{role}</p> : null}
            <p className="mt-3">{description}</p>
            {technologies.length > 0 ? <p className="mt-2">{technologies.join(', ')}</p> : null}
            {result ? <p className="mt-2 font-display font-bold">{result}</p> : null}
            {href ? (
              <Link className="text-link mt-2 inline-block" href={href}>
                Ver caso de estudio de {title}
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  )
}
