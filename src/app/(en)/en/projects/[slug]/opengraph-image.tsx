import { getCaseStudies, getCaseStudy } from '@/data/projects'
import { ogImageSize, renderOgImage, renderProjectOgImage } from '@/utils/ogImage'

export const alt = 'A case study by Kmilo Rosero'
export const contentType = 'image/png'
export const size = ogImageSize

export function generateStaticParams() {
  return getCaseStudies('en').map(({ slug }) => ({ slug }))
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getCaseStudy((await params).slug, 'en')
  return project ? renderProjectOgImage(project, 'en') : renderOgImage('en')
}
