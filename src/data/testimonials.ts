import { getProjectNames } from '@/data/projectNames'
import { perLocale, translator } from '@/i18n/config'
import type { Testimonial } from '@/types/testimonial'

const IS_TESTIMONIALS_SECTION_ENABLED = true

export const getTestimonials = perLocale((locale): readonly Testimonial[] => {
  if (!IS_TESTIMONIALS_SECTION_ENABLED) return []
  const t = translator(locale)
  const names = getProjectNames(locale)

  return [
    {
      name: 'Santiago Ortega',
      relationship: t('Compañero de Ingeniería de Software', 'Software Engineering classmate'),
      quote: t(
        'Cuando me trabé con un proyecto, se sentó conmigo y lo sacamos esa misma tarde. Explica sin enredarte.',
        'When I got stuck on a project, he sat down with me and we got it done that same afternoon. He explains things without confusing you.',
      ),
      context: null,
      technologies: [],
    },
    {
      name: 'Camilo Bastidas',
      relationship: t(`Hizo ${names.reticula} conmigo`, `Built ${names.reticula} with me`),
      quote: t(
        'Revisaba cada cambio antes de subirlo y probaba hasta que todo funcionara. Con él el proyecto siempre avanzó.',
        'He reviewed every change before pushing it and tested until everything worked. With him, the project always kept moving.',
      ),
      context: null,
      technologies: ['Three.js', 'JavaScript'],
    },
    {
      name: 'Samuel Moreno',
      relationship: t('Compañero de universidad', 'University classmate'),
      quote: t(
        'Le conté una idea suelta y me devolvió algo que ya se podía usar. Es rápido y cuida los detalles.',
        'I gave him a rough idea and he came back with something I could actually use. He is quick and minds the details.',
      ),
      context: null,
      technologies: [],
    },
  ]
})

export const hasTestimonials = getTestimonials('es').length > 0
