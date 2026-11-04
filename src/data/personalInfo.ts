import type { PersonalInfo } from '@/types/personalInfo'

const FIRST_NAME = 'Kmilo'
const LAST_NAME = 'Rosero'
const FULL_NAME = `${FIRST_NAME} ${LAST_NAME}`
const DEGREE = 'Ingeniería de Software'
const UNIVERSITY = 'Universidad Cooperativa de Colombia'

export const GITHUB_PROFILE_URL = 'https://github.com/KmiloRosero'

export const personalInfo: PersonalInfo = {
  name: FULL_NAME,
  firstName: FIRST_NAME,
  lastName: LAST_NAME,
  degree: DEGREE,
  title: 'Ingeniero en Software',
  heroRoles: ['Ingeniero en Software', 'Desarrollador full-stack', 'Web, móvil y escritorio'],
  studies: `Estudiante de ${DEGREE}`,
  position: 'Desarrollador junior',
  semester: 'Quinto semestre',
  university: UNIVERSITY,
  location: 'Pasto, Nariño, Colombia',
  email: 'juancamilorose@gmail.com',
  metaDescription: `Portafolio de ${FULL_NAME}, estudiante de ${DEGREE} en la ${UNIVERSITY}, Pasto.`,
  introduction: `Estudio en la ${UNIVERSITY}, en Pasto. Mis repositorios incluyen aplicaciones web, móviles, de escritorio y para reloj.`,
  about: `Estudio ${DEGREE} y, mientras avanzo en la carrera, he publicado proyectos web, móviles, de escritorio y para reloj.`,
  personality: 'Soy extrovertido y, a la vez, tranquilo.',
  workStyle: 'Me gusta trabajar de forma ordenada y con calma.',
  interests: ['El deporte', 'Los videojuegos', 'Salir con mis amigos', 'Escuchar música mientras conduzco'],
  ambition:
    'Tengo varios proyectos por construir que quiero que sean revolucionarios, y la meta es que algún día llenen mi garaje de coches.',
  featuredStack: ['TypeScript', 'React', 'React Native', 'Node.js', 'NestJS', 'Spring Boot', 'PostgreSQL'],
  socialLinks: [
    { label: 'GitHub', url: GITHUB_PROFILE_URL },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/camilo-rosero-35138a42b/' },
  ],
  cvUrl: null,
}
