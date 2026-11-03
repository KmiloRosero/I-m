export const navigationItems = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'contacto', label: 'Contacto' },
] as const

export const sectionIds: readonly string[] = ['inicio', ...navigationItems.map(({ id }) => id)]
