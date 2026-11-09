import { getCaseStudies, getCaseStudy } from '@/data/projects'
import { ogImageSize, renderOgImage, renderProjectOgImage } from '@/utils/ogImage'

export const alt = 'Caso de estudio de Kmilo Rosero'
export const contentType = 'image/png'
export const size = ogImageSize

export function generateStaticParams() {
  return getCaseStudies('es').map(({ slug }) => ({ slug }))
}

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getCaseStudy((await params).slug, 'es')
  return project ? renderProjectOgImage(project, 'es') : renderOgImage('es')
}
