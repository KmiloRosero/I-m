import type { PersonalInfo } from '@/types/personalInfo'

const FIRST_NAME = 'Kmilo'
const LAST_NAME = 'Rosero'
const FULL_NAME = `${FIRST_NAME} ${LAST_NAME}`
const DEGREE = 'Ingeniería de Software'
const UNIVERSITY = 'Universidad Cooperativa de Colombia'

export const GITHUB_PROFILE_URL = 'https://github.com/KmiloRosero'

export const personalInfo: PersonalInfo = {
  name: FULL_NAME,
  alternateName: 'Camilo Rosero',
  firstName: FIRST_NAME,
  lastName: LAST_NAME,
  seoTitle: `${FULL_NAME} · Desarrollador de software en Pasto, Colombia`,
  photoSrc: '/images/profile/camilo-rosero.webp',
  address: { locality: 'Pasto', region: 'Nariño', country: 'CO' },
  degree: DEGREE,
  technicalDegree: 'Técnico Industrial Especializado en Informática',
  title: 'Ingeniero en Software',
  heroRoles: ['Ingeniero\nen Software', 'Desarrollador\nfull-stack', 'Web, móvil\ny escritorio'],
  studies: `Estudiante de ${DEGREE}`,
  position: 'Desarrollador freelance',
  availability: 'Disponible para proyectos freelance',
  // Format: https://wa.me/57XXXXXXXXXX (country code, no spaces or +).
  whatsappUrl: null,
  semester: 'Quinto semestre',
  university: UNIVERSITY,
  location: 'Pasto, Nariño, Colombia',
  email: 'juancamilorose@gmail.com',
  metaDescription: `Portafolio de Camilo «${FIRST_NAME}» ${LAST_NAME}, desarrollador freelance y estudiante de ${DEGREE} en Pasto, Colombia. Sitios web y apps móviles, de escritorio y para reloj.`,
  introduction: `Estudio en la ${UNIVERSITY}, en Pasto. Mis repositorios incluyen aplicaciones web, móviles, de escritorio y para reloj.`,
  about: `Estudio ${DEGREE} y, mientras avanzo en la carrera, he publicado proyectos web, móviles, de escritorio y para reloj, además de juegos. También he trabajado para diferentes negocios locales en mi ciudad y en municipios de Nariño.`,
  personality: 'Soy extrovertido y, a la vez, tranquilo.',
  workStyle: 'Me gusta trabajar de forma ordenada y con calma.',
  interests: [
    'El deporte',
    'Los videojuegos',
    'Salir con mis amigos',
    'Escuchar música mientras conduzco',
    'Amante de las salchipapas y los buenos cafés ☕',
  ],
  ambition:
    'Tengo varios proyectos por construir que quiero que sean revolucionarios, y la meta es que algún día llenen mi garaje de coches.',
  featuredStack: ['TypeScript', 'React', 'React Native', 'Node.js', 'NestJS', 'Spring Boot', 'PostgreSQL'],
  socialLinks: [
    { label: 'GitHub', url: GITHUB_PROFILE_URL },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/camilo-rosero-35138a42b/' },
  ],
  cvUrl: null,
}
