import { GITHUB_PROFILE_URL } from '@/data/personalInfo'
import { getProjectNames } from '@/data/projectNames'
import { perLocale, translator } from '@/i18n/config'
import { projectPath } from '@/i18n/paths'
import type { ProjectRef, SkillArea } from '@/types/skill'

/** Groups counted as design patterns in the stack stats. */
export const PATTERN_GROUP_IDS: readonly string[] = ['creational', 'structural', 'behavioral']

export const getSkillAreas = perLocale((locale): readonly SkillArea[] => {
  const t = translator(locale)
  const names = getProjectNames(locale)

  const caseStudy = (name: string, slug: string): ProjectRef => ({ name, href: projectPath(slug, locale) })
  const repo = (name: string, repository: string): ProjectRef => ({
    name,
    href: `${GITHUB_PROFILE_URL}/${repository}`,
  })

  // Featured projects link to their case study.
  const BIOMEDICAL = caseStudy(names.biomedical, 'biomedical-waste-platform')
  const CINETRACKER = caseStudy(names.cineTracker, 'cinetracker')
  const MERCAJUSTO = caseStudy(names.mercaJusto, 'mercajusto')
  const MONIWATCH = caseStudy(names.moniWatch, 'moniwatch')
  const RETICULA = caseStudy(names.reticula, 'reticula')
  const PORTFOLIO = repo(names.portfolio, 'I-m')

  // Other public repositories on github.com/KmiloRosero.
  const AI_PROXY_API = repo('AI Proxy · API', 'proxy-backend')
  const AI_PROXY_WEB = repo('AI Proxy · web', 'proxy-fronted')
  const LIBRARY_API = repo(t('API REST de biblioteca', 'Library REST API'), 'API-REST')
  const CONSTRUCTION = repo(t('Gestión de obras', 'Construction management'), 'Construction-management')
  const MUSIC_PLAYER = repo('Kmusic', 'Spotify')
  const TOWER_GAME = repo(t('Juego de torres', 'Tower game'), 'Game-number-one-')
  const TRAFFIC_LIGHT = repo(t('Simulador de semáforo', 'Traffic light simulator'), 'traffic-light')
  const ANALOG_CLOCK = repo(t('Reloj analógico', 'Analog clock'), 'double-circulars')
  const HOSPITAL_QUEUE = repo(t('Cola de hospital', 'Hospital queue'), 'Doubly-Linked-List')
  const TRANSACTIONS = repo(t('Motor de transacciones', 'Transaction engine'), 'Arrays-pilas-colas')
  const CICD_SIMULATOR = repo(t('Simulador CI/CD', 'CI/CD simulator'), 'Simulador-')
  const EMAS = repo(t('Sitio de EMAS (académico)', 'EMAS website (academic)'), 'Emas')
  const SEAT_PICKER = repo('Choose Seats', 'Choose-Seats')
  const APPOINTMENTS = repo('Medical Management System', 'fronted')
  const CONTRACTS = repo(t('Contratos', 'Contracts'), 'Patrones-Software')
  const NOTIFICATIONS_BRIDGE = repo(t('Notificaciones', 'Notifications'), 'Patron-Adapter-y-Bridge')
  const DOCUMENTS = repo(t('Procesador de documentos', 'Document processor'), 'Patr-nFactoryMethod')
  const CLINICS = repo(t('Sistema de clínicas', 'Clinic system'), 'Patro-n-abstract-factory')
  const NOTIFICATIONS = repo(t('Sistema de notificaciones', 'Notification system'), 'Polimorfismo')
  const PUBLISHER = repo(t('Editorial', 'Publisher'), 'Ejercicio-Herencia')
  const BANK = repo(t('Simulador bancario', 'Bank simulator'), 'Banco')
  const STACKS = repo(t('Sistema de pilas', 'Stack system'), 'Estructura-de-datos')
  const SINGLY_LIST = repo(t('Lista simple', 'Singly linked list'), 'listasimple')
  const QUEUES_TS = repo(t('Taller de colas', 'Queues workshop'), 'Taller-colas')
  const LISTS_TS = repo(t('Listas en TypeScript', 'Lists in TypeScript'), 'Listas')

  return [
    {
      id: 'tecnologias',
      label: t('Tecnologías', 'Technologies'),
      intro: t(
        'Lenguajes, frameworks y bases de datos de mis proyectos y repositorios públicos.',
        'Languages, frameworks and databases from my projects and public repositories.',
      ),
      groups: [
        {
          id: 'languages',
          category: t('Lenguajes', 'Languages'),
          technologies: [
            {
              name: 'TypeScript',
              usedIn: [BIOMEDICAL, MERCAJUSTO, MONIWATCH, PORTFOLIO, MUSIC_PLAYER, EMAS, SEAT_PICKER, APPOINTMENTS, QUEUES_TS, LISTS_TS],
            },
            { name: 'JavaScript', usedIn: [CINETRACKER, RETICULA, AI_PROXY_WEB, TOWER_GAME] },
            {
              name: 'Java',
              usedIn: [BIOMEDICAL, LIBRARY_API, CONSTRUCTION, AI_PROXY_API, TOWER_GAME, TRAFFIC_LIGHT, CONTRACTS, DOCUMENTS, CLINICS],
            },
            {
              name: 'Python',
              usedIn: [ANALOG_CLOCK, HOSPITAL_QUEUE, TRANSACTIONS, CICD_SIMULATOR, BANK, STACKS, SINGLY_LIST],
            },
            { name: 'SQL', usedIn: [BIOMEDICAL, CINETRACKER] },
            { name: t('HTML y CSS', 'HTML and CSS'), usedIn: [BIOMEDICAL, CINETRACKER, RETICULA, PORTFOLIO, TOWER_GAME] },
          ],
        },
        {
          id: 'frontend',
          category: 'Frontend',
          technologies: [
            { name: 'React', usedIn: [BIOMEDICAL, CINETRACKER, PORTFOLIO, AI_PROXY_WEB, SEAT_PICKER, APPOINTMENTS] },
            { name: 'Next.js', usedIn: [PORTFOLIO, EMAS] },
            { name: 'Tailwind CSS', usedIn: [BIOMEDICAL, CINETRACKER, PORTFOLIO, EMAS, SEAT_PICKER, AI_PROXY_WEB] },
            { name: 'React Router', usedIn: [AI_PROXY_WEB, APPOINTMENTS] },
            { name: 'Zustand', usedIn: [BIOMEDICAL, MERCAJUSTO, AI_PROXY_WEB] },
            { name: 'Recharts', usedIn: [AI_PROXY_WEB] },
            { name: 'Leaflet', usedIn: [BIOMEDICAL, MERCAJUSTO] },
            { name: 'Three.js', usedIn: [RETICULA] },
          ],
        },
        {
          id: 'mobile-desktop',
          category: t('Móvil y escritorio', 'Mobile and desktop'),
          technologies: [
            { name: 'React Native', usedIn: [MERCAJUSTO, MONIWATCH] },
            { name: 'Expo', usedIn: [MERCAJUSTO, MONIWATCH] },
            { name: 'Electron', usedIn: [CINETRACKER] },
            { name: 'Java Swing', usedIn: [TRAFFIC_LIGHT, NOTIFICATIONS_BRIDGE] },
          ],
        },
        {
          id: 'backend',
          category: 'Backend',
          technologies: [
            { name: 'Spring Boot', usedIn: [BIOMEDICAL, LIBRARY_API, CONSTRUCTION, AI_PROXY_API] },
            { name: 'Spring Data JPA', usedIn: [AI_PROXY_API] },
            { name: 'Node.js', usedIn: [MERCAJUSTO, MONIWATCH, MUSIC_PLAYER] },
            { name: 'Express', usedIn: [MERCAJUSTO, MUSIC_PLAYER] },
            { name: 'NestJS', usedIn: [MONIWATCH] },
            { name: 'FastAPI', usedIn: [HOSPITAL_QUEUE] },
            { name: 'Streamlit', usedIn: [CICD_SIMULATOR] },
          ],
        },
        {
          id: 'databases',
          category: t('Bases de datos', 'Databases'),
          technologies: [
            { name: 'PostgreSQL', usedIn: [MERCAJUSTO, MONIWATCH] },
            { name: 'MySQL', usedIn: [BIOMEDICAL] },
            { name: 'MongoDB', usedIn: [LIBRARY_API, CONSTRUCTION] },
            { name: 'SQLite', usedIn: [CINETRACKER] },
            { name: 'H2', usedIn: [AI_PROXY_API] },
            { name: 'Prisma', usedIn: [MERCAJUSTO, MONIWATCH] },
            { name: 'Supabase', usedIn: [BIOMEDICAL] },
          ],
        },
      ],
    },
    {
      id: 'patrones',
      label: t('Patrones y arquitectura', 'Patterns and architecture'),
      intro: t(
        'Patrones de diseño y formas de organizar el código que he aplicado en proyectos reales.',
        "Design patterns and ways of organizing code that I've applied in real projects.",
      ),
      groups: [
        {
          id: 'creational',
          category: t('Patrones creacionales', 'Creational patterns'),
          technologies: [
            {
              name: 'Factory Method',
              summary: t(
                'Una clase decide qué objeto crear sin que el resto del código dependa de la clase concreta.',
                'A class decides which object to create, so the rest of the code never depends on the concrete class.',
              ),
              usedIn: [BIOMEDICAL, DOCUMENTS, NOTIFICATIONS, ANALOG_CLOCK],
            },
            {
              name: 'Abstract Factory',
              summary: t(
                'Crea familias de objetos relacionados que deben usarse juntos.',
                'Creates families of related objects that are meant to be used together.',
              ),
              usedIn: [BIOMEDICAL, CLINICS],
            },
            {
              name: 'Builder',
              summary: t(
                'Arma objetos complejos paso a paso, con la misma construcción para distintas variantes.',
                'Assembles complex objects step by step, with the same construction for different variants.',
              ),
              usedIn: [BIOMEDICAL, CONTRACTS, TOWER_GAME],
            },
            {
              name: 'Prototype',
              summary: t('Crea objetos nuevos clonando una plantilla existente.', 'Creates new objects by cloning an existing template.'),
              usedIn: [BIOMEDICAL, CONTRACTS],
            },
          ],
        },
        {
          id: 'structural',
          category: t('Patrones estructurales', 'Structural patterns'),
          technologies: [
            {
              name: 'Adapter',
              summary: t(
                'Hace que un servicio heredado encaje en una interfaz nueva sin modificarlo.',
                'Makes a legacy service fit a new interface without changing it.',
              ),
              usedIn: [BIOMEDICAL, NOTIFICATIONS_BRIDGE],
            },
            {
              name: 'Bridge',
              summary: t(
                'Separa lo que se hace de cómo se hace, para que ambos cambien por separado.',
                'Separates what is done from how it is done, so each can change on its own.',
              ),
              usedIn: [BIOMEDICAL, NOTIFICATIONS_BRIDGE],
            },
            {
              name: 'Decorator',
              summary: t(
                'Añade comportamiento a un objeto envolviéndolo, sin crear subclases para cada combinación.',
                'Adds behaviour to an object by wrapping it, without a subclass for every combination.',
              ),
              usedIn: [BIOMEDICAL, TOWER_GAME],
            },
            {
              name: 'Facade',
              summary: t('Ofrece una entrada sencilla a un conjunto de servicios.', 'Offers a simple entry point to a set of services.'),
              usedIn: [MUSIC_PLAYER],
            },
          ],
        },
        {
          id: 'behavioral',
          category: t('Patrones de comportamiento', 'Behavioral patterns'),
          technologies: [
            {
              name: 'State',
              summary: t(
                'El objeto cambia su comportamiento según el estado en el que está.',
                'The object changes its behaviour depending on the state it is in.',
              ),
              usedIn: [TRAFFIC_LIGHT],
            },
            {
              name: 'Strategy',
              summary: t('Algoritmos intercambiables detrás de la misma interfaz.', 'Interchangeable algorithms behind the same interface.'),
              usedIn: [ANALOG_CLOCK],
            },
          ],
        },
        {
          id: 'architecture',
          category: t('Arquitectura', 'Architecture'),
          technologies: [
            {
              name: t('Arquitectura en capas', 'Layered architecture'),
              summary: t(
                'Controladores, servicios y repositorios con una responsabilidad cada uno.',
                'Controllers, services and repositories, each with one responsibility.',
              ),
              usedIn: [BIOMEDICAL, CINETRACKER, LIBRARY_API, AI_PROXY_API, MUSIC_PLAYER, HOSPITAL_QUEUE],
            },
            {
              name: 'API REST',
              usedIn: [BIOMEDICAL, MERCAJUSTO, MONIWATCH, LIBRARY_API, AI_PROXY_API, MUSIC_PLAYER, HOSPITAL_QUEUE],
            },
            {
              name: 'Repository',
              summary: t(
                'El acceso a datos queda detrás de una interfaz, separado de la lógica de negocio.',
                'Data access sits behind an interface, apart from the business logic.',
              ),
              usedIn: [BIOMEDICAL, CINETRACKER, LIBRARY_API, AI_PROXY_API],
            },
            {
              name: 'DTO',
              summary: t(
                'Objetos de entrada y salida que no exponen el modelo interno.',
                "Input and output objects that don't expose the internal model.",
              ),
              usedIn: [LIBRARY_API, AI_PROXY_API, MUSIC_PLAYER],
            },
            {
              name: t('Manejo global de errores', 'Global error handling'),
              usedIn: [LIBRARY_API, AI_PROXY_API, MUSIC_PLAYER],
            },
            {
              name: t('Módulos por funcionalidad', 'Feature modules'),
              usedIn: [BIOMEDICAL, MONIWATCH],
            },
            {
              name: t('Estado con Context', 'State with Context'),
              summary: t('Estado compartido de React con Context y providers.', 'Shared React state with Context and providers.'),
              usedIn: [APPOINTMENTS, EMAS, AI_PROXY_WEB],
            },
          ],
        },
      ],
    },
    {
      id: 'fundamentos',
      label: t('Fundamentos', 'Fundamentals'),
      intro: t(
        'Programación orientada a objetos y estructuras de datos implementadas desde cero.',
        'Object-oriented programming and data structures built from scratch.',
      ),
      groups: [
        {
          id: 'oop',
          category: t('Programación orientada a objetos', 'Object-oriented programming'),
          technologies: [
            { name: t('Herencia', 'Inheritance'), usedIn: [PUBLISHER, NOTIFICATIONS_BRIDGE, TOWER_GAME] },
            { name: t('Polimorfismo', 'Polymorphism'), usedIn: [NOTIFICATIONS, NOTIFICATIONS_BRIDGE] },
            { name: t('Interfaces y abstracción', 'Interfaces and abstraction'), usedIn: [NOTIFICATIONS, CLINICS, ANALOG_CLOCK] },
            { name: t('Encapsulamiento', 'Encapsulation'), usedIn: [BANK] },
          ],
        },
        {
          id: 'data-structures',
          category: t('Estructuras de datos', 'Data structures'),
          technologies: [
            { name: t('Arreglos dinámicos', 'Dynamic arrays'), usedIn: [TRANSACTIONS, ANALOG_CLOCK] },
            { name: t('Pilas', 'Stacks'), usedIn: [STACKS, TRANSACTIONS, ANALOG_CLOCK] },
            { name: t('Colas', 'Queues'), usedIn: [QUEUES_TS, TRANSACTIONS, ANALOG_CLOCK] },
            { name: t('Lista simple', 'Singly linked list'), usedIn: [SINGLY_LIST, LISTS_TS, ANALOG_CLOCK] },
            {
              name: t('Lista doblemente enlazada', 'Doubly linked list'),
              summary: t(
                'Recorre en ambos sentidos, como la lista de reproducción o la fila de pacientes.',
                'Walks both ways, like the playlist or the patient queue.',
              ),
              usedIn: [MUSIC_PLAYER, HOSPITAL_QUEUE, ANALOG_CLOCK],
            },
            {
              name: t('Lista circular doble', 'Circular doubly linked list'),
              summary: t(
                'El final se conecta con el inicio: las horas del reloj giran sin fin.',
                'The end connects to the start: the hours on the clock go round forever.',
              ),
              usedIn: [ANALOG_CLOCK],
            },
          ],
        },
      ],
    },
    {
      id: 'nube',
      label: t('Nube y herramientas', 'Cloud and tools'),
      intro: t('Servicios de AWS, despliegue y herramientas del día a día.', 'AWS services, deployment and everyday tools.'),
      groups: [
        {
          id: 'aws',
          category: 'Amazon Web Services',
          technologies: [
            {
              name: 'EC2',
              summary: t('Servidores virtuales en la nube para desplegar aplicaciones.', 'Virtual servers in the cloud for deploying applications.'),
              usedIn: [],
            },
            { name: 'S3', summary: t('Almacenamiento de archivos en buckets.', 'File storage in buckets.'), usedIn: [] },
            {
              name: 'Lambda',
              summary: t('Funciones sin servidor que se ejecutan por eventos.', 'Serverless functions that run on events.'),
              usedIn: [],
            },
            {
              name: 'IAM',
              summary: t(
                'Usuarios, roles y permisos para controlar el acceso a los recursos.',
                'Users, roles and permissions to control access to resources.',
              ),
              usedIn: [],
            },
            {
              name: 'CloudShell',
              summary: t('Terminal en el navegador para administrar AWS con la CLI.', 'A terminal in the browser to manage AWS with the CLI.'),
              usedIn: [],
            },
            {
              name: 'Cognito',
              summary: t('Registro, inicio de sesión y autenticación de usuarios.', 'User sign-up, sign-in and authentication.'),
              usedIn: [],
            },
          ],
        },
        {
          id: 'deployment',
          category: t('Despliegue y CI/CD', 'Deployment and CI/CD'),
          technologies: [
            { name: 'Vercel', usedIn: [BIOMEDICAL, MERCAJUSTO, PORTFOLIO] },
            { name: 'Railway', usedIn: [BIOMEDICAL, AI_PROXY_API] },
            { name: 'Render', usedIn: [MERCAJUSTO, MONIWATCH] },
            { name: 'Docker', usedIn: [BIOMEDICAL, MONIWATCH, CONSTRUCTION, AI_PROXY_API] },
            { name: 'GitHub Actions', usedIn: [CINETRACKER, CONSTRUCTION] },
          ],
        },
        {
          id: 'tools',
          category: t('Herramientas', 'Tools'),
          technologies: [
            {
              name: t('Git y GitHub', 'Git and GitHub'),
              usedIn: [BIOMEDICAL, CINETRACKER, MERCAJUSTO, MONIWATCH, RETICULA, PORTFOLIO],
            },
            { name: 'Vite', usedIn: [BIOMEDICAL, CINETRACKER, RETICULA, SEAT_PICKER, APPOINTMENTS, AI_PROXY_WEB] },
            { name: 'Maven', usedIn: [LIBRARY_API, AI_PROXY_API] },
            { name: 'Gradle', usedIn: [CONSTRUCTION] },
            { name: 'Vitest', usedIn: [CINETRACKER] },
            { name: 'Jest', usedIn: [MONIWATCH] },
            { name: 'pytest', usedIn: [ANALOG_CLOCK] },
          ],
        },
        {
          id: 'ai',
          category: t('IA y desarrollo asistido', 'AI and assisted development'),
          technologies: [
            { name: 'Claude Code', usedIn: [CINETRACKER, MERCAJUSTO] },
            { name: 'Kiro', usedIn: [CINETRACKER] },
            { name: t('API de Anthropic', 'Anthropic API'), usedIn: [CINETRACKER] },
            { name: t('API de Gemini', 'Gemini API'), usedIn: [CINETRACKER] },
            { name: t('API de OpenAI', 'OpenAI API'), usedIn: [BIOMEDICAL] },
          ],
        },
      ],
    },
  ]
})
