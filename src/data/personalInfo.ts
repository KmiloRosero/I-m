import { perLocale, translator } from '@/i18n/config'
import type { PersonalInfo } from '@/types/personalInfo'

const FIRST_NAME = 'Kmilo'
const LAST_NAME = 'Rosero'
const FULL_NAME = `${FIRST_NAME} ${LAST_NAME}`
const UNIVERSITY = 'Universidad Cooperativa de Colombia'

export const GITHUB_PROFILE_URL = 'https://github.com/KmiloRosero'

export const getPersonalInfo = perLocale((locale): PersonalInfo => {
  const t = translator(locale)
  const degree = t('Ingeniería de Software', 'Software Engineering')

  return {
    name: FULL_NAME,
    alternateName: 'Camilo Rosero',
    firstName: FIRST_NAME,
    lastName: LAST_NAME,
    seoTitle: t(
      `${FULL_NAME} · Desarrollador de software en Pasto, Colombia`,
      `${FULL_NAME} · Software developer in Pasto, Colombia`,
    ),
    photoSrc: '/images/profile/camilo-rosero.webp',
    address: { locality: 'Pasto', region: 'Nariño', country: 'CO' },
    degree,
    technicalDegree: t(
      'Técnico Industrial Especializado en Informática',
      'Industrial Technical High School, specialized in computing',
    ),
    title: t('Ingeniero en Software', 'Software Engineer'),
    heroRoles: t(
      ['Ingeniero\nen Software', 'Desarrollador\nfull-stack', 'Web, móvil\ny escritorio'],
      ['Software\nEngineer', 'Full-stack\ndeveloper', 'Web, mobile\nand desktop'],
    ),
    studies: t(`Estudiante de ${degree}`, `${degree} student`),
    position: t('Desarrollador freelance', 'Freelance developer'),
    availability: t('Disponible para proyectos freelance', 'Available for freelance projects'),
    // Format: https://wa.me/57XXXXXXXXXX (country code, no spaces or +).
    whatsappUrl: null,
    semester: t('Quinto semestre', 'Fifth semester'),
    university: UNIVERSITY,
    location: 'Pasto, Nariño, Colombia',
    email: 'juancamilorose@gmail.com',
    metaDescription: t(
      `Portafolio de Camilo «${FIRST_NAME}» ${LAST_NAME}, desarrollador freelance y estudiante de ${degree} en Pasto, Colombia. Sitios web y apps móviles, de escritorio y para reloj.`,
      `Portfolio of Camilo “${FIRST_NAME}” ${LAST_NAME}, a freelance developer and ${degree} student in Pasto, Colombia. Websites and apps for mobile, desktop and smartwatches.`,
    ),
    about: t(
      `Estudio ${degree} y, mientras avanzo en la carrera, he publicado proyectos web, móviles, de escritorio y para reloj, además de juegos. También he trabajado para diferentes negocios locales en mi ciudad y en municipios de Nariño.`,
      `I study ${degree} and, as I move through the degree, I've published web, mobile, desktop and smartwatch projects, plus games. I've also worked for local businesses in my city and in towns across Nariño.`,
    ),
    personality: t('Soy extrovertido y, a la vez, tranquilo.', "I'm outgoing and, at the same time, calm."),
    workStyle: t('Me gusta trabajar de forma ordenada y con calma.', 'I like to work in an organized, unhurried way.'),
    interests: t(
      [
        'El deporte',
        'Los videojuegos',
        'Salir con mis amigos',
        'Escuchar música mientras conduzco',
        'Amante de las salchipapas y los buenos cafés ☕',
      ],
      [
        'Sports',
        'Video games',
        'Going out with my friends',
        'Listening to music while I drive',
        'A lover of salchipapas and good coffee ☕',
      ],
    ),
    ambition: t(
      'Tengo varios proyectos por construir que quiero que sean revolucionarios, y la meta es que algún día llenen mi garaje de coches.',
      'I have several projects left to build that I want to be revolutionary, and the goal is for them to fill my garage with cars someday.',
    ),
    featuredStack: ['TypeScript', 'React', 'React Native', 'Node.js', 'NestJS', 'Spring Boot', 'PostgreSQL'],
    socialLinks: [
      { label: 'GitHub', url: GITHUB_PROFILE_URL },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/camilo-rosero-35138a42b/' },
    ],
    cvUrl: null,
  }
})
