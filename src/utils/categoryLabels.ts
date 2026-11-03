import { experienceKindLabels } from '@/data/experience'
import type { ExperienceKind } from '@/types/experience'

export function formatKinds(kinds: readonly ExperienceKind[]): string {
  const [first, ...rest] = kinds.map((kind) => experienceKindLabels[kind])
  return [first, ...rest.map((label) => label.toLowerCase())].join(' y ')
}
