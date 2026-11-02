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

export const projects: readonly Project[] = [
  {
    slug: 'biomedical',
    name: 'Biomedical Waste Platform',
    platform: 'Plataforma web',
    summary: 'Sistema de gestión de residuos biomédicos con frontend en React y backend en Spring Boot.',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'Leaflet', 'Spring Boot'],
    features: ['Trazabilidad', 'Rutas', 'Alertas', 'Reportes', 'Auditoría', 'Asistente de IA'],
    contribution: null,
    repoUrl: 'https://github.com/KmiloRosero/biomedical-fronted',
    extraRepoUrl: 'https://github.com/KmiloRosero/biomedical-backend',
    demoUrl: 'https://biomedwasted.vercel.app/login',
    featured: true,
  },
  {
    slug: 'mercajusto',
    name: 'MercaJusto',
    platform: 'App móvil',
    summary:
      'Conecta a productores campesinos de Nariño con compradores urbanos, sin intermediarios.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Node', 'Express', 'Prisma'],
    features: ['Carrito y pedidos', 'Motor de rutas con k-means y 2-opt', 'Notificaciones push'],
    contribution: null,
    repoUrl: 'https://github.com/KmiloRosero/MercaJusto',
    extraRepoUrl: null,
    demoUrl: 'https://mercajusto.vercel.app/',
    featured: false,
  },
  {
    slug: 'moniwatch',
    name: 'MoniWatch',
    platform: 'Wear OS y móvil',
    summary: 'Pagos desde la muñeca con Nequi o tarjeta: el celular configura y el reloj paga.',
    stack: ['NestJS', 'Prisma', 'PostgreSQL', 'Expo', 'React Native', 'Wear OS'],
    features: [
      'Vinculación del reloj por código',
      'Pagos idempotentes',
      'Revocación inmediata de tokens',
    ],
    contribution: null,
    repoUrl: 'https://github.com/KmiloRosero/MoniWatch',
    extraRepoUrl: null,
    demoUrl: null,
    featured: false,
  },
  {
    slug: 'cinetracker',
    name: 'CineTracker',
    platform: 'App de escritorio',
    summary: 'Seguimiento, calificación y recomendaciones de películas y series.',
    stack: ['Electron', 'React', 'SQLite', 'TMDB'],
    features: ['Catálogo con TMDB', 'Listas generadas por IA', 'Progreso por episodio'],
    contribution: null,
    repoUrl: 'https://github.com/KmiloRosero/CineTracker',
    extraRepoUrl: null,
    demoUrl: 'https://github.com/KmiloRosero/CineTracker/releases/tag/v1.2.0',
    featured: false,
  },
  {
    slug: 'reticula',
    name: 'Retícula',
    platform: 'Juego en el navegador',
    summary: 'Entrenador de puntería 3D para practicar shooters y coordinación ojo-mano.',
    stack: ['Three.js', 'JavaScript', 'Vite', 'Web Audio API'],
    features: ['Evaluación por fases', 'Bots humanoides', 'Conversión de sensibilidad entre juegos'],
    contribution: null,
    repoUrl: 'https://github.com/Ju4nK1807/Reticula',
    extraRepoUrl: null,
    demoUrl: null,
    featured: false,
  },
]
