'use client'

import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DesktopNavigation } from '@/components/navigation/DesktopNavigation'
import { LanguageSwitch } from '@/components/navigation/LanguageSwitch'
import { MobileMenu } from '@/components/navigation/MobileMenu'
import { getNavigationItems } from '@/data/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useLocale, useMessages } from '@/i18n/LocaleProvider'
import { blogPath } from '@/i18n/paths'

const MOBILE_MENU_ID = 'mobile-menu'
const PAGE_CONTENT_ID = 'page-content'
const DESKTOP_MEDIA_QUERY = '(min-width: 64rem)'

export function SiteNavigation() {
  const locale = useLocale()
  const copy = useMessages().header
  const items = getNavigationItems(locale)
  const ids = useMemo(() => items.map(({ id }) => id), [items])
  const activeId = useActiveSection(ids)
  const activeKey = items.find(({ id }) => id === activeId)?.key ?? ''
  const pathname = usePathname()
  const blog = {
    href: blogPath(locale),
    label: copy.blog,
    current: pathname === blogPath(locale) || pathname.startsWith(`${blogPath(locale)}/`),
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  const closeAndRestoreFocus = useCallback(() => {
    setIsMenuOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const pageContent = document.getElementById(PAGE_CONTENT_ID)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAndRestoreFocus()
    }
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false)
    }

    pageContent?.toggleAttribute('inert', true)
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    desktopQuery.addEventListener('change', handleViewportChange)
    firstLinkRef.current?.focus()

    return () => {
      pageContent?.toggleAttribute('inert', false)
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      desktopQuery.removeEventListener('change', handleViewportChange)
    }
  }, [closeAndRestoreFocus, isMenuOpen])

  return (
    <>
      <div className="flex items-center gap-5 lg:gap-8">
        <DesktopNavigation activeKey={activeKey} blog={blog} items={items} label={copy.mainNav} locale={locale} />
        <LanguageSwitch />
        <button
          aria-controls={MOBILE_MENU_ID}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? copy.closeMenu : copy.openMenu}
          className="-mr-2 grid size-11 place-items-center lg:hidden"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          ref={menuButtonRef}
          type="button"
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <MobileMenu
        activeKey={activeKey}
        blog={blog}
        firstLinkRef={firstLinkRef}
        id={MOBILE_MENU_ID}
        isOpen={isMenuOpen}
        items={items}
        label={copy.mobileNav}
        locale={locale}
        onNavigate={() => setIsMenuOpen(false)}
      />
    </>
  )
}
