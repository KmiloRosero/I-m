import { StackExplorer } from '@/components/common/StackExplorer'
import { Section } from '@/components/ui/Section'
import { getSkillAreas, PATTERN_GROUP_IDS } from '@/data/skills'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import type { SkillArea } from '@/types/skill'

function countStack(areas: readonly SkillArea[]) {
  const groups = areas.flatMap((area) => area.groups)
  const technologies = areas
    .filter((area) => area.id === 'tecnologias')
    .flatMap((area) => area.groups.flatMap((group) => group.technologies)).length
  const patterns = groups
    .filter((group) => PATTERN_GROUP_IDS.includes(group.id))
    .flatMap((group) => group.technologies).length
  const projects = new Set(
    groups.flatMap((group) => group.technologies.flatMap((technology) => technology.usedIn.map((ref) => ref.href))),
  ).size
  return { technologies, patterns, projects }
}

export function SkillsSection({ locale }: { locale: Locale }) {
  const areas = getSkillAreas(locale)
  const copy = getMessages(locale).stack
  const counts = countStack(areas)
  const stats = [
    { value: counts.technologies, label: copy.technologies },
    { value: counts.patterns, label: copy.patterns },
    { value: counts.projects, label: copy.projects },
  ]

  return (
    <Section locale={locale} section="stack" tone="white">
      <p className="lead-text mt-6 max-w-text">{copy.intro}</p>
      <dl className="stack-stats">
        {stats.map(({ value, label }) => (
          <div key={label}>
            <dt className="sr-only">{label}</dt>
            <dd className="stack-stat-value">{value}</dd>
            <dd aria-hidden="true" className="stack-stat-label">
              {label}
            </dd>
          </div>
        ))}
      </dl>
      <StackExplorer areas={areas} />
    </Section>
  )
}
