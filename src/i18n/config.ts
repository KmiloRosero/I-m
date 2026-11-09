export const locales = ['es', 'en'] as const

export type Locale = (typeof locales)[number]

/** Spanish lives at the root (`/`); English under `/en`. */
export const defaultLocale: Locale = 'es'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Open Graph `og:locale` for each language. */
export const ogLocales: Record<Locale, string> = { es: 'es_CO', en: 'en_US' }

/** The other language, for the switcher and for `hreflang` alternates. */
export const otherLocale = (locale: Locale): Locale => (locale === 'es' ? 'en' : 'es')

/**
 * A picker for bilingual literals: `t('Hola', 'Hello')`. Both versions sit
 * side by side in the data, so a missing translation shows up in review.
 */
export function translator(locale: Locale) {
  return <T>(es: T, en: T): T => (locale === 'en' ? en : es)
}

/** Caches a per-language builder, so data is assembled once per language. */
export function perLocale<T>(build: (locale: Locale) => T): (locale: Locale) => T {
  const cache = new Map<Locale, T>()
  return (locale) => {
    let value = cache.get(locale)
    if (value === undefined) {
      value = build(locale)
      cache.set(locale, value)
    }
    return value
  }
}
