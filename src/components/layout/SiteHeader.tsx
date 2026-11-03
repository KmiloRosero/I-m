import { profile } from '@/data/profile'

const navigationItems = [
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#contacto', label: 'Contacto' },
] as const

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <a
        className="absolute left-4 top-3 -translate-y-16 bg-sulfur px-3 py-1 text-night focus:translate-y-0"
        href="#contenido"
      >
        Saltar al contenido
      </a>
      <div className="flex items-baseline justify-between px-4 py-5 sm:px-8">
        <a className="font-display font-semibold" href="#inicio">
          {profile.name}
        </a>
        <nav aria-label="Principal">
          <ul className="flex gap-5 sm:gap-8">
            {navigationItems.map(({ href, label }) => (
              <li key={href}>
                <a className="text-link" href={href}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
