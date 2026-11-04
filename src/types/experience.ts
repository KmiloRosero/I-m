import type { ProjectCategory } from '@/types/project'

export type ExperienceKind = ProjectCategory | 'employment'

/** Which filter an entry belongs to. */
export type ExperienceGroup = 'education' | 'work' | 'projects'

export interface ExperienceLink {
  label: string
  href: string
  kind: 'case-study' | 'demo' | 'repo' | 'section'
}

export interface ExperienceEntry {
  id: string
  group: ExperienceGroup
  /** Timeline bucket shown as a heading, e.g. "Hoy" or "2026". */
  era: string
  title: string
  /** Short name for the horizontal rail; defaults to the title. */
  railLabel?: string
  role: string | null
  kinds: readonly ExperienceKind[]
  /** Human-readable dates, taken from GitHub activity where possible. */
  period: string | null
  description: string
  highlights: readonly string[]
  technologies: readonly string[]
  status: string | null
  links: readonly ExperienceLink[]
}
