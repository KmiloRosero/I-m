import type { Locale } from '@/i18n/config'

export type SectionKey =
  | 'home'
  | 'about'
  | 'stack'
  | 'services'
  | 'projects'
  | 'testimonials'
  | 'experience'
  | 'contact'

/** Anchor ids on the home page; Spanish keeps the ids its links already use. */
const sectionIds: Record<Locale, Record<SectionKey, string>> = {
  es: {
    home: 'inicio',
    about: 'sobre-mi',
    stack: 'stack',
    services: 'servicios',
    projects: 'proyectos',
    testimonials: 'testimonios',
    experience: 'experiencia',
    contact: 'contacto',
  },
  en: {
    home: 'home',
    about: 'about',
    stack: 'stack',
    services: 'services',
    projects: 'projects',
    testimonials: 'testimonials',
    experience: 'experience',
    contact: 'contact',
  },
}

export function sectionId(key: SectionKey, locale: Locale): string {
  return sectionIds[locale][key]
}

export function homePath(locale: Locale): string {
  return locale === 'en' ? '/en' : '/'
}

/** A link to a home-page section that works from any page. */
export function sectionHref(key: SectionKey, locale: Locale): string {
  return `${homePath(locale)}#${sectionId(key, locale)}`
}

export function projectPath(slug: string, locale: Locale): string {
  return locale === 'en' ? `/en/projects/${slug}` : `/proyectos/${slug}`
}

export function blogPath(locale: Locale, slug?: string): string {
  const base = locale === 'en' ? '/en/blog' : '/blog'
  return slug ? `${base}/${slug}` : base
}

/** Which language a path belongs to. */
export function pathLocale(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es'
}

/**
 * The same page in another language: `/proyectos/x` ↔ `/en/projects/x`,
 * `/blog/y` ↔ `/en/blog/y`. Anything else falls back to that language's home.
 */
export function translatePath(pathname: string, target: Locale): string {
  const path = pathname.replace(/\/+$/, '') || '/'
  const rest = pathLocale(path) === 'en' ? path.slice('/en'.length) || '/' : path

  const project = /^\/(?:proyectos|projects)\/([^/]+)$/.exec(rest)
  if (project?.[1]) return projectPath(project[1], target)

  const blog = /^\/blog(?:\/([^/]+))?$/.exec(rest)
  if (blog) return blogPath(target, blog[1])

  return homePath(target)
}

/** Maps a home-page anchor (`#sobre-mi`) to the other language's (`#about`). */
export function translateHash(hash: string, from: Locale, to: Locale): string {
  const id = hash.replace(/^#/, '')
  const key = (Object.keys(sectionIds[from]) as SectionKey[]).find((candidate) => sectionIds[from][candidate] === id)
  return key ? `#${sectionIds[to][key]}` : ''
}
