import { navigationItems } from '@/data/navigation'

export function DesktopNavigation({ activeId }: { activeId: string }) {
  return (
    <nav aria-label="Principal" className="hidden lg:block">
      <ul className="flex gap-7">
        {navigationItems.map(({ id, label }) => (
          <li key={id}>
            <a
              aria-current={activeId === id ? 'true' : undefined}
              className="nav-link"
              href={`#${id}`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
