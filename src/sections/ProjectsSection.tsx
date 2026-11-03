import { SectionShell } from '@/components/ui/SectionShell'
import { projects } from '@/data/projects'
import type { Project } from '@/types/project'

function ProjectLinks({ project }: { project: Project }) {
  const demoLabel = project.demoUrl?.includes('/releases/') ? 'Descargar' : 'Ver demo'
  const links = [
    { href: project.demoUrl, label: demoLabel },
    { href: project.repoUrl, label: project.extraRepoUrl ? 'Código del frontend' : 'Ver código' },
    { href: project.extraRepoUrl, label: 'Código del backend' },
  ]

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-1">
      {links.map(({ href, label }) =>
        href ? (
          <li key={label}>
            <a className="text-link" href={href} rel="noreferrer" target="_blank">
              {label}
            </a>
          </li>
        ) : null,
      )}
    </ul>
  )
}

function ProjectEntry({ project }: { project: Project }) {
  return (
    <li className="grid gap-4 border-t-2 border-white py-10 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-5">
        <h3
          className={
            project.featured
              ? 'text-4xl leading-none font-bold text-yellow [font-stretch:125%] sm:text-5xl'
              : 'text-3xl leading-none font-bold [font-stretch:125%]'
          }
        >
          {project.name}
        </h3>
        <p className="mt-3">{project.platform}</p>
      </div>
      <div className="flex max-w-[62ch] flex-col gap-4 md:col-span-7">
        <p className="text-xl leading-snug">{project.summary}</p>
        <p>{project.stack.join(', ')}</p>
        <ProjectLinks project={project} />
      </div>
    </li>
  )
}

export function ProjectsSection() {
  return (
    <SectionShell id="proyectos" title="Proyectos" tone="black">
      <ul className="mt-12">
        {projects.map((project) => (
          <ProjectEntry key={project.slug} project={project} />
        ))}
      </ul>
    </SectionShell>
  )
}
