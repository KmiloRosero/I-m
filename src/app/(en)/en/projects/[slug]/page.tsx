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
  return getCaseStudies('en').map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const project = getCaseStudy((await params).slug, 'en')
  return project ? caseStudyMetadata(project, 'en') : {}
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const project = getCaseStudy((await params).slug, 'en')
  if (!project) notFound()
  return <CaseStudyView locale="en" project={project} />
}
