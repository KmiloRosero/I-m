import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { ProjectLinks } from '@/components/projects/ProjectLinks'
import { ProjectMedia } from '@/components/projects/ProjectMedia'
import { caseStudies } from '@/data/projects'

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = caseStudies.find((study) => study.slug === slug)

  return project
    ? {
        title: project.name,
        description: project.description,
        openGraph: {
          title: project.name,
          description: project.description,
          images: ['/opengraph-image'],
        },
      }
    : {}
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
  const index = caseStudies.findIndex((study) => study.slug === slug)
  const project = caseStudies[index]

  if (!project) notFound()

  const nextProject = caseStudies[(index + 1) % caseStudies.length] ?? project

  return (
    <main id="contenido">
      <header className="case-hero" data-layout={project.layout}>
        <div className="mx-auto max-w-content">
          <Link className="text-link" href="/#proyectos">
            Volver a proyectos
          </Link>
          <p className="mt-10">
            {project.platform}
            {project.status ? `. ${project.status}` : ''}
          </p>
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
