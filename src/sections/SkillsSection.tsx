import { StackExplorer } from '@/components/common/StackExplorer'
import { Section } from '@/components/ui/Section'
import { skillAreas } from '@/data/skills'

const PATTERN_CATEGORIES = ['Patrones creacionales', 'Patrones estructurales', 'Patrones de comportamiento']

function countStack() {
  const groups = skillAreas.flatMap((area) => area.groups)
  const technologies = skillAreas
    .filter((area) => area.id === 'tecnologias')
    .flatMap((area) => area.groups.flatMap((group) => group.technologies)).length
  const patterns = groups
    .filter((group) => PATTERN_CATEGORIES.includes(group.category))
    .flatMap((group) => group.technologies).length
  const projects = new Set(
    groups.flatMap((group) => group.technologies.flatMap((technology) => technology.usedIn.map((ref) => ref.href))),
  ).size
  return [
    { value: technologies, label: 'tecnologías' },
    { value: patterns, label: 'patrones de diseño' },
    { value: projects, label: 'proyectos y repositorios' },
  ]
}

export function SkillsSection() {
  return (
    <Section id="stack" title="Stack" tone="white">
      <p className="lead-text mt-6 max-w-text">
        Todo sale de mis proyectos y de mis repositorios públicos en GitHub. Elige uno para ver dónde lo usé.
      </p>
      <dl className="stack-stats">
        {countStack().map(({ value, label }) => (
          <div key={label}>
            <dt className="sr-only">{label}</dt>
            <dd className="stack-stat-value">{value}</dd>
            <dd aria-hidden="true" className="stack-stat-label">
              {label}
            </dd>
          </div>
        ))}
      </dl>
      <StackExplorer areas={skillAreas} />
    </Section>
  )
}
