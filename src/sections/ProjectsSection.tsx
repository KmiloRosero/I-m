import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { Section } from '@/components/ui/Section'

export function ProjectsSection() {
  return (
    <Section id="proyectos" title="Proyectos" tone="black">
      <ProjectGallery />
    </Section>
  )
}
