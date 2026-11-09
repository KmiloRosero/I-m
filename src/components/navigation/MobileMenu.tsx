import Link from 'next/link'
import type { RefObject } from 'react'
import type { NavigationItem } from '@/data/navigation'
import type { Locale } from '@/i18n/config'
import { homePath } from '@/i18n/paths'

interface MobileMenuProps {
  activeKey: string
  firstLinkRef: RefObject<HTMLAnchorElement | null>
  id: string
  isOpen: boolean
  items: readonly NavigationItem[]
  label: string
  locale: Locale
  onNavigate: () => void
}

export function MobileMenu({ activeKey, firstLinkRef, id, isOpen, items, label, locale, onNavigate }: MobileMenuProps) {
  return (
    <nav aria-label={label} className="mobile-menu" data-open={isOpen} id={id} inert={!isOpen}>
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={item.key}>
            <Link
              aria-current={activeKey === item.key ? 'true' : undefined}
              className="mobile-menu-link"
              href={`${homePath(locale)}#${item.id}`}
              onClick={onNavigate}
              ref={index === 0 ? firstLinkRef : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
