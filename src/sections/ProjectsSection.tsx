import { ProjectChest } from '@/components/projects/ProjectChest'
import { Section } from '@/components/ui/Section'
import { getProjects } from '@/data/projects'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'

export function ProjectsSection({ locale }: { locale: Locale }) {
  return (
    <Section locale={locale} section="projects" tone="black">
      <p className="lead-text mt-6 max-w-text">{getMessages(locale).projects.intro}</p>
      <ProjectChest projects={getProjects(locale)} />
    </Section>
  )
}
