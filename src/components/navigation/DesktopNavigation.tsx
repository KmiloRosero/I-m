import Link from 'next/link'
import { getSectionHref, navigationItems } from '@/data/navigation'

export function DesktopNavigation({ activeId }: { activeId: string }) {
  return (
    <nav aria-label="Principal" className="hidden lg:block" data-section={activeId}>
      <ul className="flex gap-7">
        {navigationItems.map(({ id, label }) => (
          <li key={id}>
            <Link
              aria-current={activeId === id ? 'true' : undefined}
              className="nav-link"
              href={getSectionHref(id)}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
