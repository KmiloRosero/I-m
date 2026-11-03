import { projectNames } from '@/data/projectNames'
import type { SkillGroup } from '@/types/skill'

const {
  biomedical: BIOMEDICAL,
  cineTracker: CINETRACKER,
  mercaJusto: MERCAJUSTO,
  moniWatch: MONIWATCH,
  portfolio: PORTFOLIO,
  reticula: RETICULA,
} = projectNames

export const skillGroups: readonly SkillGroup[] = [
  {
    category: 'Lenguajes',
    technologies: [
      { name: 'TypeScript', usedIn: [BIOMEDICAL, MERCAJUSTO, MONIWATCH, PORTFOLIO] },
      { name: 'JavaScript', usedIn: [CINETRACKER, RETICULA] },
      { name: 'Java', usedIn: [BIOMEDICAL] },
      { name: 'SQL', usedIn: [BIOMEDICAL, CINETRACKER] },
    ],
  },
  {
    category: 'Frontend',
    technologies: [
      { name: 'React', usedIn: [BIOMEDICAL, CINETRACKER, PORTFOLIO] },
      { name: 'Tailwind CSS', usedIn: [BIOMEDICAL, CINETRACKER, PORTFOLIO] },
      { name: 'HTML y CSS', usedIn: [BIOMEDICAL, CINETRACKER, RETICULA, PORTFOLIO] },
    ],
  },
  {
    category: 'Backend',
    technologies: [
      { name: 'Node.js', usedIn: [MERCAJUSTO, MONIWATCH] },
      { name: 'Express', usedIn: [MERCAJUSTO] },
      { name: 'NestJS', usedIn: [MONIWATCH] },
      { name: 'Spring Boot', usedIn: [BIOMEDICAL] },
    ],
  },
  {
    category: 'Frameworks y librerías',
    technologies: [
      { name: 'Next.js', usedIn: [PORTFOLIO] },
      { name: 'React Native', usedIn: [MERCAJUSTO, MONIWATCH] },
      { name: 'Expo', usedIn: [MERCAJUSTO, MONIWATCH] },
      { name: 'Electron', usedIn: [CINETRACKER] },
      { name: 'Three.js', usedIn: [RETICULA] },
      { name: 'Zustand', usedIn: [BIOMEDICAL, MERCAJUSTO] },
      { name: 'Leaflet', usedIn: [BIOMEDICAL, MERCAJUSTO] },
    ],
  },
  {
    category: 'Bases de datos',
    technologies: [
      { name: 'PostgreSQL', usedIn: [MERCAJUSTO, MONIWATCH] },
      { name: 'MySQL', usedIn: [BIOMEDICAL] },
      { name: 'SQLite', usedIn: [CINETRACKER] },
      { name: 'Prisma', usedIn: [MERCAJUSTO, MONIWATCH] },
      { name: 'Supabase', usedIn: [BIOMEDICAL] },
    ],
  },
  {
    category: 'Herramientas',
    technologies: [
      {
        name: 'Git y GitHub',
        usedIn: [BIOMEDICAL, CINETRACKER, MERCAJUSTO, MONIWATCH, RETICULA, PORTFOLIO],
      },
      { name: 'Vite', usedIn: [BIOMEDICAL, CINETRACKER, RETICULA] },
      { name: 'Docker', usedIn: [BIOMEDICAL, MONIWATCH] },
      { name: 'Vitest', usedIn: [CINETRACKER] },
      { name: 'Jest', usedIn: [MONIWATCH] },
    ],
  },
  {
    category: 'Nube y despliegue',
    technologies: [
      { name: 'Vercel', usedIn: [BIOMEDICAL, MERCAJUSTO] },
      { name: 'Railway', usedIn: [BIOMEDICAL] },
      { name: 'Render', usedIn: [MERCAJUSTO, MONIWATCH] },
      { name: 'GitHub Actions', usedIn: [CINETRACKER] },
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
]
