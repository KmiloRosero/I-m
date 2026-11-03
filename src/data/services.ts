import { projectNames } from '@/data/projectNames'
import type { Service } from '@/types/service'

const { biomedical, cineTracker, mercaJusto, moniWatch, portfolio } = projectNames

export const services: readonly Service[] = [
  {
    title: 'Interfaces web',
    description: 'Construyo interfaces con React, TypeScript y Tailwind CSS.',
    evidence: [biomedical, portfolio],
  },
  {
    title: 'Páginas responsive',
    description: 'Hago sitios que funcionan en celular, tablet y escritorio.',
    evidence: [portfolio],
  },
  {
    title: 'Backend y APIs',
    description: 'Desarrollo APIs con Node.js o Spring Boot.',
    evidence: [moniWatch, mercaJusto, biomedical],
  },
  {
    title: 'Bases de datos',
    description: 'Integro PostgreSQL, MySQL o SQLite en aplicaciones.',
    evidence: [moniWatch, biomedical, cineTracker],
  },
  {
    title: 'Desarrollo con apoyo de IA',
    description: 'Uso herramientas de IA como apoyo para programar.',
    evidence: [cineTracker, mercaJusto],
  },
]
