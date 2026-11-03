import type { ProjectCategory } from '@/types/project'

export type ExperienceKind = ProjectCategory | 'employment'

export interface ExperienceEntry {
  title: string
  role: string | null
  kind: ExperienceKind
  period: string
  description: string
  technologies: readonly string[]
  responsibilities: readonly string[]
  result: string | null
  href: string | null
}
