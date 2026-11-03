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

const projectTimeline = [
  { slug: 'reticula', period: 'Repositorio creado en octubre de 2026' },
  { slug: 'moniwatch', period: 'Repositorio creado en octubre de 2026' },
  { slug: 'mercajusto', period: 'Repositorio creado en octubre de 2026' },
  { slug: 'cinetracker', period: 'Repositorio creado en octubre de 2026' },
  { slug: 'biomedical-waste-platform', period: 'Repositorio creado en abril de 2026' },
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
    title: 'Ingeniería de Software',
    role: 'Estudiante',
    kind: 'academic',
    period: personalInfo.semester,
    description: `${personalInfo.university}, en Pasto.`,
    technologies: [],
    responsibilities: [],
    result: null,
    href: null,
  },
  ...projectEntries,
]
