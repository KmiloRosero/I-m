import type { ProjectCategory } from '@/types/project'

export type ExperienceKind = ProjectCategory | 'employment' | 'local'

export interface ExperienceEntry {
  title: string
  role: string | null
  kinds: readonly ExperienceKind[]
  period: string | null
  description: string
  technologies: readonly string[]
  responsibilities: readonly string[]
  result: string | null
  href: string | null
}
