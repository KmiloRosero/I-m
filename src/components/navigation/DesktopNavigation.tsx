import Link from 'next/link'
import type { NavigationItem, PageLink } from '@/data/navigation'
import type { Locale } from '@/i18n/config'
import { homePath } from '@/i18n/paths'

interface DesktopNavigationProps {
  activeKey: string
  blog: PageLink & { current: boolean }
  items: readonly NavigationItem[]
  label: string
  locale: Locale
}

export function DesktopNavigation({ activeKey, blog, items, label, locale }: DesktopNavigationProps) {
  return (
    <nav aria-label={label} className="hidden lg:block" data-section={activeKey}>
      <ul className="flex gap-7">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              aria-current={activeKey === item.key ? 'true' : undefined}
              className="nav-link"
              href={`${homePath(locale)}#${item.id}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link aria-current={blog.current ? 'page' : undefined} className="nav-link" href={blog.href}>
            {blog.label}
          </Link>
        </li>
      </ul>
    </nav>
  )
}
