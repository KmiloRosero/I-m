'use client'

import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DesktopNavigation } from '@/components/navigation/DesktopNavigation'
import { MobileMenu } from '@/components/navigation/MobileMenu'
import { sectionIds } from '@/data/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'

const MOBILE_MENU_ID = 'mobile-menu'
const PAGE_CONTENT_ID = 'page-content'
const DESKTOP_MEDIA_QUERY = '(min-width: 64rem)'

export function SiteNavigation() {
  const activeId = useActiveSection(sectionIds)
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
      <DesktopNavigation activeId={activeId} />
      <button
        aria-controls={MOBILE_MENU_ID}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        className="-mr-2 grid size-11 place-items-center lg:hidden"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        ref={menuButtonRef}
        type="button"
      >
        {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <MobileMenu
        activeId={activeId}
        firstLinkRef={firstLinkRef}
        id={MOBILE_MENU_ID}
        isOpen={isMenuOpen}
        onNavigate={() => setIsMenuOpen(false)}
      />
    </>
  )
}
