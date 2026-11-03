export type ExperienceKind = 'academic' | 'collaborative' | 'freelance'

export interface ExperienceEntry {
  title: string
  role: string
  kind: ExperienceKind
  period: string | null
  description: string
  technologies: readonly string[]
  responsibilities: readonly string[]
}
