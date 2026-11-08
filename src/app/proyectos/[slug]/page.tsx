import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { ProjectLinks } from '@/components/projects/ProjectLinks'
import { ProjectMedia } from '@/components/projects/ProjectMedia'
import { JsonLdScript } from '@/components/seo/JsonLdScript'
import { getSectionHref } from '@/data/navigation'
import { personalInfo } from '@/data/personalInfo'
import { caseStudies, getCaseStudy } from '@/data/projects'
import { getProjectMeta } from '@/utils/projectMeta'
import { siteUrl } from '@/utils/siteUrl'
import { projectJsonLd } from '@/utils/structuredData'

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getCaseStudy(slug)
  if (!project) return {}

  const path = `/proyectos/${project.slug}`
  // Shared links show the project itself; PNG and JPEG are the formats every link preview reads.
  const cover = project.screenshots.find(({ src }) => /\.(?:png|jpe?g)$/i.test(src))
  const images = cover
    ? [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }]
    : ['/opengraph-image']

  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: path },
    openGraph: {
      title: project.name,
      description: project.description,
      images,
      locale: 'es_CO',
      siteName: personalInfo.name,
      type: 'article',
      url: path,
    },
    twitter: { card: 'summary_large_image', title: project.name, description: project.description, images },
  }
}

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

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const project = getCaseStudy(slug)

  if (!project) notFound()

  const nextProject = caseStudies[(caseStudies.indexOf(project) + 1) % caseStudies.length] ?? project
  const path = `/proyectos/${project.slug}`
  const structuredData = projectJsonLd(project, siteUrl, path, [
    { name: 'Inicio', path: '/' },
    { name: 'Proyectos', path: getSectionHref('proyectos') },
    { name: project.name, path },
  ])

  return (
    <main id="contenido">
      <JsonLdScript data={structuredData} />
      <header className="case-hero" data-layout={project.layout}>
        <div className="mx-auto max-w-content">
          <Link className="text-link" href={getSectionHref('proyectos')}>
            Volver a proyectos
          </Link>
          <p className="mt-10">{getProjectMeta(project)}</p>
          <h1 className="case-title">{project.name}</h1>
          <p className="lead-text mt-6 max-w-text">{project.description}</p>
          <div className="mt-6">
            <ProjectLinks project={project} />
          </div>
        </div>
      </header>

      <div className="bg-white px-gutter py-section text-black">
        <div className="mx-auto grid max-w-content gap-14">
          {project.problem ? <CaseBlock title="Problema">{project.problem}</CaseBlock> : null}
          {project.purpose ? <CaseBlock title="Propósito">{project.purpose}</CaseBlock> : null}
          {project.solution ? <CaseBlock title="Solución">{project.solution}</CaseBlock> : null}
          {project.contribution ? (
            <CaseBlock title="Mi aporte">{project.contribution}</CaseBlock>
          ) : null}
          {project.collaboration ? (
            <CaseBlock title="Colaboración">{project.collaboration}</CaseBlock>
          ) : null}
          {project.location ? <CaseBlock title="Lugar">{project.location}</CaseBlock> : null}
          {project.period ? <CaseBlock title="Periodo">{project.period}</CaseBlock> : null}
          <CaseBlock title="Funcionalidades verificadas">
            <TextList items={project.verifiedFeatures} />
          </CaseBlock>
          <CaseBlock title="Tecnologías">{project.technologies.join(', ')}</CaseBlock>
          <CaseBlock title="Frameworks">{project.frameworks.join(', ')}</CaseBlock>
          <CaseBlock title="Arquitectura">
            <TextList items={project.architecture} />
          </CaseBlock>
        </div>
      </div>

      {project.screenshots.length > 0 ? (
        <section aria-label="Capturas reales" className="bg-black px-gutter py-section text-white">
          <div className="case-screens mx-auto max-w-content" data-layout={project.layout}>
            <ProjectMedia project={project} sizes="(min-width: 1536px) 96rem, 100vw" />
          </div>
        </section>
      ) : null}

      <nav aria-label="Siguiente proyecto" className="bg-yellow px-gutter py-12 text-black">
        <div className="mx-auto max-w-content">
          <p>Siguiente proyecto</p>
          <Link className="section-title text-link" href={`/proyectos/${nextProject.slug}`}>
            {nextProject.name}
          </Link>
        </div>
      </nav>
    </main>
  )
}
