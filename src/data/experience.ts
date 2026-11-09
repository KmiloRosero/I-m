import { getPersonalInfo, GITHUB_PROFILE_URL } from '@/data/personalInfo'
import { getProjects } from '@/data/projects'
import { perLocale, translator, type Locale } from '@/i18n/config'
import { projectPath, sectionHref } from '@/i18n/paths'
import type { ExperienceEntry, ExperienceGroup, ExperienceKind, ExperienceLink } from '@/types/experience'
import type { Project } from '@/types/project'

export const getExperienceKindLabels = perLocale((locale): Record<ExperienceKind, string> => {
  const t = translator(locale)
  return {
    academic: t('Académico', 'Academic'),
    collaborative: t('Colaborativo', 'Collaborative'),
    employment: t('Empleo', 'Employment'),
    freelance: 'Freelance',
    personal: 'Personal',
  }
})

export const getExperienceGroups = perLocale((locale): readonly { id: ExperienceGroup; label: string }[] => {
  const t = translator(locale)
  return [
    { id: 'education', label: t('Formación', 'Education') },
    { id: 'work', label: t('Trabajo', 'Work') },
    { id: 'projects', label: t('Proyectos', 'Projects') },
  ]
})

/** Public repositories on GitHub; update when the profile grows. */
export const PUBLIC_REPO_COUNT = 36
/** The year of the first public repository on GitHub. */
export const FIRST_REPO_YEAR = 2024

export const getExperience = perLocale((locale): readonly ExperienceEntry[] => {
  const t = translator(locale)
  const info = getPersonalInfo(locale)
  const code = t('Código', 'Code')

  const repoLink = (repository: string, label = code): ExperienceLink => ({
    label,
    href: `${GITHUB_PROFILE_URL}/${repository}`,
    kind: 'repo',
  })

  /** Builds an entry from a featured project; dates come from its GitHub activity. */
  const fromProject = (
    slug: string,
    era: string,
    period: string,
    { highlightCount = 3, railLabel }: { highlightCount?: number; railLabel?: string } = {},
  ): ExperienceEntry[] => {
    const project = getProjects(locale).find((candidate) => candidate.slug === slug)
    if (!project) return []

    return [
      {
        id: project.slug,
        group: 'projects',
        era,
        title: project.name,
        ...(railLabel ? { railLabel } : {}),
        role: [project.platform, project.contribution].filter(Boolean).join(' · ') || null,
        kinds: project.categories,
        period,
        description: project.description,
        highlights: project.verifiedFeatures.slice(0, highlightCount),
        technologies: project.frameworks,
        status: project.status,
        links: projectLinks(project, locale),
      },
    ]
  }

  return [
    // ── Today ───────────────────────────────────────────────────
    {
      id: 'negocios-locales',
      group: 'work',
      era: t('Hoy', 'Today'),
      title: t('Desarrollo para negocios locales', 'Development for local businesses'),
      railLabel: t('Negocios locales', 'Local businesses'),
      role: 'Freelance',
      kinds: ['freelance'],
      period: t('Actualmente', 'Currently'),
      description: t(
        'Trabajo para diferentes negocios locales en Pasto y en municipios de Nariño, con sitios web y asistentes personalizados.',
        'I work for local businesses in Pasto and in towns across Nariño, building websites and custom assistants.',
      ),
      highlights: t(
        ['Sitios web a la medida de cada negocio', 'Asistentes personalizados para atender a sus clientes'],
        ['Websites tailored to each business', 'Custom assistants that help their customers'],
      ),
      technologies: [],
      status: null,
      links: [{ label: t('Ver servicios', 'See services'), href: sectionHref('services', locale), kind: 'section' }],
    },
    {
      id: 'ingenieria',
      group: 'education',
      era: t('Hoy', 'Today'),
      title: info.degree,
      role: `${info.university} · ${info.semester}`,
      kinds: ['academic'],
      period: t('En curso', 'In progress'),
      description: t(
        `Estudio en ${info.location}. Mientras avanzo en la carrera publico lo que aprendo en GitHub.`,
        `I study in ${info.location}. As I move through the degree, I publish what I learn on GitHub.`,
      ),
      highlights: t(
        [
          'Patrones de diseño, estructuras de datos y programación orientada a objetos',
          'APIs REST, bases de datos y arquitectura en capas',
          'Proyecto final en equipo: Biomedical Waste Platform',
        ],
        [
          'Design patterns, data structures and object-oriented programming',
          'REST APIs, databases and layered architecture',
          'Final team project: Biomedical Waste Platform',
        ],
      ),
      technologies: [],
      status: null,
      links: [{ label: t('Ver stack', 'See stack'), href: sectionHref('stack', locale), kind: 'section' }],
    },

    // ── 2026 ────────────────────────────────────────────────────
    ...fromProject('mercajusto', '2026', t('Oct. – nov. 2026', 'Oct – Nov 2026'), { highlightCount: 4 }),
    ...fromProject('moniwatch', '2026', t('Oct. 2026', 'Oct 2026')),
    ...fromProject('reticula', '2026', t('Oct. 2026', 'Oct 2026')),
    ...fromProject('cinetracker', '2026', t('Oct. 2026', 'Oct 2026')),
    {
      id: 'emas',
      group: 'projects',
      era: '2026',
      title: t('Sitio web de EMAS', 'EMAS website'),
      railLabel: 'EMAS',
      role: t('Proyecto académico de la universidad', 'Academic university project'),
      kinds: ['academic'],
      period: t('Ago. 2026', 'Aug 2026'),
      description: t(
        'Sitio institucional en Next.js para EMAS, con la información y los trámites que más consulta la ciudadanía.',
        'An institutional Next.js website for EMAS, with the information and procedures residents look up most.',
      ),
      highlights: t(
        [
          'Horarios, oficinas, tarifas y noticias',
          'Formulario de PQR y sección de transparencia',
          'Buscador del sitio y cambio de sede con Context',
        ],
        [
          'Opening hours, offices, rates and news',
          'A complaints and requests form, and a transparency section',
          'Site search and branch switching with Context',
        ],
      ),
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      status: null,
      links: [repoLink('Emas')],
    },
    {
      id: 'sitios-publicados',
      group: 'projects',
      era: '2026',
      title: t('Interfaces publicadas', 'Published interfaces'),
      role: t('Proyectos personales y de clase', 'Personal and class projects'),
      kinds: ['personal'],
      period: t('Abr. – ago. 2026', 'Apr – Aug 2026'),
      description: t(
        'Interfaces en React publicadas en Vercel, cada una conectada a su propio backend o a datos de prueba.',
        'React interfaces published on Vercel, each connected to its own backend or to sample data.',
      ),
      highlights: t(
        [
          'Choose Seats: selector de asientos de avión con secciones y total en vivo',
          'Kmusic: reproductor con lista de reproducción sobre una lista doblemente enlazada',
          'Medical Management System: panel de citas, historia clínica y laboratorios',
          'AI Proxy Platform: chat con cuotas y límite de uso por plan',
        ],
        [
          'Choose Seats: a plane seat picker with sections and a live total',
          'Kmusic: a player whose playlist is a doubly linked list',
          'Medical Management System: a dashboard for appointments, medical records and lab results',
          'AI Proxy Platform: a chat with quotas and usage limits per plan',
        ],
      ),
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router'],
      status: t('4 sitios en línea', '4 live sites'),
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
      title: t('APIs con Spring Boot', 'APIs with Spring Boot'),
      role: t('Proyectos de la carrera', 'Degree projects'),
      kinds: ['academic'],
      period: t('Abr. – jun. 2026', 'Apr – Jun 2026'),
      description: t(
        'Backends en Java con controladores, servicios, repositorios y DTO; algunos empaquetados con Docker.',
        'Java backends with controllers, services, repositories and DTOs; some packaged with Docker.',
      ),
      highlights: t(
        [
          'API REST de biblioteca con MongoDB: libros, ejemplares, usuarios y préstamos',
          'Gestión de obras con MongoDB, correo e integración continua en GitHub Actions',
          'AI Proxy: cuotas diarias con tareas programadas y JPA',
        ],
        [
          'A library REST API with MongoDB: books, copies, users and loans',
          'Construction management with MongoDB, email and continuous integration on GitHub Actions',
          'AI Proxy: daily quotas with scheduled jobs and JPA',
        ],
      ),
      technologies: ['Java', 'Spring Boot', 'MongoDB', 'Docker', 'GitHub Actions'],
      status: null,
      links: [
        repoLink('API-REST', t('Biblioteca', 'Library')),
        repoLink('Construction-management', t('Obras', 'Construction')),
        repoLink('proxy-backend', 'AI Proxy'),
      ],
    },
    ...fromProject('biomedical-waste-platform', '2026', t('Abr. – may. 2026', 'Apr – May 2026'), {
      railLabel: 'BioMedWaste',
    }),
    {
      id: 'fundamentos',
      group: 'education',
      era: '2026',
      title: t('Patrones y estructuras de datos', 'Patterns and data structures'),
      railLabel: t('Patrones y estructuras', 'Patterns and structures'),
      role: t('Talleres de la carrera', 'Degree workshops'),
      kinds: ['academic'],
      period: t('Feb. – abr. 2026', 'Feb – Apr 2026'),
      description: t(
        'Cada tema de clase terminó en un repositorio: patrones de diseño en Java y estructuras de datos implementadas desde cero.',
        'Every class topic ended up in a repository: design patterns in Java and data structures built from scratch.',
      ),
      highlights: t(
        [
          '10 patrones aplicados: Factory Method, Abstract Factory, Builder, Prototype, Adapter, Bridge, Decorator, Facade, State y Strategy',
          'Pilas, colas, listas simples, dobles y circulares en Python y TypeScript',
          'Juego de torres con Builder y Decorator, y simulador de semáforo con State',
        ],
        [
          '10 patterns applied: Factory Method, Abstract Factory, Builder, Prototype, Adapter, Bridge, Decorator, Facade, State and Strategy',
          'Stacks, queues, and singly, doubly and circular linked lists in Python and TypeScript',
          'A tower game with Builder and Decorator, and a traffic light simulator with State',
        ],
      ),
      technologies: ['Java', 'Python', 'TypeScript', 'FastAPI'],
      status: null,
      links: [
        { label: t('Ver en el stack', 'See it in the stack'), href: sectionHref('stack', locale), kind: 'section' },
        repoLink('Game-number-one-', t('Juego de torres', 'Tower game')),
        repoLink('traffic-light', t('Semáforo', 'Traffic light')),
      ],
    },

    // ── 2024 ────────────────────────────────────────────────────
    {
      id: 'primer-repositorio',
      group: 'projects',
      era: '2024',
      title: t('Primer repositorio', 'First repository'),
      railLabel: t('Primer repositorio', 'First repository'),
      role: t('Simulador bancario en Python', 'A bank simulator in Python'),
      kinds: ['personal'],
      period: t('Sep. 2024', 'Sep 2024'),
      description: t(
        'Cuentas de ahorro, corriente y CDT con sus operaciones: el inicio de mi perfil en GitHub.',
        'Savings, checking and term-deposit accounts with their operations: the start of my GitHub profile.',
      ),
      highlights: [],
      technologies: ['Python'],
      status: null,
      links: [repoLink('Banco')],
    },

    // ── Before ──────────────────────────────────────────────────
    {
      id: 'tecnico',
      group: 'education',
      era: '2023',
      title: info.technicalDegree,
      railLabel: t('Técnico en Informática', 'Computing technician'),
      role: t('Colegio Técnico Industrial · Egresado', 'Industrial Technical High School · Graduate'),
      kinds: ['academic'],
      period: '2023',
      description: t(
        'Me gradué en 2023 del colegio Técnico Industrial, donde me especialicé en informática. Ahí empezó mi camino en la programación.',
        'I graduated in 2023 from the Industrial Technical High School, where I specialized in computing. That is where my path in programming began.',
      ),
      highlights: [],
      technologies: [],
      status: t('Graduado en 2023', 'Graduated in 2023'),
      links: [],
    },
  ]
})

function projectLinks(project: Project, locale: Locale): ExperienceLink[] {
  const t = translator(locale)
  const links: ExperienceLink[] = []
  if (project.hasCaseStudy) {
    links.push({ label: t('Caso de estudio', 'Case study'), href: projectPath(project.slug, locale), kind: 'case-study' })
  }
  if (project.demoUrl) links.push({ label: project.demoLabel, href: project.demoUrl, kind: 'demo' })
  if (project.repoUrl) links.push({ label: t('Código', 'Code'), href: project.repoUrl, kind: 'repo' })
  return links
}
