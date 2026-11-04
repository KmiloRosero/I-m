import { ExperienceTimeline } from '@/components/experience/ExperienceTimeline'
import { Section } from '@/components/ui/Section'
import { experience, experienceGroups, FIRST_REPO_YEAR, PUBLIC_REPO_COUNT } from '@/data/experience'

function countStats() {
  const liveSites = new Set(
    experience.flatMap((entry) => entry.links.filter((link) => link.kind === 'demo').map((link) => link.href)),
  ).size
  return [
    { value: String(FIRST_REPO_YEAR), label: 'primer repositorio en GitHub' },
    { value: String(PUBLIC_REPO_COUNT), label: 'repositorios públicos' },
    { value: String(liveSites), label: 'proyectos en línea' },
  ]
}

export function ExperienceSection() {
  return (
    <Section id="experiencia" title="Experiencia" titleAlign="center" tone="white">
      <p className="lead-text mx-auto mt-6 max-w-text text-center">
        Lo que he estudiado, construido y entregado, con las fechas de cada proyecto en GitHub.
      </p>
      <dl className="xp-stats">
        {countStats().map(({ value, label }) => (
          <div key={label}>
            <dt className="sr-only">{label}</dt>
            <dd className="xp-stat-value">{value}</dd>
            <dd aria-hidden="true" className="xp-stat-label">
              {label}
            </dd>
          </div>
        ))}
      </dl>
      <ExperienceTimeline entries={experience} groups={experienceGroups} />
    </Section>
  )
}
