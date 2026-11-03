import { StackExplorer } from '@/components/common/StackExplorer'
import { Section } from '@/components/ui/Section'
import { skillGroups } from '@/data/skills'

export function SkillsSection() {
  const initialTechnology = skillGroups[0]?.technologies[0]

  return (
    <Section id="stack" title="Stack" tone="white">
      <p className="lead-text mt-6 max-w-text">
        Cada tecnología está aquí porque aparece en un proyecto real. Elige una para ver dónde.
      </p>
      {initialTechnology ? (
        <StackExplorer groups={skillGroups} initialTechnology={initialTechnology} />
      ) : null}
    </Section>
  )
}
