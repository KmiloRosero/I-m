import { ProjectChest } from '@/components/projects/ProjectChest'
import { Section } from '@/components/ui/Section'

export function ProjectsSection() {
  return (
    <Section id="proyectos" title="Proyectos" tone="black">
      <p className="lead-text mt-6 max-w-text">
        Cada cubo del cofre es un proyecto que hice. Ábrelo y elige uno para ver de qué se trata.
      </p>
      <ProjectChest />
    </Section>
  )
}
