import { GITHUB_PROFILE_URL } from '@/data/personalInfo'
import { projectNames } from '@/data/projectNames'
import type { ProjectRef, SkillArea } from '@/types/skill'

const caseStudy = (name: string, slug: string): ProjectRef => ({ name, href: `/proyectos/${slug}` })
const repo = (name: string, repository: string): ProjectRef => ({
  name,
  href: `${GITHUB_PROFILE_URL}/${repository}`,
})

// Featured projects link to their case study.
const BIOMEDICAL = caseStudy(projectNames.biomedical, 'biomedical-waste-platform')
const CINETRACKER = caseStudy(projectNames.cineTracker, 'cinetracker')
const MERCAJUSTO = caseStudy(projectNames.mercaJusto, 'mercajusto')
const MONIWATCH = caseStudy(projectNames.moniWatch, 'moniwatch')
const RETICULA = caseStudy(projectNames.reticula, 'reticula')
const PORTFOLIO = repo(projectNames.portfolio, 'I-m')

// Other public repositories on github.com/KmiloRosero.
const AI_PROXY_API = repo('AI Proxy · API', 'proxy-backend')
const AI_PROXY_WEB = repo('AI Proxy · web', 'proxy-fronted')
const LIBRARY_API = repo('API REST de biblioteca', 'API-REST')
const CONSTRUCTION = repo('Gestión de obras', 'Construction-management')
const MUSIC_PLAYER = repo('Reproductor de música', 'Spotify')
const TOWER_GAME = repo('Juego de torres', 'Game-number-one-')
const TRAFFIC_LIGHT = repo('Simulador de semáforo', 'traffic-light')
const ANALOG_CLOCK = repo('Reloj analógico', 'double-circulars')
const HOSPITAL_QUEUE = repo('Cola de hospital', 'Doubly-Linked-List')
const TRANSACTIONS = repo('Motor de transacciones', 'Arrays-pilas-colas')
const CICD_SIMULATOR = repo('Simulador CI/CD', 'Simulador-')
const EMAS = repo('Sitio de EMAS', 'Emas')
const SEAT_PICKER = repo('Selector de asientos', 'Choose-Seats')
const APPOINTMENTS = repo('Panel de citas', 'fronted')
const CONTRACTS = repo('Contratos', 'Patrones-Software')
const NOTIFICATIONS_BRIDGE = repo('Notificaciones', 'Patron-Adapter-y-Bridge')
const DOCUMENTS = repo('Procesador de documentos', 'Patr-nFactoryMethod')
const CLINICS = repo('Sistema de clínicas', 'Patro-n-abstract-factory')
const NOTIFICATIONS = repo('Sistema de notificaciones', 'Polimorfismo')
const PUBLISHER = repo('Editorial', 'Ejercicio-Herencia')
const BANK = repo('Simulador bancario', 'Banco')
const STACKS = repo('Sistema de pilas', 'Estructura-de-datos')
const SINGLY_LIST = repo('Lista simple', 'listasimple')
const QUEUES_TS = repo('Taller de colas', 'Taller-colas')
const LISTS_TS = repo('Listas en TypeScript', 'Listas')

export const skillAreas: readonly SkillArea[] = [
  {
    id: 'tecnologias',
    label: 'Tecnologías',
    intro: 'Lenguajes, frameworks y bases de datos de mis proyectos y repositorios públicos.',
    groups: [
      {
        category: 'Lenguajes',
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
          { name: 'HTML y CSS', usedIn: [BIOMEDICAL, CINETRACKER, RETICULA, PORTFOLIO, TOWER_GAME] },
        ],
      },
      {
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
        category: 'Móvil y escritorio',
        technologies: [
          { name: 'React Native', usedIn: [MERCAJUSTO, MONIWATCH] },
          { name: 'Expo', usedIn: [MERCAJUSTO, MONIWATCH] },
          { name: 'Electron', usedIn: [CINETRACKER] },
          { name: 'Java Swing', usedIn: [TRAFFIC_LIGHT, NOTIFICATIONS_BRIDGE] },
        ],
      },
      {
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
        category: 'Bases de datos',
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
    label: 'Patrones y arquitectura',
    intro: 'Patrones de diseño y formas de organizar el código que he aplicado en proyectos reales.',
    groups: [
      {
        category: 'Patrones creacionales',
        technologies: [
          {
            name: 'Factory Method',
            summary: 'Una clase decide qué objeto crear sin que el resto del código dependa de la clase concreta.',
            usedIn: [BIOMEDICAL, DOCUMENTS, NOTIFICATIONS, ANALOG_CLOCK],
          },
          {
            name: 'Abstract Factory',
            summary: 'Crea familias de objetos relacionados que deben usarse juntos.',
            usedIn: [BIOMEDICAL, CLINICS],
          },
          {
            name: 'Builder',
            summary: 'Arma objetos complejos paso a paso, con la misma construcción para distintas variantes.',
            usedIn: [BIOMEDICAL, CONTRACTS, TOWER_GAME],
          },
          {
            name: 'Prototype',
            summary: 'Crea objetos nuevos clonando una plantilla existente.',
            usedIn: [BIOMEDICAL, CONTRACTS],
          },
        ],
      },
      {
        category: 'Patrones estructurales',
        technologies: [
          {
            name: 'Adapter',
            summary: 'Hace que un servicio heredado encaje en una interfaz nueva sin modificarlo.',
            usedIn: [BIOMEDICAL, NOTIFICATIONS_BRIDGE],
          },
          {
            name: 'Bridge',
            summary: 'Separa lo que se hace de cómo se hace, para que ambos cambien por separado.',
            usedIn: [BIOMEDICAL, NOTIFICATIONS_BRIDGE],
          },
          {
            name: 'Decorator',
            summary: 'Añade comportamiento a un objeto envolviéndolo, sin crear subclases para cada combinación.',
            usedIn: [BIOMEDICAL, TOWER_GAME],
          },
          {
            name: 'Facade',
            summary: 'Ofrece una entrada sencilla a un conjunto de servicios.',
            usedIn: [MUSIC_PLAYER],
          },
        ],
      },
      {
        category: 'Patrones de comportamiento',
        technologies: [
          {
            name: 'State',
            summary: 'El objeto cambia su comportamiento según el estado en el que está.',
            usedIn: [TRAFFIC_LIGHT],
          },
          {
            name: 'Strategy',
            summary: 'Algoritmos intercambiables detrás de la misma interfaz.',
            usedIn: [ANALOG_CLOCK],
          },
        ],
      },
      {
        category: 'Arquitectura',
        technologies: [
          {
            name: 'Arquitectura en capas',
            summary: 'Controladores, servicios y repositorios con una responsabilidad cada uno.',
            usedIn: [BIOMEDICAL, CINETRACKER, LIBRARY_API, AI_PROXY_API, MUSIC_PLAYER, HOSPITAL_QUEUE],
          },
          {
            name: 'API REST',
            usedIn: [BIOMEDICAL, MERCAJUSTO, MONIWATCH, LIBRARY_API, AI_PROXY_API, MUSIC_PLAYER, HOSPITAL_QUEUE],
          },
          {
            name: 'Repository',
            summary: 'El acceso a datos queda detrás de una interfaz, separado de la lógica de negocio.',
            usedIn: [BIOMEDICAL, CINETRACKER, LIBRARY_API, AI_PROXY_API],
          },
          {
            name: 'DTO',
            summary: 'Objetos de entrada y salida que no exponen el modelo interno.',
            usedIn: [LIBRARY_API, AI_PROXY_API, MUSIC_PLAYER],
          },
          {
            name: 'Manejo global de errores',
            usedIn: [LIBRARY_API, AI_PROXY_API, MUSIC_PLAYER],
          },
          {
            name: 'Módulos por funcionalidad',
            usedIn: [BIOMEDICAL, MONIWATCH],
          },
          {
            name: 'Estado con Context',
            summary: 'Estado compartido de React con Context y providers.',
            usedIn: [APPOINTMENTS, EMAS, AI_PROXY_WEB],
          },
        ],
      },
    ],
  },
  {
    id: 'fundamentos',
    label: 'Fundamentos',
    intro: 'Programación orientada a objetos y estructuras de datos implementadas desde cero.',
    groups: [
      {
        category: 'Programación orientada a objetos',
        technologies: [
          { name: 'Herencia', usedIn: [PUBLISHER, NOTIFICATIONS_BRIDGE, TOWER_GAME] },
          { name: 'Polimorfismo', usedIn: [NOTIFICATIONS, NOTIFICATIONS_BRIDGE] },
          { name: 'Interfaces y abstracción', usedIn: [NOTIFICATIONS, CLINICS, ANALOG_CLOCK] },
          { name: 'Encapsulamiento', usedIn: [BANK] },
        ],
      },
      {
        category: 'Estructuras de datos',
        technologies: [
          { name: 'Arreglos dinámicos', usedIn: [TRANSACTIONS, ANALOG_CLOCK] },
          { name: 'Pilas', usedIn: [STACKS, TRANSACTIONS, ANALOG_CLOCK] },
          { name: 'Colas', usedIn: [QUEUES_TS, TRANSACTIONS, ANALOG_CLOCK] },
          { name: 'Lista simple', usedIn: [SINGLY_LIST, LISTS_TS, ANALOG_CLOCK] },
          {
            name: 'Lista doblemente enlazada',
            summary: 'Recorre en ambos sentidos, como la lista de reproducción o la fila de pacientes.',
            usedIn: [MUSIC_PLAYER, HOSPITAL_QUEUE, ANALOG_CLOCK],
          },
          {
            name: 'Lista circular doble',
            summary: 'El final se conecta con el inicio: las horas del reloj giran sin fin.',
            usedIn: [ANALOG_CLOCK],
          },
        ],
      },
    ],
  },
  {
    id: 'nube',
    label: 'Nube y herramientas',
    intro: 'Servicios de AWS, despliegue y herramientas del día a día.',
    groups: [
      {
        category: 'Amazon Web Services',
        technologies: [
          { name: 'EC2', summary: 'Servidores virtuales en la nube para desplegar aplicaciones.', usedIn: [] },
          { name: 'S3', summary: 'Almacenamiento de archivos en buckets.', usedIn: [] },
          { name: 'Lambda', summary: 'Funciones sin servidor que se ejecutan por eventos.', usedIn: [] },
          { name: 'IAM', summary: 'Usuarios, roles y permisos para controlar el acceso a los recursos.', usedIn: [] },
          { name: 'CloudShell', summary: 'Terminal en el navegador para administrar AWS con la CLI.', usedIn: [] },
          { name: 'Cognito', summary: 'Registro, inicio de sesión y autenticación de usuarios.', usedIn: [] },
        ],
      },
      {
        category: 'Despliegue y CI/CD',
        technologies: [
          { name: 'Vercel', usedIn: [BIOMEDICAL, MERCAJUSTO, PORTFOLIO] },
          { name: 'Railway', usedIn: [BIOMEDICAL, AI_PROXY_API] },
          { name: 'Render', usedIn: [MERCAJUSTO, MONIWATCH] },
          { name: 'Docker', usedIn: [BIOMEDICAL, MONIWATCH, CONSTRUCTION, AI_PROXY_API] },
          { name: 'GitHub Actions', usedIn: [CINETRACKER, CONSTRUCTION] },
        ],
      },
      {
        category: 'Herramientas',
        technologies: [
          {
            name: 'Git y GitHub',
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
        category: 'IA y desarrollo asistido',
        technologies: [
          { name: 'Claude Code', usedIn: [CINETRACKER, MERCAJUSTO] },
          { name: 'Kiro', usedIn: [CINETRACKER] },
          { name: 'API de Anthropic', usedIn: [CINETRACKER] },
          { name: 'API de Gemini', usedIn: [CINETRACKER] },
          { name: 'API de OpenAI', usedIn: [BIOMEDICAL] },
        ],
      },
    ],
  },
]
