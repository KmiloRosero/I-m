export interface Technology {
  name: string
  usedIn: readonly string[]
}

export interface SkillGroup {
  category: string
  technologies: readonly Technology[]
}
