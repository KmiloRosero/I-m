import type { MetadataRoute } from 'next'
import { caseStudies } from '@/data/projects'
import { siteUrl } from '@/utils/siteUrl'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', ...caseStudies.map(({ slug }) => `/proyectos/${slug}`)]

  return paths.map((path) => ({ url: new URL(path, siteUrl).href }))
}
