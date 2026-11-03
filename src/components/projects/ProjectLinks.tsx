import { ExternalAwareLink } from '@/components/common/ExternalAwareLink'
import type { Project } from '@/types/project'

export function ProjectLinks({ project }: { project: Project }) {
  const links = [
    { label: project.demoLabel, url: project.demoUrl },
    { label: project.repoLabel, url: project.repoUrl },
    { label: 'Código del backend', url: project.extraRepoUrl },
  ]

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-1">
      {links.map(({ label, url }) =>
        url ? (
          <li key={url}>
            <ExternalAwareLink context={project.name} label={label} url={url} />
          </li>
        ) : null,
      )}
    </ul>
  )
}
