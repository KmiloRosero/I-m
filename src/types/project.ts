export type ProjectCategory = 'academic' | 'collaborative' | 'freelance' | 'personal'

type ProjectLayout = 'compact' | 'feature' | 'flow' | 'phone' | 'wide'

export interface ProjectImage {
  alt: string
  height: number
  label: string
  src: string
  width: number
}

export interface Project {
  slug: string
  name: string
  platform: string
  layout: ProjectLayout
  categories: readonly ProjectCategory[]
  description: string
  problem: string | null
  purpose: string | null
  solution: string | null
  technologies: readonly string[]
  frameworks: readonly string[]
  contribution: string | null
  collaboration: string | null
  location: string | null
  period: string | null
  status: string | null
  verifiedFeatures: readonly string[]
  architecture: readonly string[]
  flowSteps: readonly string[]
  screenshots: readonly ProjectImage[]
  repoUrl: string
  repoLabel: string
  extraRepoUrl: string | null
  demoUrl: string | null
  demoLabel: string
  hasCaseStudy: boolean
}
