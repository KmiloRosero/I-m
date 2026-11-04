/** A project or repository where a technology shows up. */
export interface ProjectRef {
  name: string
  /** A case study path (`/proyectos/...`) or a GitHub repository URL. */
  href: string
}

export interface Technology {
  name: string
  /** One sentence on what it is or how it was used. */
  summary?: string
  usedIn: readonly ProjectRef[]
}

export interface SkillGroup {
  category: string
  technologies: readonly Technology[]
}

/** A tab of the stack explorer, e.g. technologies or design patterns. */
export interface SkillArea {
  id: string
  label: string
  intro: string
  groups: readonly SkillGroup[]
}
