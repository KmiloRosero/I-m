import { GITHUB_PROFILE_URL, personalInfo } from '@/data/personalInfo'
import { projects } from '@/data/projects'
import type { ExperienceEntry, ExperienceGroup, ExperienceKind, ExperienceLink } from '@/types/experience'
import type { Project } from '@/types/project'

export const experienceKindLabels: Record<ExperienceKind, string> = {
  academic: 'Académico',
  collaborative: 'Colaborativo',
  employment: 'Empleo',
  freelance: 'Freelance',
  personal: 'Personal',
}

export const experienceGroups: readonly { id: ExperienceGroup; label: string }[] = [
  { id: 'education', label: 'Formación' },
  { id: 'work', label: 'Trabajo' },
  { id: 'projects', label: 'Proyectos' },
]

/** Public repositories on GitHub; update when the profile grows. */
export const PUBLIC_REPO_COUNT = 36
export const FIRST_REPO_YEAR = 2024

const repoLink = (repository: string, label = 'Código'): ExperienceLink => ({
  label,
  href: `${GITHUB_PROFILE_URL}/${repository}`,
  kind: 'repo',
})

function projectLinks(project: Project): ExperienceLink[] {
  const links: ExperienceLink[] = []
  if (project.hasCaseStudy) {
    links.push({ label: 'Caso de estudio', href: `/proyectos/${project.slug}`, kind: 'case-study' })
  }
  if (project.demoUrl) links.push({ label: project.demoLabel, href: project.demoUrl, kind: 'demo' })
  if (project.repoUrl) links.push({ label: 'Código', href: project.repoUrl, kind: 'repo' })
  return links
}

/** Builds an entry from a featured project; dates come from its GitHub activity. */
function fromProject(slug: string, era: string, period: string, highlightCount = 3): ExperienceEntry[] {
  const project = projects.find((candidate) => candidate.slug === slug)
  if (!project) return []

  return [
    {
      id: project.slug,
      group: 'projects',
      era,
      title: project.name,
      role: [project.platform, project.contribution].filter(Boolean).join(' · ') || null,
      kinds: project.categories,
      period,
      description: project.description,
      highlights: project.verifiedFeatures.slice(0, highlightCount),
      technologies: project.frameworks,
      status: project.status,
      links: projectLinks(project),
    },
  ]
}

export const experience: readonly ExperienceEntry[] = [
  // ── Hoy ─────────────────────────────────────────────────────
  {
    id: 'negocios-locales',
    group: 'work',
    era: 'Hoy',
    title: 'Desarrollo para negocios locales',
    role: 'Freelance',
    kinds: ['freelance'],
    period: 'Actualmente',
    description:
      'Trabajo para diferentes negocios locales en Pasto y en municipios de Nariño, con sitios web y asistentes personalizados.',
    highlights: [
      'Sitios web a la medida de cada negocio',
      'Asistentes personalizados para atender a sus clientes',
    ],
    technologies: [],
    status: null,
    links: [{ label: 'Ver servicios', href: '#servicios', kind: 'section' }],
  },
  {
    id: 'ingenieria',
    group: 'education',
    era: 'Hoy',
    title: personalInfo.degree,
    role: `${personalInfo.university} · ${personalInfo.semester}`,
    kinds: ['academic'],
    period: 'En curso',
    description: `Estudio en ${personalInfo.location}. Mientras avanzo en la carrera publico lo que aprendo en GitHub.`,
    highlights: [
      'Patrones de diseño, estructuras de datos y programación orientada a objetos',
      'APIs REST, bases de datos y arquitectura en capas',
      'Proyecto final en equipo: Biomedical Waste Platform',
    ],
    technologies: [],
    status: null,
    links: [{ label: 'Ver stack', href: '#stack', kind: 'section' }],
  },

  // ── 2026 ────────────────────────────────────────────────────
  ...fromProject('mercajusto', '2026', 'Oct. – nov. 2026', 4),
  ...fromProject('moniwatch', '2026', 'Oct. 2026'),
  ...fromProject('reticula', '2026', 'Oct. 2026'),
  ...fromProject('cinetracker', '2026', 'Oct. 2026'),
  {
    id: 'sitios-publicados',
    group: 'projects',
    era: '2026',
    title: 'Interfaces publicadas',
    role: 'Proyectos personales y de clase',
    kinds: ['personal'],
    period: 'Abr. – ago. 2026',
    description: 'Interfaces en React publicadas en Vercel, cada una conectada a su propio backend o a datos de prueba.',
    highlights: [
      'Choose Seats: selector de asientos de avión con secciones y total en vivo',
      'Kmusic: reproductor con lista de reproducción sobre una lista doblemente enlazada',
      'Medical Management System: panel de citas, historia clínica y laboratorios',
      'AI Proxy Platform: chat con cuotas y límite de uso por plan',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router'],
    status: '4 sitios en línea',
    links: [
      { label: 'Choose Seats', href: 'https://choose-seats.vercel.app', kind: 'demo' },
      { label: 'Kmusic', href: 'https://spotify-lime-iota.vercel.app', kind: 'demo' },
      { label: 'Medical', href: 'https://fronted-nine-sigma.vercel.app', kind: 'demo' },
      { label: 'AI Proxy', href: 'https://proxy-fronted.vercel.app', kind: 'demo' },
    ],
  },
  {
    id: 'apis-spring',
    group: 'projects',
    era: '2026',
    title: 'APIs con Spring Boot',
    role: 'Proyectos de la carrera',
    kinds: ['academic'],
    period: 'Abr. – jun. 2026',
    description: 'Backends en Java con controladores, servicios, repositorios y DTO; algunos empaquetados con Docker.',
    highlights: [
      'API REST de biblioteca con MongoDB: libros, ejemplares, usuarios y préstamos',
      'Gestión de obras con MongoDB, correo e integración continua en GitHub Actions',
      'AI Proxy: cuotas diarias con tareas programadas y JPA',
    ],
    technologies: ['Java', 'Spring Boot', 'MongoDB', 'Docker', 'GitHub Actions'],
    status: null,
    links: [repoLink('API-REST', 'Biblioteca'), repoLink('Construction-management', 'Obras'), repoLink('proxy-backend', 'AI Proxy')],
  },
  ...fromProject('biomedical-waste-platform', '2026', 'Abr. – may. 2026'),
  {
    id: 'fundamentos',
    group: 'education',
    era: '2026',
    title: 'Patrones y estructuras de datos',
    role: 'Talleres de la carrera',
    kinds: ['academic'],
    period: 'Feb. – abr. 2026',
    description:
      'Cada tema de clase terminó en un repositorio: patrones de diseño en Java y estructuras de datos implementadas desde cero.',
    highlights: [
      '10 patrones aplicados: Factory Method, Abstract Factory, Builder, Prototype, Adapter, Bridge, Decorator, Facade, State y Strategy',
      'Pilas, colas, listas simples, dobles y circulares en Python y TypeScript',
      'Juego de torres con Builder y Decorator, y simulador de semáforo con State',
    ],
    technologies: ['Java', 'Python', 'TypeScript', 'FastAPI'],
    status: null,
    links: [
      { label: 'Ver en el stack', href: '#stack', kind: 'section' },
      repoLink('Game-number-one-', 'Juego de torres'),
      repoLink('traffic-light', 'Semáforo'),
    ],
  },

  // ── 2024 ────────────────────────────────────────────────────
  {
    id: 'primer-repositorio',
    group: 'projects',
    era: '2024',
    title: 'Primer repositorio',
    role: 'Simulador bancario en Python',
    kinds: ['personal'],
    period: 'Sep. 2024',
    description: 'Cuentas de ahorro, corriente y CDT con sus operaciones: el inicio de mi perfil en GitHub.',
    highlights: [],
    technologies: ['Python'],
    status: null,
    links: [repoLink('Banco')],
  },

  // ── Antes ───────────────────────────────────────────────────
  {
    id: 'tecnico',
    group: 'education',
    era: 'Formación previa',
    title: personalInfo.technicalDegree,
    role: 'Egresado',
    kinds: ['academic'],
    period: null,
    description: 'Mi formación técnica en informática.',
    highlights: [],
    technologies: [],
    status: 'Egresado',
    links: [],
  },
]
