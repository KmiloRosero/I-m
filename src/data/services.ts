import { GITHUB_PROFILE_URL } from '@/data/personalInfo'
import { getProjectNames } from '@/data/projectNames'
import { perLocale, translator } from '@/i18n/config'
import { projectPath } from '@/i18n/paths'
import type { Service, ServiceType } from '@/types/service'
import type { ProjectRef } from '@/types/skill'

export const getServiceTypes = perLocale((locale): readonly { id: ServiceType; label: string }[] => {
  const t = translator(locale)
  return [
    { id: 'web', label: 'Web' },
    { id: 'apps', label: t('Móvil y escritorio', 'Mobile and desktop') },
    { id: 'backend', label: t('Backend y nube', 'Backend and cloud') },
    { id: 'ia', label: t('IA', 'AI') },
  ]
})

export const getServices = perLocale((locale): readonly Service[] => {
  const t = translator(locale)
  const { biomedical, cineTracker, mercaJusto, moniWatch, portfolio } = getProjectNames(locale)

  const caseStudy = (name: string, slug: string): ProjectRef => ({ name, href: projectPath(slug, locale) })
  const repo = (name: string, repository: string): ProjectRef => ({
    name,
    href: `${GITHUB_PROFILE_URL}/${repository}`,
  })

  const BIOMEDICAL = caseStudy(biomedical, 'biomedical-waste-platform')
  const CINETRACKER = caseStudy(cineTracker, 'cinetracker')
  const MERCAJUSTO = caseStudy(mercaJusto, 'mercajusto')
  const MONIWATCH = caseStudy(moniWatch, 'moniwatch')
  const PORTFOLIO = repo(portfolio, 'I-m')
  const EMAS = repo(t('Sitio de EMAS (académico)', 'EMAS website (academic)'), 'Emas')
  const LIBRARY_API = repo(t('API REST de biblioteca', 'Library REST API'), 'API-REST')
  const CONSTRUCTION = repo(t('Gestión de obras', 'Construction management'), 'Construction-management')
  const SEAT_PICKER = repo('Choose Seats', 'Choose-Seats')
  const MUSIC_PLAYER = repo('Kmusic', 'Spotify')
  const MEDICAL_SYSTEM = repo('Medical Management System', 'fronted')

  return [
    {
      id: 'interfaces-web',
      type: 'web',
      title: t('Interfaces web', 'Web interfaces'),
      summary: t(
        'Reproductores, paneles, reservas y plataformas en React, publicados y en uso.',
        'Players, dashboards, bookings and platforms in React, live and in use.',
      ),
      description: t(
        'Construyo interfaces con React, TypeScript y Tailwind CSS: desde un reproductor de música hasta un sistema médico o un selector de asientos.',
        'I build interfaces with React, TypeScript and Tailwind CSS: from a music player to a medical system or a seat picker.',
      ),
      includes: t(
        [
          'Componentes reutilizables y accesibles con teclado',
          'Estados de carga, vacío y error',
          'Paneles con inicio de sesión, rutas y datos de una API',
          'Animaciones con propósito que respetan "reducir movimiento"',
        ],
        [
          'Reusable components that work with a keyboard',
          'Loading, empty and error states',
          'Dashboards with sign-in, routing and data from an API',
          'Purposeful animations that respect “reduce motion”',
        ],
      ),
      tools: ['React', 'TypeScript', 'Tailwind CSS', 'React Router', 'Zustand', 'Vite'],
      evidence: [SEAT_PICKER, MUSIC_PLAYER, MEDICAL_SYSTEM, BIOMEDICAL, PORTFOLIO],
      visual: {
        kind: 'gallery',
        images: [
          {
            alt: t(
              'Choose Seats: mapa de asientos de un avión con dos asientos elegidos y el total a pagar',
              'Choose Seats: a plane seat map with two seats picked and the total to pay',
            ),
            caption: 'Choose Seats',
            height: 900,
            href: 'https://choose-seats.vercel.app',
            src: '/images/services/interfaces/choose-seats.jpg',
            width: 1440,
          },
          {
            alt: t(
              'Kmusic: lista de reproducción con cinco canciones y el reproductor abajo',
              'Kmusic: a playlist with five songs and the player at the bottom',
            ),
            caption: 'Kmusic',
            height: 900,
            href: 'https://spotify-lime-iota.vercel.app',
            src: '/images/services/interfaces/kmusic.jpg',
            width: 1440,
          },
          {
            alt: t(
              'Medical Management System: panel con próximas citas y resultados de laboratorio',
              'Medical Management System: a dashboard with upcoming appointments and lab results',
            ),
            caption: 'Medical Management System',
            height: 900,
            href: 'https://fronted-nine-sigma.vercel.app',
            src: '/images/services/interfaces/medical-system.jpg',
            width: 1440,
          },
          {
            alt: t('Pantalla de acceso de BioMedWaste', 'BioMedWaste sign-in screen'),
            caption: 'BioMedWaste',
            height: 1800,
            href: 'https://biomedwasted.vercel.app/login',
            src: '/images/projects/biomedical/login.png',
            width: 2880,
          },
          {
            alt: t('Inicio de este portafolio en escritorio', 'The home page of this portfolio on desktop'),
            caption: portfolio,
            height: 900,
            src: '/images/projects/portfolio/desktop.webp',
            width: 1440,
          },
        ],
      },
    },
    {
      id: 'sitios-responsive',
      type: 'web',
      title: t('Sitios responsive', 'Responsive websites'),
      summary: t(
        'Sitios que se adaptan a celular, tablet y escritorio, como este.',
        'Websites that adapt to phones, tablets and desktops, like this one.',
      ),
      description: t(
        'Hago sitios con Next.js que se adaptan a celular, tablet y escritorio, como el que estás viendo ahora.',
        "I build websites with Next.js that adapt to phones, tablets and desktops, like the one you're looking at.",
      ),
      includes: t(
        [
          'Diseño pensado primero para el celular',
          'Metadatos y vista previa para compartir en redes',
          'Imágenes optimizadas y carga rápida',
          'Publicación en Vercel',
        ],
        [
          'Mobile-first design',
          'Metadata and previews for sharing on social media',
          'Optimized images and fast loading',
          'Publishing on Vercel',
        ],
      ),
      tools: ['Next.js', 'React', 'Tailwind CSS', 'Vercel'],
      evidence: [PORTFOLIO, EMAS],
      visual: {
        kind: 'screens',
        previewPair: true,
        images: [
          {
            alt: t('Este portafolio en un computador', 'This portfolio on a computer'),
            caption: t('Escritorio', 'Desktop'),
            height: 900,
            src: '/images/projects/portfolio/desktop.webp',
            width: 1440,
          },
          {
            alt: t('Este portafolio en un celular', 'This portfolio on a phone'),
            caption: t('Celular', 'Phone'),
            height: 1688,
            src: '/images/projects/portfolio/mobile.webp',
            width: 780,
          },
        ],
      },
    },
    {
      id: 'apps-moviles',
      type: 'apps',
      title: t('Apps móviles', 'Mobile apps'),
      summary: t(
        'Apps para Android e iOS con React Native, y hasta para el reloj.',
        'Apps for Android and iOS with React Native, even for smartwatches.',
      ),
      description: t(
        'Desarrollo apps móviles con React Native y Expo, con flujos por rol, mapas en vivo y conectadas a su propio backend.',
        'I build mobile apps with React Native and Expo, with role-based flows, live maps and their own backend.',
      ),
      includes: t(
        [
          'Una sola app con flujos por rol: comprador, productor y repartidor',
          'Seguimiento en vivo del repartidor en el mapa',
          'Pagos en línea, notificaciones push y modo oscuro',
          'Apps para relojes con Wear OS',
        ],
        [
          'One app with role-based flows: buyer, farmer and courier',
          'Live courier tracking on the map',
          'Online payments, push notifications and dark mode',
          'Smartwatch apps with Wear OS',
        ],
      ),
      tools: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'Leaflet'],
      evidence: [MERCAJUSTO, MONIWATCH],
      visual: {
        kind: 'screens',
        images: [
          {
            alt: t(
              'MercaJusto: inicio del comprador, seguimiento en vivo, inicio del productor y ruta del repartidor',
              "MercaJusto: buyer home, live tracking, farmer home and the courier's route",
            ),
            caption: mercaJusto,
            height: 900,
            src: '/images/projects/mercajusto/portada.jpg',
            width: 1600,
          },
          {
            alt: t(
              'Seguimiento en vivo de un pedido de MercaJusto, con el repartidor en el mapa',
              'Live tracking of a MercaJusto order, with the courier on the map',
            ),
            caption: t('Seguimiento en vivo', 'Live tracking'),
            height: 1169,
            src: '/images/projects/mercajusto/06-seguimiento.jpg',
            width: 540,
          },
        ],
      },
    },
    {
      id: 'apps-escritorio',
      type: 'apps',
      title: t('Apps de escritorio', 'Desktop apps'),
      summary: t(
        'Apps para Windows, macOS y Linux con Electron y datos locales.',
        'Apps for Windows, macOS and Linux with Electron and local data.',
      ),
      description: t(
        'Creo apps de escritorio con Electron y React que guardan los datos en el propio equipo, sin depender de un servidor.',
        'I build desktop apps with Electron and React that keep the data on the computer itself, without depending on a server.',
      ),
      includes: t(
        [
          'Base de datos local SQLite con migraciones',
          'Procesos separados que se comunican por IPC',
          'Builds para Windows, macOS y Linux con integración continua',
          'Importación y exportación de datos',
        ],
        [
          'A local SQLite database with migrations',
          'Separate processes that talk over IPC',
          'Builds for Windows, macOS and Linux with continuous integration',
          'Data import and export',
        ],
      ),
      tools: ['Electron', 'React', 'SQLite', 'GitHub Actions'],
      evidence: [CINETRACKER],
      visual: {
        kind: 'screens',
        images: [
          {
            alt: t(
              'Inicio de CineTracker con la serie en curso y el resumen del catálogo',
              'CineTracker home with the show in progress and the catalog summary',
            ),
            caption: t('Inicio, en CineTracker', 'Home, in CineTracker'),
            height: 900,
            src: '/images/projects/cinetracker/home.png',
            width: 1440,
          },
          {
            alt: t('Estadísticas de CineTracker con el perfil cinéfilo', 'CineTracker statistics with the film-lover profile'),
            caption: t('Estadísticas', 'Statistics'),
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
      title: t('Backend y APIs', 'Backend and APIs'),
      summary: t(
        'APIs REST con autenticación, pedidos, pagos y webhooks.',
        'REST APIs with authentication, orders, payments and webhooks.',
      ),
      description: t(
        'Desarrollo APIs REST con Node.js, NestJS o Spring Boot: autenticación, pedidos, pagos y webhooks.',
        'I build REST APIs with Node.js, NestJS or Spring Boot: authentication, orders, payments and webhooks.',
      ),
      includes: t(
        [
          'Arquitectura en capas: controladores, servicios y repositorios',
          'Autenticación y permisos',
          'Pagos con Wompi: idempotentes y con webhooks de firma verificada',
          'Manejo de errores centralizado',
        ],
        [
          'Layered architecture: controllers, services and repositories',
          'Authentication and permissions',
          'Payments with Wompi: idempotent, with signature-verified webhooks',
          'Centralized error handling',
        ],
      ),
      tools: ['Node.js', 'Express', 'NestJS', 'Spring Boot'],
      evidence: [MONIWATCH, MERCAJUSTO, BIOMEDICAL, LIBRARY_API],
      visual: {
        kind: 'routes',
        groups: [
          { label: moniWatch, items: ['/auth', '/payment-methods', '/devices', '/transactions', '/webhooks/wompi'] },
          { label: mercaJusto, items: ['/api/products', '/api/cart', '/api/orders', '/api/payments', '/api/courier'] },
          { label: biomedical, items: ['/api/wastes', '/api/alerts', '/api/statistics'] },
        ],
      },
    },
    {
      id: 'bases-de-datos',
      type: 'backend',
      title: t('Bases de datos', 'Databases'),
      summary: t(
        'Modelos relacionales y documentales, con Prisma o SQL directo.',
        'Relational and document models, with Prisma or plain SQL.',
      ),
      description: t(
        'Modelo e integro bases de datos PostgreSQL, MySQL, SQLite y MongoDB, con Prisma o con SQL directo.',
        'I model and integrate PostgreSQL, MySQL, SQLite and MongoDB databases, with Prisma or plain SQL.',
      ),
      includes: t(
        [
          'Diseño del modelo y sus relaciones',
          'Migraciones versionadas',
          'Consultas desde Prisma, JPA o SQL',
          'Bases locales para apps sin servidor',
        ],
        [
          'Designing the model and its relations',
          'Versioned migrations',
          'Queries from Prisma, JPA or SQL',
          'Local databases for serverless apps',
        ],
      ),
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
          { label: `${mercaJusto}, PostgreSQL`, items: ['Product', 'CartItem', 'Order', 'DeliveryRoute', 'Review'] },
        ],
      },
    },
    {
      id: 'despliegue-nube',
      type: 'backend',
      title: t('Despliegue y nube', 'Deployment and cloud'),
      summary: t(
        'Publicar el proyecto y mantenerlo en línea, con Docker y servicios en la nube.',
        'Shipping the project and keeping it online, with Docker and cloud services.',
      ),
      description: t(
        'Publico frontends y backends en la nube, con contenedores Docker e integración continua para cada cambio.',
        'I deploy frontends and backends to the cloud, with Docker containers and continuous integration for every change.',
      ),
      includes: t(
        [
          'Frontends en Vercel y backends en Render o Railway',
          'Contenedores con Docker',
          'Integración continua con GitHub Actions',
          'Servicios de AWS: EC2, S3, Lambda, IAM y Cognito',
        ],
        [
          'Frontends on Vercel and backends on Render or Railway',
          'Containers with Docker',
          'Continuous integration with GitHub Actions',
          'AWS services: EC2, S3, Lambda, IAM and Cognito',
        ],
      ),
      tools: ['Vercel', 'Render', 'Railway', 'Docker', 'GitHub Actions', 'AWS'],
      evidence: [MERCAJUSTO, BIOMEDICAL, MONIWATCH, CONSTRUCTION],
      visual: {
        kind: 'tables',
        groups: [
          { label: t('Despliegue', 'Deployment'), items: ['Vercel', 'Render', 'Railway'] },
          {
            label: t('Contenedores e integración continua', 'Containers and continuous integration'),
            items: ['Docker', 'GitHub Actions'],
          },
          { label: 'Amazon Web Services', items: ['EC2', 'S3', 'Lambda', 'IAM', 'CloudShell', 'Cognito'] },
        ],
      },
    },
    {
      id: 'ia',
      type: 'ia',
      title: t('Desarrollo con apoyo de IA', 'AI-assisted development'),
      summary: t(
        'Funciones con IA dentro del producto y desarrollo asistido por IA.',
        'AI features inside the product, and AI-assisted development.',
      ),
      description: t(
        'Integro APIs de IA en productos reales y uso herramientas de IA como apoyo para programar.',
        'I integrate AI APIs into real products and use AI tools to support my programming.',
      ),
      includes: t(
        [
          'Integración con las APIs de Anthropic, Gemini y OpenAI',
          'Recomendaciones con una justificación para cada resultado',
          'Asistentes dentro de la aplicación',
          'Desarrollo asistido con Claude Code y Kiro',
        ],
        [
          'Integration with the Anthropic, Gemini and OpenAI APIs',
          'Recommendations with a reason for every result',
          'Assistants inside the app',
          'Assisted development with Claude Code and Kiro',
        ],
      ),
      tools: [
        t('API de Anthropic', 'Anthropic API'),
        t('API de Gemini', 'Gemini API'),
        t('API de OpenAI', 'OpenAI API'),
        'Claude Code',
      ],
      evidence: [CINETRACKER, BIOMEDICAL, MERCAJUSTO],
      visual: {
        kind: 'screens',
        images: [
          {
            alt: t(
              'Lista generada por IA en la sección Descubrir de CineTracker',
              "An AI-generated list in CineTracker's Discover section",
            ),
            caption: t('Descubrir, en CineTracker', 'Discover, in CineTracker'),
            height: 900,
            src: '/images/projects/cinetracker/discover.png',
            width: 1440,
          },
          {
            alt: t(
              'Recomendaciones de ¿Qué veo esta noche? en CineTracker',
              'Recommendations from “What should I watch tonight?” in CineTracker',
            ),
            caption: t('Esta noche, en CineTracker', 'Tonight, in CineTracker'),
            height: 900,
            src: '/images/projects/cinetracker/tonight.png',
            width: 1440,
          },
        ],
      },
    },
  ]
})
