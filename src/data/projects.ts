import { GITHUB_PROFILE_URL } from '@/data/personalInfo'
import { getProjectNames } from '@/data/projectNames'
import { perLocale, translator, type Locale } from '@/i18n/config'
import type { Project } from '@/types/project'

export const getProjects = perLocale((locale): readonly Project[] => {
  const t = translator(locale)
  const names = getProjectNames(locale)
  const solo = t('Desarrollé el proyecto completo.', 'I built the whole project.')
  const half = t('Realicé la mitad del desarrollo.', 'I did half of the development.')
  const viewCode = t('Ver código', 'View code')
  const openDemo = t('Abrir demo', 'Open demo')

  return [
    {
      slug: 'biomedical-waste-platform',
      name: names.biomedical,
      platform: t('Plataforma web', 'Web platform'),
      layout: 'feature',
      block: 'ore',
      categories: ['academic', 'collaborative'],
      description: t(
        'Plataforma para registrar residuos biomédicos, seguir su estado y gestionar alertas, rutas y estadísticas.',
        'A platform to log biomedical waste, track its status and manage alerts, routes and statistics.',
      ),
      problem: t(
        'Gestionar residuos biomédicos exige saber qué se generó, de qué tipo es y en qué estado se encuentra.',
        'Managing biomedical waste means knowing what was produced, what kind it is and what state it is in.',
      ),
      purpose: t(
        'Centralizar el registro y el seguimiento de los residuos en una sola plataforma.',
        'Bring the logging and tracking of waste together in a single platform.',
      ),
      solution: t(
        'Un frontend en React conectado a una API en Spring Boot, con módulos de residuos, alertas, rutas, estadísticas y administración.',
        'A React frontend connected to a Spring Boot API, with modules for waste, alerts, routes, statistics and administration.',
      ),
      technologies: ['TypeScript', 'Java', 'SQL', 'MySQL', 'Supabase', 'Leaflet', t('API de OpenAI', 'OpenAI API')],
      frameworks: ['React', 'Vite', 'Tailwind CSS', 'Zustand', 'Spring Boot'],
      contribution: half,
      collaboration: t(
        'Proyecto final de la universidad, desarrollado en equipo.',
        'Final university project, built as a team.',
      ),
      location: null,
      period: null,
      status: t('Proyecto final universitario', 'Final university project'),
      verifiedFeatures: t(
        [
          'Registro, consulta, edición y eliminación de residuos',
          'Filtros por tipo de residuo y por entidad',
          'Avance de estados y registro de trazabilidad',
          'Alertas con nivel de riesgo alto, medio o bajo',
          'Tratamientos según el tipo de residuo',
          'Gestión de rutas',
          'Estadísticas de generación',
          'Asistente conectado a la API de OpenAI',
        ],
        [
          'Create, read, update and delete waste records',
          'Filters by waste type and by entity',
          'Status progression with a traceability log',
          'Alerts with high, medium or low risk',
          'Treatments based on the type of waste',
          'Route management',
          'Waste generation statistics',
          'An assistant connected to the OpenAI API',
        ],
      ),
      architecture: t(
        [
          'Frontend organizado en módulos por funcionalidad',
          'API REST en Spring Boot con controladores, servicios y repositorios',
          'Patrones Factory, Abstract Factory, Adapter, Bridge, Builder, Decorator y Prototype',
          'Estructuras propias: pila de alertas, cola de recolección, lista de trazabilidad, árbol de tipos y grafo de rutas',
        ],
        [
          'Frontend organized in feature modules',
          'Spring Boot REST API with controllers, services and repositories',
          'Factory, Abstract Factory, Adapter, Bridge, Builder, Decorator and Prototype patterns',
          'Hand-built structures: an alert stack, a pickup queue, a traceability list, a type tree and a route graph',
        ],
      ),
      flowSteps: [],
      screenshots: [
        {
          alt: t('Pantalla de inicio de sesión de BioMedWaste', 'BioMedWaste sign-in screen'),
          height: 1800,
          label: t('Acceso', 'Sign-in'),
          src: '/images/projects/biomedical/login.png',
          width: 2880,
        },
      ],
      repoUrl: `${GITHUB_PROFILE_URL}/biomedical-fronted`,
      repoLabel: t('Código del frontend', 'Frontend code'),
      extraRepoUrl: `${GITHUB_PROFILE_URL}/biomedical-backend`,
      demoUrl: null,
      demoLabel: openDemo,
      hasCaseStudy: true,
    },
    {
      slug: 'cinetracker',
      name: names.cineTracker,
      platform: t('App de escritorio', 'Desktop app'),
      layout: 'wide',
      block: 'log',
      categories: ['personal'],
      description: t(
        'Diario privado de películas y series, con recomendaciones basadas en tus gustos.',
        'A private diary of movies and shows, with recommendations based on your taste.',
      ),
      problem: t(
        'Quien ve series y películas en varias plataformas no tiene un lugar privado para llevar lo visto y decidir qué ver.',
        'People who watch shows and movies across several platforms have no private place to log what they saw and decide what to watch.',
      ),
      purpose: t(
        'Una alternativa local a Letterboxd: sin red social, sin perfil público y sin servidor.',
        'A local alternative to Letterboxd: no social network, no public profile and no server.',
      ),
      solution: t(
        'Una app de escritorio con catálogo, estadísticas y listas generadas por IA, donde cada sugerencia es un título real de TMDB.',
        'A desktop app with a catalog, statistics and AI-generated lists, where every suggestion is a real title from TMDB.',
      ),
      technologies: [
        'JavaScript',
        'SQLite',
        'TMDB',
        t('API de Anthropic', 'Anthropic API'),
        t('API de Gemini', 'Gemini API'),
      ],
      frameworks: ['Electron', 'React', 'Vite', 'Tailwind CSS', 'Vitest'],
      contribution: solo,
      collaboration: null,
      location: null,
      period: null,
      status: t('Versión 1.2.0 publicada', 'Version 1.2.0 released'),
      verifiedFeatures: t(
        [
          'Catálogo con búsqueda en TMDB, calificaciones y notas',
          'Listas generadas por IA con una justificación para cada título',
          'Progreso de series por episodio',
          'Estadísticas y perfil cinéfilo',
          'Importación desde Letterboxd e IMDb, y exportación a CSV',
        ],
        [
          'Catalog with TMDB search, ratings and notes',
          'AI-generated lists with a reason for every title',
          'Episode-by-episode progress for shows',
          'Statistics and a film-lover profile',
          'Import from Letterboxd and IMDb, and export to CSV',
        ],
      ),
      architecture: t(
        [
          'Backend dentro del proceso principal de Electron',
          'Comunicación por IPC con repositorios y servicios separados',
          'Base de datos SQLite local con migraciones',
          'Integración continua en Windows, macOS y Linux',
        ],
        [
          "Backend inside Electron's main process",
          'IPC communication with separate repositories and services',
          'Local SQLite database with migrations',
          'Continuous integration on Windows, macOS and Linux',
        ],
      ),
      flowSteps: [],
      screenshots: [
        {
          alt: t(
            'Inicio de CineTracker con la serie en curso y el resumen del catálogo',
            'CineTracker home with the show in progress and the catalog summary',
          ),
          height: 900,
          label: t('Inicio', 'Home'),
          src: '/images/projects/cinetracker/home.png',
          width: 1440,
        },
        {
          alt: t('Ficha de un título en CineTracker', 'A title page in CineTracker'),
          height: 900,
          label: t('Título', 'Title'),
          src: '/images/projects/cinetracker/showcase.png',
          width: 1440,
        },
        {
          alt: t(
            'Recomendaciones de ¿Qué veo esta noche? en CineTracker',
            'Recommendations from “What should I watch tonight?” in CineTracker',
          ),
          height: 900,
          label: t('Esta noche', 'Tonight'),
          src: '/images/projects/cinetracker/tonight.png',
          width: 1440,
        },
        {
          alt: t(
            'Sección Descubrir de CineTracker con una lista basada en los gustos',
            "CineTracker's Discover section with a list based on your taste",
          ),
          height: 900,
          label: t('Descubrir', 'Discover'),
          src: '/images/projects/cinetracker/discover.png',
          width: 1440,
        },
        {
          alt: t('Estadísticas de CineTracker con el perfil cinéfilo', 'CineTracker statistics with the film-lover profile'),
          height: 900,
          label: t('Estadísticas', 'Statistics'),
          src: '/images/projects/cinetracker/statistics.png',
          width: 1440,
        },
      ],
      repoUrl: `${GITHUB_PROFILE_URL}/CineTracker`,
      repoLabel: viewCode,
      extraRepoUrl: null,
      demoUrl: `${GITHUB_PROFILE_URL}/CineTracker/releases/tag/v1.2.0`,
      demoLabel: t('Descargar', 'Download'),
      hasCaseStudy: true,
    },
    {
      slug: 'mercajusto',
      name: names.mercaJusto,
      platform: t('App móvil', 'Mobile app'),
      layout: 'phone',
      block: 'grass',
      categories: ['academic'],
      description: t(
        'Conecta a productores campesinos de Nariño con compradores urbanos, sin intermediarios.',
        'Connects farmers in Nariño with buyers in the city, with no middlemen.',
      ),
      problem: t(
        'Los intermediarios encarecen la comida para quien compra y reducen el ingreso de quien cultiva.',
        'Middlemen make food more expensive for buyers and cut the income of the people who grow it.',
      ),
      purpose: t(
        'Que el comprador pague menos que en la plaza y el productor reciba más por su cosecha.',
        'Buyers pay less than at the market, and farmers get more for their harvest.',
      ),
      solution: t(
        'Una app con flujos propios para comprador, productor y repartidor, y un backend que agrupa las entregas en rutas.',
        'An app with its own flows for buyers, farmers and couriers, and a backend that groups deliveries into routes.',
      ),
      technologies: ['TypeScript', 'PostgreSQL', 'Prisma', 'Leaflet', 'Wompi'],
      frameworks: ['React Native', 'Expo', 'Zustand', 'Node.js', 'Express'],
      contribution: solo,
      collaboration: null,
      location: 'Nariño, Colombia',
      period: null,
      status: t('Demo web publicada', 'Web demo published'),
      verifiedFeatures: t(
        [
          'Rescátalo hoy: cosechas por perderse con descuento y cuenta regresiva',
          'Canasta con varios productores en un solo envío',
          'Pago contraentrega o en línea',
          'Seguimiento en vivo del repartidor en el mapa',
          'Publicación de cosechas en tres pasos',
          'Rutas de entrega optimizadas con k-means y 2-opt',
          'Notificaciones push y modo oscuro',
        ],
        [
          '“Rescue it today”: harvests about to go to waste, discounted with a countdown',
          'A basket from several farmers in a single delivery',
          'Cash on delivery or online payment',
          'Live courier tracking on the map',
          'Publishing a harvest in three steps',
          'Delivery routes optimized with k-means and 2-opt',
          'Push notifications and dark mode',
        ],
      ),
      architecture: t(
        [
          'App móvil con Expo Router y navegación por rol',
          'API REST en Express con Prisma sobre PostgreSQL',
          'Estado con Zustand: sesión, canasta, tema y avisos',
          'Backend en Render y versión web en Vercel',
        ],
        [
          'Mobile app with Expo Router and role-based navigation',
          'Express REST API with Prisma on PostgreSQL',
          'State with Zustand: session, basket, theme and notices',
          'Backend on Render and the web version on Vercel',
        ],
      ),
      flowSteps: [],
      screenshots: [
        {
          alt: t(
            'MercaJusto: inicio del comprador, seguimiento en vivo, inicio del productor y ruta del repartidor',
            "MercaJusto: buyer home, live tracking, farmer home and the courier's route",
          ),
          height: 900,
          label: t('Los tres roles', 'The three roles'),
          src: '/images/projects/mercajusto/portada.jpg',
          width: 1600,
        },
        {
          alt: t(
            'Inicio del comprador con el cuadro Rescátalo hoy y su cuenta regresiva',
            'Buyer home with the “Rescue it today” box and its countdown',
          ),
          height: 1169,
          label: t('Inicio', 'Home'),
          src: '/images/projects/mercajusto/02-inicio.jpg',
          width: 540,
        },
        {
          alt: t(
            'Seguimiento en vivo de un pedido, con el repartidor en el mapa',
            'Live tracking of an order, with the courier on the map',
          ),
          height: 1169,
          label: t('Seguimiento', 'Tracking'),
          src: '/images/projects/mercajusto/06-seguimiento.jpg',
          width: 540,
        },
        {
          alt: t('Inicio del productor con los pedidos por atender', 'Farmer home with the orders to fulfil'),
          height: 1169,
          label: t('Productor', 'Farmer'),
          src: '/images/projects/mercajusto/08-productor-inicio.jpg',
          width: 540,
        },
        {
          alt: t(
            'Ruta del día del repartidor, ordenada para recorrer menos kilómetros',
            "The courier's route for the day, ordered to drive fewer kilometres",
          ),
          height: 1169,
          label: t('Repartidor', 'Courier'),
          src: '/images/projects/mercajusto/11-repartidor-ruta.jpg',
          width: 540,
        },
        {
          alt: t('Bienvenida de MercaJusto', 'MercaJusto welcome screen'),
          height: 1169,
          label: t('Bienvenida', 'Welcome'),
          src: '/images/projects/mercajusto/01-bienvenida.jpg',
          width: 540,
        },
        {
          alt: t('Inicio del comprador en modo oscuro', 'Buyer home in dark mode'),
          height: 1169,
          label: t('Modo oscuro', 'Dark mode'),
          src: '/images/projects/mercajusto/13-inicio-oscuro.jpg',
          width: 540,
        },
      ],
      repoUrl: `${GITHUB_PROFILE_URL}/MercaJusto`,
      repoLabel: viewCode,
      extraRepoUrl: null,
      demoUrl: 'https://mercajusto.vercel.app/',
      demoLabel: openDemo,
      hasCaseStudy: true,
    },
    {
      slug: 'moniwatch',
      name: names.moniWatch,
      platform: t('Wear OS y móvil', 'Wear OS and mobile'),
      layout: 'flow',
      block: 'gold',
      categories: ['personal'],
      description: t(
        'Pagos desde la muñeca con Nequi o tarjeta: el celular configura y el reloj paga.',
        'Payments from your wrist with Nequi or a card: the phone sets it up and the watch pays.',
      ),
      problem: t(
        'Pagar con el celular obliga a sacarlo del bolsillo para compras pequeñas y frecuentes.',
        'Paying with your phone means taking it out of your pocket for small, frequent purchases.',
      ),
      purpose: t(
        'Pagar desde el reloj en pocos toques y saber de inmediato si el dinero se movió.',
        'Pay from the watch in a few taps and know right away whether the money moved.',
      ),
      solution: t(
        'Una app de celular para configurar, una app para Wear OS que paga y un backend que protege cada transacción.',
        'A phone app to set things up, a Wear OS app that pays, and a backend that protects every transaction.',
      ),
      technologies: ['TypeScript', 'PostgreSQL', 'Prisma', 'Docker'],
      frameworks: ['NestJS', 'Expo', 'React Native', 'Wear OS'],
      contribution: solo,
      collaboration: null,
      location: null,
      period: null,
      status: t('Sin demo pública', 'No public demo'),
      verifiedFeatures: t(
        [
          'Vinculación del reloj por código',
          'Pagos idempotentes: reintentar nunca cobra dos veces',
          'Tokens de pago cifrados con AES-256-GCM',
          'Revocación inmediata de un reloj vinculado',
          'Webhooks de Wompi con firma verificada',
        ],
        [
          'Pairing the watch with a code',
          'Idempotent payments: retrying never charges twice',
          'Payment tokens encrypted with AES-256-GCM',
          'Instant revocation of a paired watch',
          'Wompi webhooks with verified signatures',
        ],
      ),
      architecture: t(
        [
          'Tres aplicaciones: backend, celular y reloj',
          'Módulos NestJS de autenticación, métodos de pago, transacciones y webhooks',
          'La tarjeta se tokeniza directo con Wompi; el número nunca llega al backend',
        ],
        [
          'Three apps: backend, phone and watch',
          'NestJS modules for authentication, payment methods, transactions and webhooks',
          'The card is tokenized straight with Wompi; its number never reaches the backend',
        ],
      ),
      flowSteps: t(
        ['El celular configura', 'El backend protege', 'El reloj paga'],
        ['The phone sets up', 'The backend protects', 'The watch pays'],
      ),
      screenshots: [],
      repoUrl: `${GITHUB_PROFILE_URL}/MoniWatch`,
      repoLabel: viewCode,
      extraRepoUrl: null,
      demoUrl: null,
      demoLabel: openDemo,
      hasCaseStudy: true,
    },
    {
      slug: 'reticula',
      name: names.reticula,
      platform: t('Navegador, Windows y Android', 'Browser, Windows and Android'),
      layout: 'compact',
      block: 'stone',
      categories: ['collaborative'],
      description: t(
        'Entrenador de puntería 3D para practicar shooters y coordinación ojo-mano.',
        'A 3D aim trainer to practise for shooters and hand-eye coordination.',
      ),
      problem: t(
        'Quien juega shooters como CS2 o Valorant practica la puntería sin saber cuál de sus habilidades es la que falla.',
        'People who play shooters like CS2 or Valorant practise their aim without knowing which of their skills is the one failing.',
      ),
      purpose: t(
        'Medir la puntería con una evaluación por fases y entrenar después lo que salga más débil.',
        'Measure aim with a phased assessment, then train whatever comes out weakest.',
      ),
      solution: t(
        'Un juego 3D en el navegador con una evaluación de 5 fases que asigna un rango y abre modos de práctica, publicado también para Windows y Android.',
        'A 3D browser game with a 5-phase assessment that assigns a rank and unlocks practice modes, also released for Windows and Android.',
      ),
      technologies: ['JavaScript', 'Web Audio API', 'Vitest'],
      frameworks: ['Three.js', 'Vite', 'Electron', 'Capacitor'],
      contribution: half,
      collaboration: t(
        'Proyecto desarrollado con un compañero de trabajo.',
        'A project built with a colleague.',
      ),
      location: null,
      period: null,
      status: t('En fase beta', 'In beta'),
      verifiedFeatures: t(
        [
          'Evaluación de 5 fases que mide flicking, tracking, reacción y precisión',
          'Ocho modos: dos evaluaciones, historia, campaña, coordinación, infinito, zombi y defensa',
          'Bots humanoides que se mueven de lado, se asoman, se agachan, saltan y disparan',
          'Nueve armas con daño, cadencia y recarga propios',
          'Conversión de sensibilidad entre 8 juegos',
          'Sonidos generados en tiempo real con Web Audio API',
          'Versión para navegador, instalador de Windows y APK de Android',
        ],
        [
          'A 5-phase assessment that measures flicking, tracking, reaction and precision',
          'Eight modes: two assessments, story, campaign, coordination, endless, zombies and defense',
          'Humanoid bots that strafe, peek, crouch, jump and shoot',
          'Nine weapons, each with its own damage, fire rate and reload',
          'Sensitivity conversion between 8 games',
          'Sounds generated in real time with the Web Audio API',
          'A browser version, a Windows installer and an Android APK',
        ],
      ),
      architecture: t(
        [
          'Motor propio sobre Three.js: estados del juego, render, entrada y colisiones',
          'Cada modo implementa una interfaz común y se registra solo',
          'Partidas guardadas en localStorage con versiones y migraciones',
          'Pruebas con Vitest que auditan los mapas con raycasts reales',
        ],
        [
          'Its own engine on top of Three.js: game states, rendering, input and collisions',
          'Every mode implements a shared interface and registers itself',
          'Saves in localStorage, with versions and migrations',
          'Vitest tests that audit the maps with real raycasts',
        ],
      ),
      flowSteps: [],
      screenshots: [
        {
          alt: t(
            'Menú principal de Retícula en el campo de tiro, con el rango del jugador',
            "Retícula's main menu in the shooting range, with the player's rank",
          ),
          height: 1800,
          label: t('Menú', 'Menu'),
          src: '/images/projects/reticula/menu.jpg',
          width: 2880,
        },
        {
          alt: t(
            'Selector de modos de Retícula con la evaluación recomendada',
            "Retícula's mode picker with the recommended assessment",
          ),
          height: 1800,
          label: t('Modos', 'Modes'),
          src: '/images/projects/reticula/modos.jpg',
          width: 2880,
        },
        {
          alt: t('Arsenal de Retícula con las estadísticas del rifle', "Retícula's arsenal with the rifle's stats"),
          height: 1800,
          label: t('Arsenal', 'Arsenal'),
          src: '/images/projects/reticula/arsenal.jpg',
          width: 2880,
        },
      ],
      repoUrl: 'https://github.com/Ju4nK1807/Reticula',
      repoLabel: viewCode,
      extraRepoUrl: null,
      demoUrl: 'https://ju4nk1807.github.io/Reticula/',
      demoLabel: t('Jugar en el navegador', 'Play in the browser'),
      hasCaseStudy: true,
    },
  ]
})

export function getCaseStudies(locale: Locale): readonly Project[] {
  return getProjects(locale).filter(({ hasCaseStudy }) => hasCaseStudy)
}

export function getCaseStudy(slug: string, locale: Locale): Project | undefined {
  return getCaseStudies(locale).find((study) => study.slug === slug)
}
