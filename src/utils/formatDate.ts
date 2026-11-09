import type { Locale } from '@/i18n/config'

const formats: Record<Locale, Intl.DateTimeFormat> = {
  es: new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: 'UTC' }),
  en: new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }),
}

/** "8 de noviembre de 2026" / "November 8, 2026" for an ISO date, the same day in every time zone. */
export function formatDate(isoDate: string, locale: Locale): string {
  return formats[locale].format(new Date(`${isoDate}T00:00:00Z`))
}
