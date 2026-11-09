import { getExperienceKindLabels } from '@/data/experience'
import { translator, type Locale } from '@/i18n/config'
import type { ExperienceKind } from '@/types/experience'

export function formatKinds(kinds: readonly ExperienceKind[], locale: Locale): string {
  const labels = getExperienceKindLabels(locale)
  const [first, ...rest] = kinds.map((kind) => labels[kind])
  return [first, ...rest.map((label) => label.toLowerCase())].join(translator(locale)(' y ', ' and '))
}
