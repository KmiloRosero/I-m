import type { MetadataRoute } from 'next'
import { getCaseStudies } from '@/data/projects'
import { locales, type Locale } from '@/i18n/config'
import { homePath, projectPath } from '@/i18n/paths'
import { siteUrl } from '@/utils/siteUrl'

const absolute = (path: string) => new URL(path, siteUrl).href

/** Every page in both languages, each listing its translation for search engines. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: ((locale: Locale) => string)[] = [
    homePath,
    ...getCaseStudies('es').map(({ slug }) => (locale: Locale) => projectPath(slug, locale)),
  ]

  return pages.flatMap((pathFor) =>
    locales.map((locale) => ({
      url: absolute(pathFor(locale)),
      alternates: {
        languages: Object.fromEntries(locales.map((other) => [other, absolute(pathFor(other))])),
      },
    })),
  )
}
