import { projectNames } from '@/data/projectNames'
import type { Service } from '@/types/service'

const { biomedical, cineTracker, mercaJusto, moniWatch, portfolio } = projectNames

export const services: readonly Service[] = [
  {
    title: 'Interfaces web',
    description:
      'Construyo interfaces con React, TypeScript y Tailwind CSS, cuidando cada estado y cada interacción.',
    evidence: [biomedical, portfolio],
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
    title: 'Páginas responsive',
    description:
      'Hago sitios que se adaptan a celular, tablet y escritorio, como el que estás viendo ahora.',
    evidence: [portfolio],
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
    title: 'Backend y APIs',
    description:
      'Desarrollo APIs REST con Node.js, NestJS o Spring Boot: autenticación, pedidos, pagos y webhooks.',
    evidence: [moniWatch, mercaJusto, biomedical],
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
    title: 'Bases de datos',
    description:
      'Modelo e integro bases de datos PostgreSQL, MySQL y SQLite, con Prisma o con SQL directo.',
    evidence: [moniWatch, biomedical, cineTracker],
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
    title: 'Desarrollo con apoyo de IA',
    description:
      'Integro APIs de IA en productos reales y uso herramientas de IA como apoyo para programar.',
    evidence: [cineTracker, mercaJusto],
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
