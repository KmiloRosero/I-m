import { visibleTestimonials } from '@/data/testimonials'
import { perLocale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { sectionId, type SectionKey } from '@/i18n/paths'

/** A link to a separate page, like the blog, shown after the sections. */
export interface PageLink {
  href: string
  label: string
}

export interface NavigationItem {
  /** The same in every language; styles and the active-section logic use it. */
  key: SectionKey
  /** The anchor id in this language. */
  id: string
  label: string
}

const SECTION_KEYS: readonly SectionKey[] = [
  'home',
  'about',
  'stack',
  'services',
  'projects',
  ...(visibleTestimonials.length > 0 ? (['testimonials'] as const) : []),
  'experience',
  'contact',
]

/** One stable list per language, so hooks that depend on it don't re-run every render. */
export const getNavigationItems = perLocale((locale): readonly NavigationItem[] => {
  const { sections } = getMessages(locale)
  return SECTION_KEYS.map((key) => ({ key, id: sectionId(key, locale), label: sections[key] }))
})
