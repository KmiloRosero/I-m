import { GITHUB_PROFILE_URL } from '@/data/personalInfo'
import { projectNames } from '@/data/projectNames'
import type { Service, ServiceType } from '@/types/service'
import type { ProjectRef } from '@/types/skill'

const { biomedical, cineTracker, mercaJusto, moniWatch, portfolio } = projectNames

const caseStudy = (name: string, slug: string): ProjectRef => ({ name, href: `/proyectos/${slug}` })
const repo = (name: string, repository: string): ProjectRef => ({
  name,
  href: `${GITHUB_PROFILE_URL}/${repository}`,
})

const BIOMEDICAL = caseStudy(biomedical, 'biomedical-waste-platform')
const CINETRACKER = caseStudy(cineTracker, 'cinetracker')
const MERCAJUSTO = caseStudy(mercaJusto, 'mercajusto')
const MONIWATCH = caseStudy(moniWatch, 'moniwatch')
const PORTFOLIO = repo(portfolio, 'I-m')
const EMAS = repo('Sitio de EMAS', 'Emas')
const LIBRARY_API = repo('API REST de biblioteca', 'API-REST')
const CONSTRUCTION = repo('Gestión de obras', 'Construction-management')

export const serviceTypes: readonly { id: ServiceType; label: string }[] = [
  { id: 'web', label: 'Web' },
  { id: 'apps', label: 'Móvil y escritorio' },
  { id: 'backend', label: 'Backend y nube' },
  { id: 'ia', label: 'IA' },
]

export const services: readonly Service[] = [
  {
    id: 'interfaces-web',
    type: 'web',
    title: 'Interfaces web',
    summary: 'Interfaces en React y TypeScript, cuidando cada estado y cada interacción.',
    description:
      'Construyo interfaces con React, TypeScript y Tailwind CSS, cuidando cada estado y cada interacción.',
    includes: [
      'Componentes reutilizables y accesibles con teclado',
      'Estados de carga, vacío y error',
      'Animaciones con propósito que respetan "reducir movimiento"',
      'Conexión con APIs y manejo del estado',
    ],
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Vite'],
    evidence: [BIOMEDICAL, PORTFOLIO],
    visual: {
      kind: 'screens',
      images: [
        {
          alt: 'Inicio de este portafolio en escritorio',
          caption: portfolio,
          height: 900,
          src: '/images/projects/portfolio/desktop.png',
          width: 1440,
        },
        {
          alt: 'Pantalla de acceso de BioMedWaste',
          caption: biomedical,
          height: 1800,
          src: '/images/projects/biomedical/login.png',
          width: 2880,
        },
      ],
    },
  },
  {
    id: 'sitios-responsive',
    type: 'web',
    title: 'Sitios responsive',
    summary: 'Sitios que se adaptan a celular, tablet y escritorio, como este.',
    description:
      'Hago sitios con Next.js que se adaptan a celular, tablet y escritorio, como el que estás viendo ahora.',
    includes: [
      'Diseño pensado primero para el celular',
      'Metadatos y vista previa para compartir en redes',
      'Imágenes optimizadas y carga rápida',
      'Publicación en Vercel',
    ],
    tools: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
    evidence: [PORTFOLIO, EMAS],
    visual: {
      kind: 'screens',
      images: [
        {
          alt: 'Este portafolio en un computador',
          caption: 'Escritorio',
          height: 900,
          src: '/images/projects/portfolio/desktop.png',
          width: 1440,
        },
        {
          alt: 'Este portafolio en un celular',
          caption: 'Celular',
          height: 1688,
          src: '/images/projects/portfolio/mobile.png',
          width: 780,
        },
      ],
    },
  },
  {
    id: 'apps-moviles',
    type: 'apps',
    title: 'Apps móviles',
    summary: 'Apps para Android e iOS con React Native, y hasta para el reloj.',
    description:
      'Desarrollo apps móviles con React Native y Expo, con flujos por rol y conectadas a su propio backend.',
    includes: [
      'Navegación por roles con Expo Router',
      'Notificaciones push',
      'Versión web publicada desde el mismo código',
      'Apps para relojes con Wear OS',
    ],
    tools: ['React Native', 'Expo', 'TypeScript', 'Zustand'],
    evidence: [MERCAJUSTO, MONIWATCH],
    visual: {
      kind: 'screens',
      images: [
        {
          alt: 'Pantalla de bienvenida de MercaJusto con un productor y su cosecha',
          caption: mercaJusto,
          height: 1688,
          src: '/images/projects/mercajusto/onboarding.png',
          width: 780,
        },
      ],
    },
  },
  {
    id: 'apps-escritorio',
    type: 'apps',
    title: 'Apps de escritorio',
    summary: 'Apps para Windows, macOS y Linux con Electron y datos locales.',
    description:
      'Creo apps de escritorio con Electron y React que guardan los datos en el propio equipo, sin depender de un servidor.',
    includes: [
      'Base de datos local SQLite con migraciones',
      'Procesos separados que se comunican por IPC',
      'Builds para Windows, macOS y Linux con integración continua',
      'Importación y exportación de datos',
    ],
    tools: ['Electron', 'React', 'SQLite', 'GitHub Actions'],
    evidence: [CINETRACKER],
    visual: {
      kind: 'screens',
      images: [
        {
          alt: 'Inicio de CineTracker con la serie en curso y el resumen del catálogo',
          caption: 'Inicio, en CineTracker',
          height: 900,
          src: '/images/projects/cinetracker/home.png',
          width: 1440,
        },
        {
          alt: 'Estadísticas de CineTracker con el perfil cinéfilo',
          caption: 'Estadísticas',
          height: 900,
          src: '/images/projects/cinetracker/statistics.png',
          width: 1440,
        },
      ],
    },
  },
  {
    id: 'backend-apis',
    type: 'backend',
    title: 'Backend y APIs',
    summary: 'APIs REST con autenticación, pedidos, pagos y webhooks.',
    description:
      'Desarrollo APIs REST con Node.js, NestJS o Spring Boot: autenticación, pedidos, pagos y webhooks.',
    includes: [
      'Arquitectura en capas: controladores, servicios y repositorios',
      'Autenticación y permisos',
      'Pagos idempotentes y webhooks con firma verificada',
      'Manejo de errores centralizado',
    ],
    tools: ['Node.js', 'Express', 'NestJS', 'Spring Boot'],
    evidence: [MONIWATCH, MERCAJUSTO, BIOMEDICAL, LIBRARY_API],
    visual: {
      kind: 'routes',
      groups: [
        { label: moniWatch, items: ['/auth', '/payment-methods', '/transactions', '/webhooks'] },
        { label: mercaJusto, items: ['/api/products', '/api/orders', '/api/payments', '/api/routes'] },
        { label: biomedical, items: ['/api/wastes', '/api/alerts', '/api/statistics'] },
      ],
    },
  },
  {
    id: 'bases-de-datos',
    type: 'backend',
    title: 'Bases de datos',
    summary: 'Modelos relacionales y documentales, con Prisma o SQL directo.',
    description:
      'Modelo e integro bases de datos PostgreSQL, MySQL, SQLite y MongoDB, con Prisma o con SQL directo.',
    includes: [
      'Diseño del modelo y sus relaciones',
      'Migraciones versionadas',
      'Consultas desde Prisma, JPA o SQL',
      'Bases locales para apps sin servidor',
    ],
    tools: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Prisma'],
    evidence: [MONIWATCH, BIOMEDICAL, CINETRACKER, LIBRARY_API],
    visual: {
      kind: 'tables',
      groups: [
        { label: `${moniWatch}, PostgreSQL`, items: ['User', 'PaymentMethod', 'Transaction', 'DeviceSession'] },
        {
          label: `${biomedical}, MySQL`,
          items: ['rutas', 'flota_transporte', 'manifiestos_transporte', 'lotes_tratamiento'],
        },
        { label: `${mercaJusto}, PostgreSQL`, items: ['Product', 'Order', 'DeliveryRoute', 'Review'] },
      ],
    },
  },
  {
    id: 'despliegue-nube',
    type: 'backend',
    title: 'Despliegue y nube',
    summary: 'Publicar el proyecto y mantenerlo en línea, con Docker y servicios en la nube.',
    description:
      'Publico frontends y backends en la nube, con contenedores Docker e integración continua para cada cambio.',
    includes: [
      'Frontends en Vercel y backends en Render o Railway',
      'Contenedores con Docker',
      'Integración continua con GitHub Actions',
      'Servicios de AWS: EC2, S3, Lambda, IAM y Cognito',
    ],
    tools: ['Vercel', 'Render', 'Railway', 'Docker', 'GitHub Actions', 'AWS'],
    evidence: [MERCAJUSTO, BIOMEDICAL, MONIWATCH, CONSTRUCTION],
    visual: {
      kind: 'tables',
      groups: [
        { label: 'Despliegue', items: ['Vercel', 'Render', 'Railway'] },
        { label: 'Contenedores e integración continua', items: ['Docker', 'GitHub Actions'] },
        { label: 'Amazon Web Services', items: ['EC2', 'S3', 'Lambda', 'IAM', 'CloudShell', 'Cognito'] },
      ],
    },
  },
  {
    id: 'ia',
    type: 'ia',
    title: 'Desarrollo con apoyo de IA',
    summary: 'Funciones con IA dentro del producto y desarrollo asistido por IA.',
    description:
      'Integro APIs de IA en productos reales y uso herramientas de IA como apoyo para programar.',
    includes: [
      'Integración con las APIs de Anthropic, Gemini y OpenAI',
      'Recomendaciones con una justificación para cada resultado',
      'Asistentes dentro de la aplicación',
      'Desarrollo asistido con Claude Code y Kiro',
    ],
    tools: ['API de Anthropic', 'API de Gemini', 'API de OpenAI', 'Claude Code'],
    evidence: [CINETRACKER, BIOMEDICAL, MERCAJUSTO],
    visual: {
      kind: 'screens',
      images: [
        {
          alt: 'Lista generada por IA en la sección Descubrir de CineTracker',
          caption: 'Descubrir, en CineTracker',
          height: 900,
          src: '/images/projects/cinetracker/discover.png',
          width: 1440,
        },
        {
          alt: 'Recomendaciones de ¿Qué veo esta noche? en CineTracker',
          caption: 'Esta noche, en CineTracker',
          height: 900,
          src: '/images/projects/cinetracker/tonight.png',
          width: 1440,
        },
      ],
    },
  },
]
