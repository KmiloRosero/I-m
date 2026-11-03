import { visibleTestimonials } from '@/data/testimonials'

interface NavigationItem {
  id: string
  label: string
}

const testimonialItems: readonly NavigationItem[] =
  visibleTestimonials.length > 0 ? [{ id: 'testimonios', label: 'Testimonios' }] : []

export const navigationItems: readonly NavigationItem[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'stack', label: 'Stack' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'proyectos', label: 'Proyectos' },
  ...testimonialItems,
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'contacto', label: 'Contacto' },
]

export function getSectionHref(id: string): string {
  return `/#${id}`
}

export const sectionIds: readonly string[] = navigationItems.map(({ id }) => id)
