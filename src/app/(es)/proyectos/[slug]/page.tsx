import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudy } from '@/data/projects'
import { caseStudyMetadata } from '@/utils/siteMetadata'
import { CaseStudyView } from '@/views/CaseStudyView'

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getCaseStudies('es').map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const project = getCaseStudy((await params).slug, 'es')
  return project ? caseStudyMetadata(project, 'es') : {}
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const project = getCaseStudy((await params).slug, 'es')
  if (!project) notFound()
  return <CaseStudyView locale="es" project={project} />
}
