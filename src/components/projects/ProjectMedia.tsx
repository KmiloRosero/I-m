import Image from 'next/image'
import { ScreenshotSwitcher } from '@/components/projects/ScreenshotSwitcher'
import type { Project } from '@/types/project'

interface ProjectMediaProps {
  project: Project
  sizes: string
}

export function ProjectMedia({ project, sizes }: ProjectMediaProps) {
  const [firstImage] = project.screenshots

  if (project.screenshots.length > 1) {
    return <ScreenshotSwitcher images={project.screenshots} sizes={sizes} />
  }

  if (firstImage) {
    return (
      <Image
        alt={firstImage.alt}
        className="project-image"
        height={firstImage.height}
        sizes={sizes}
        src={firstImage.src}
        width={firstImage.width}
      />
    )
  }

  if (project.flowSteps.length > 0) {
    return (
      <ol className="project-flow">
        {project.flowSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    )
  }

  return null
}
