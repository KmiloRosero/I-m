export interface Project {
  slug: string
  name: string
  platform: string
  summary: string
  stack: readonly string[]
  features: readonly string[]
  contribution: string | null
  repoUrl: string
  extraRepoUrl: string | null
  demoUrl: string | null
  featured: boolean
}
