import type { RefObject } from 'react'
import { navigationItems } from '@/data/navigation'

interface MobileMenuProps {
  activeId: string
  firstLinkRef: RefObject<HTMLAnchorElement | null>
  id: string
  isOpen: boolean
  onNavigate: () => void
}

export function MobileMenu({ activeId, firstLinkRef, id, isOpen, onNavigate }: MobileMenuProps) {
  return (
    <nav
      aria-label="Menú móvil"
      className="mobile-menu"
      data-open={isOpen}
      id={id}
      inert={!isOpen}
    >
      <ul className="flex flex-col gap-2">
        {navigationItems.map((item, index) => (
          <li key={item.id}>
            <a
              aria-current={activeId === item.id ? 'true' : undefined}
              className="mobile-menu-link"
              href={`#${item.id}`}
              onClick={onNavigate}
              ref={index === 0 ? firstLinkRef : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
