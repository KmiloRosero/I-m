import Link from 'next/link'
import { ProjectLinks } from '@/components/projects/ProjectLinks'
import { ProjectMedia } from '@/components/projects/ProjectMedia'
import type { Project } from '@/types/project'

const mediaSizes: Record<Project['layout'], string> = {
  compact: '100vw',
  feature: '(min-width: 1024px) 56vw, 100vw',
  flow: '(min-width: 1024px) 50vw, 100vw',
  phone: '(min-width: 1024px) 17rem, 60vw',
  wide: '100vw',
}

export function ProjectEntry({ project }: { project: Project }) {
  const hasMedia = project.screenshots.length > 0 || project.flowSteps.length > 0

  return (
    <article className="project-entry" data-layout={project.layout}>
      <header className="project-heading">
        <p>
          {project.platform}
          {project.status ? `. ${project.status}` : ''}
        </p>
        <h3 className="project-name">{project.name}</h3>
      </header>

      <div className="project-body">
        <p className="lead-text">{project.description}</p>
        <p>{[...project.frameworks, ...project.technologies].join(', ')}</p>
        {project.layout === 'feature' ? (
          <ul className="project-features">
            {project.verifiedFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        ) : null}
        <ProjectLinks project={project} />
        {project.hasCaseStudy ? (
          <Link
            className="button-link w-fit"
            data-variant="primary"
            href={`/proyectos/${project.slug}`}
          >
            Ver caso de estudio<span className="sr-only"> de {project.name}</span>
          </Link>
        ) : null}
      </div>

      {hasMedia ? (
        <div className="project-media">
          <ProjectMedia project={project} sizes={mediaSizes[project.layout]} />
        </div>
      ) : null}
    </article>
  )
}
