import Link from 'next/link'
import { navigationItems } from '@/data/navigation'

export function DesktopNavigation({ activeId }: { activeId: string }) {
  return (
    <nav aria-label="Principal" className="hidden lg:block">
      <ul className="flex gap-7">
        {navigationItems.map(({ id, label }) => (
          <li key={id}>
            <Link
              aria-current={activeId === id ? 'true' : undefined}
              className="nav-link"
              href={`/#${id}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
