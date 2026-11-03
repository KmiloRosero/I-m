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

const projectTimeline = ['reticula', 'moniwatch', 'mercajusto', 'cinetracker', 'biomedical-waste-platform']

const projectEntries: ExperienceEntry[] = projectTimeline.flatMap((slug) => {
  const project = projects.find((candidate) => candidate.slug === slug)
  if (!project || project.categories.length === 0) return []

  return [
    {
      title: project.name,
      role: project.contribution,
      kinds: project.categories,
      period: null,
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
    kinds: ['academic'],
    period: personalInfo.semester,
    description: `${personalInfo.university}, ${personalInfo.location}.`,
    technologies: [],
    responsibilities: [],
    result: null,
    href: null,
  },
  {
    title: 'Webs y asistentes personalizados',
    role: null,
    kinds: ['freelance'],
    period: null,
    description: 'Sitios web y asistentes personalizados para clientes de la región.',
    technologies: [],
    responsibilities: [],
    result: null,
    href: null,
  },
  ...projectEntries,
]
