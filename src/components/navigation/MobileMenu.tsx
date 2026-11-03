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
      className="mobile-menu absolute inset-x-0 top-16 -z-10 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-yellow px-4 py-8 text-black lg:hidden"
      data-open={isOpen}
      id={id}
      inert={!isOpen}
    >
      <ul className="flex flex-col gap-2">
        {navigationItems.map((item, index) => (
          <li key={item.id}>
            <a
              aria-current={activeId === item.id ? 'true' : undefined}
              className="block py-1 font-display text-[clamp(2rem,10vw,3.5rem)] leading-tight font-bold [font-stretch:125%] aria-[current=true]:text-cobalt"
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
