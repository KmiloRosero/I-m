import type { Metadata, Viewport } from 'next'
import { brandColors } from '@/data/brandColors'
import { getPersonalInfo } from '@/data/personalInfo'
import { ogLocales, otherLocale, type Locale } from '@/i18n/config'
import { homePath, projectPath } from '@/i18n/paths'
import type { Project } from '@/types/project'
import { siteUrl } from '@/utils/siteUrl'

export const siteViewport: Viewport = { themeColor: brandColors.black }

/** `hreflang` links for a page that exists in both languages. */
export function languageAlternates(paths: Record<Locale, string>): NonNullable<Metadata['alternates']>['languages'] {
  return { es: paths.es, en: paths.en, 'x-default': paths.es }
}

/** Defaults every page in one language inherits. */
export function siteMetadata(locale: Locale): Metadata {
  const info = getPersonalInfo(locale)
  return {
    metadataBase: siteUrl,
    title: { default: info.seoTitle, template: `%s | ${info.name}` },
    description: info.metaDescription,
    applicationName: info.name,
    authors: [{ name: info.name, url: siteUrl }],
    creator: info.name,
    openGraph: {
      title: info.seoTitle,
      description: info.metaDescription,
      locale: ogLocales[locale],
      alternateLocale: ogLocales[otherLocale(locale)],
      siteName: info.name,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: info.seoTitle, description: info.metaDescription },
  }
}

export function homeMetadata(locale: Locale): Metadata {
  const path = homePath(locale)
  return {
    alternates: {
      canonical: path,
      languages: languageAlternates({ es: homePath('es'), en: homePath('en') }),
    },
    // A page's openGraph replaces the layout's whole object, so carry its fields over.
    openGraph: { ...siteMetadata(locale).openGraph, url: path },
  }
}

export function caseStudyMetadata(project: Project, locale: Locale): Metadata {
  const info = getPersonalInfo(locale)
  const path = projectPath(project.slug, locale)
  // The share image comes from the case study's own opengraph-image route.

  return {
    title: project.name,
    description: project.description,
    alternates: {
      canonical: path,
      languages: languageAlternates({ es: projectPath(project.slug, 'es'), en: projectPath(project.slug, 'en') }),
    },
    openGraph: {
      title: project.name,
      description: project.description,
      locale: ogLocales[locale],
      siteName: info.name,
      type: 'article',
      url: path,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.name,
      description: project.description,
    },
  }
}
