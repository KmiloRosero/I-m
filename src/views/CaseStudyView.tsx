import Link from 'next/link'
import type { ReactNode } from 'react'
import { ProjectLinks } from '@/components/projects/ProjectLinks'
import { ProjectMedia } from '@/components/projects/ProjectMedia'
import { JsonLdScript } from '@/components/seo/JsonLdScript'
import { getCaseStudies } from '@/data/projects'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { homePath, projectPath, sectionHref } from '@/i18n/paths'
import type { Project } from '@/types/project'
import { getProjectMeta } from '@/utils/projectMeta'
import { siteUrl } from '@/utils/siteUrl'
import { projectJsonLd } from '@/utils/structuredData'

function CaseBlock({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="case-block">
      <h2 className="case-block-title">{title}</h2>
      <div className="case-block-body">{children}</div>
    </section>
  )
}

function TextList({ items }: { items: readonly string[] }) {
  return (
    <ul className="project-features">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function CaseStudyView({ locale, project }: { locale: Locale; project: Project }) {
  const messages = getMessages(locale)
  const copy = messages.caseStudy
  const caseStudies = getCaseStudies(locale)
  const nextProject = caseStudies[(caseStudies.findIndex(({ slug }) => slug === project.slug) + 1) % caseStudies.length] ?? project
  const path = projectPath(project.slug, locale)
  const structuredData = projectJsonLd(project, siteUrl, path, [
    { name: messages.sections.home, path: homePath(locale) },
    { name: messages.sections.projects, path: sectionHref('projects', locale) },
    { name: project.name, path },
  ])

  return (
    <main id="contenido">
      <JsonLdScript data={structuredData} />
      <header className="case-hero" data-layout={project.layout}>
        <div className="mx-auto max-w-content">
          <Link className="text-link" href={sectionHref('projects', locale)}>
            {copy.back}
          </Link>
          <p className="mt-10">{getProjectMeta(project)}</p>
          <h1 className="case-title">{project.name}</h1>
          <p className="lead-text mt-6 max-w-text">{project.description}</p>
          <div className="mt-6">
            <ProjectLinks locale={locale} project={project} />
          </div>
        </div>
      </header>

      <div className="bg-white px-gutter py-section text-black">
        <div className="mx-auto grid max-w-content gap-14">
          {project.problem ? <CaseBlock title={copy.problem}>{project.problem}</CaseBlock> : null}
          {project.purpose ? <CaseBlock title={copy.purpose}>{project.purpose}</CaseBlock> : null}
          {project.solution ? <CaseBlock title={copy.solution}>{project.solution}</CaseBlock> : null}
          {project.contribution ? <CaseBlock title={copy.contribution}>{project.contribution}</CaseBlock> : null}
          {project.collaboration ? <CaseBlock title={copy.collaboration}>{project.collaboration}</CaseBlock> : null}
          {project.location ? <CaseBlock title={copy.location}>{project.location}</CaseBlock> : null}
          {project.period ? <CaseBlock title={copy.period}>{project.period}</CaseBlock> : null}
          <CaseBlock title={copy.features}>
            <TextList items={project.verifiedFeatures} />
          </CaseBlock>
          <CaseBlock title={copy.technologies}>{project.technologies.join(', ')}</CaseBlock>
          <CaseBlock title={copy.frameworks}>{project.frameworks.join(', ')}</CaseBlock>
          <CaseBlock title={copy.architecture}>
            <TextList items={project.architecture} />
          </CaseBlock>
        </div>
      </div>

      {project.screenshots.length > 0 ? (
        <section aria-label={copy.screenshots} className="bg-black px-gutter py-section text-white">
          <div className="case-screens mx-auto max-w-content" data-layout={project.layout}>
            <ProjectMedia project={project} sizes="(min-width: 1536px) 96rem, 100vw" />
          </div>
        </section>
      ) : null}

      <nav aria-label={copy.next} className="bg-yellow px-gutter py-12 text-black">
        <div className="mx-auto max-w-content">
          <p>{copy.next}</p>
          <Link className="section-title text-link" href={projectPath(nextProject.slug, locale)}>
            {nextProject.name}
          </Link>
        </div>
      </nav>
    </main>
  )
}
