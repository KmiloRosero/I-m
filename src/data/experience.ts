import { personalInfo } from '@/data/personalInfo'
import { projects } from '@/data/projects'
import type { ExperienceEntry, ExperienceKind } from '@/types/experience'

export const experienceKindLabels: Record<ExperienceKind, string> = {
  academic: 'Académico',
  collaborative: 'Colaborativo',
  employment: 'Empleo',
  freelance: 'Freelance',
  personal: 'Personal',
}

const OCTOBER_2026_REPOSITORY = 'Repositorio creado en octubre de 2026'
const APRIL_2026_REPOSITORY = 'Repositorio creado en abril de 2026'

const projectTimeline = [
  { slug: 'reticula', period: OCTOBER_2026_REPOSITORY },
  { slug: 'moniwatch', period: OCTOBER_2026_REPOSITORY },
  { slug: 'mercajusto', period: OCTOBER_2026_REPOSITORY },
  { slug: 'cinetracker', period: OCTOBER_2026_REPOSITORY },
  { slug: 'biomedical-waste-platform', period: APRIL_2026_REPOSITORY },
]

const projectEntries: ExperienceEntry[] = projectTimeline.flatMap(({ period, slug }) => {
  const project = projects.find((candidate) => candidate.slug === slug)
  if (!project?.category) return []

  return [
    {
      title: project.name,
      role: null,
      kind: project.category,
      period,
      description: project.description,
      technologies: project.frameworks,
      responsibilities: [],
      result: project.status,
      href: project.hasCaseStudy ? `/proyectos/${project.slug}` : null,
    },
  ]
})

export const experience: readonly ExperienceEntry[] = [
  {
    title: personalInfo.degree,
    role: 'Estudiante',
    kind: 'academic',
    period: personalInfo.semester,
    description: `${personalInfo.university}, ${personalInfo.location}.`,
    technologies: [],
    responsibilities: [],
    result: null,
    href: null,
  },
  ...projectEntries,
]
