import type { PersonalInfo } from '@/types/personalInfo'
import type { Project } from '@/types/project'

/** A schema.org node, as plain JSON. */
export type JsonLd = { [key: string]: unknown }

const CONTEXT = 'https://schema.org'

/**
 * Serializes JSON-LD for an inline `<script>`. `<` is escaped so no value
 * (a project name, a description) can close the tag early.
 */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

const personId = (site: URL) => new URL('/#person', site).href

function personNode(info: PersonalInfo, site: URL): JsonLd {
  return {
    '@type': 'Person',
    '@id': personId(site),
    name: info.name,
    alternateName: info.alternateName,
    url: site.href,
    image: new URL(info.photoSrc, site).href,
    email: `mailto:${info.email}`,
    jobTitle: info.position,
    description: info.metaDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: info.address.locality,
      addressRegion: info.address.region,
      addressCountry: info.address.country,
    },
    affiliation: { '@type': 'CollegeOrUniversity', name: info.university },
    knowsAbout: info.featuredStack,
    sameAs: info.socialLinks.map(({ url }) => url),
  }
}

/** The person behind the site and the site itself, for the home page. */
export function homeJsonLd(info: PersonalInfo, site: URL, language: string): JsonLd {
  return {
    '@context': CONTEXT,
    '@graph': [
      personNode(info, site),
      {
        '@type': 'WebSite',
        '@id': new URL('/#website', site).href,
        url: site.href,
        name: info.seoTitle,
        inLanguage: language,
        author: { '@id': personId(site) },
      },
    ],
  }
}

interface Crumb {
  name: string
  path: string
}

/** A project's source code, credited to the site's author, with its breadcrumb trail. */
export function projectJsonLd(project: Project, site: URL, path: string, crumbs: readonly Crumb[]): JsonLd {
  const [cover] = project.screenshots

  return {
    '@context': CONTEXT,
    '@graph': [
      {
        '@type': 'SoftwareSourceCode',
        name: project.name,
        description: project.description,
        url: new URL(path, site).href,
        codeRepository: project.repoUrl,
        keywords: [...project.frameworks, ...project.technologies].join(', '),
        ...(cover ? { image: new URL(cover.src, site).href } : {}),
        author: { '@id': personId(site) },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: new URL(crumb.path, site).href,
        })),
      },
    ],
  }
}
