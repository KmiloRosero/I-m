import Link from 'next/link'
import { Section } from '@/components/ui/Section'
import { experience } from '@/data/experience'
import type { ExperienceEntry } from '@/types/experience'
import { formatKinds } from '@/utils/categoryLabels'

function TimelineEntry({ entry }: { entry: ExperienceEntry }) {
  const { description, href, kinds, period, responsibilities, result, role, technologies, title } =
    entry

  return (
    <li className="timeline-entry">
      <p className="timeline-kind" data-kind={kinds[0]}>
        {formatKinds(kinds)}
      </p>
      <h3 className="timeline-title">{title}</h3>
      {period ? <p className="mt-1">{period}</p> : null}
      {role ? <p>{role}</p> : null}
      <p className="mt-3">{description}</p>
      {responsibilities.length > 0 ? (
        <ul className="project-features mt-2">
          {responsibilities.map((responsibility) => (
            <li key={responsibility}>{responsibility}</li>
          ))}
        </ul>
      ) : null}
      {technologies.length > 0 ? <p className="mt-2">{technologies.join(', ')}</p> : null}
      {result ? <p className="mt-2 font-display font-bold">{result}</p> : null}
      {href ? (
        <Link className="text-link mt-2" href={href}>
          Ver caso de estudio de {title}
        </Link>
      ) : null}
    </li>
  )
}

export function ExperienceSection() {
  return (
    <Section id="experiencia" title="Experiencia" titleAlign="center" tone="white">
      <ol className="timeline">
        {experience.map((entry) => (
          <TimelineEntry entry={entry} key={entry.title} />
        ))}
      </ol>
    </Section>
  )
}
