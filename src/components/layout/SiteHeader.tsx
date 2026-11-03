'use client'

import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { navigationItems, sectionIds } from '@/data/navigation'
import { profile } from '@/data/profile'
import { useActiveSection } from '@/hooks/useActiveSection'

const MOBILE_MENU_ID = 'mobile-menu'
const PAGE_CONTENT_ID = 'page-content'

export function SiteHeader() {
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

    pageContent?.toggleAttribute('inert', true)
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    firstLinkRef.current?.focus()

    return () => {
      pageContent?.toggleAttribute('inert', false)
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeAndRestoreFocus, isMenuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        className="absolute top-2 left-4 z-10 -translate-y-20 bg-yellow px-4 py-2 text-black focus:translate-y-0"
        href="#contenido"
      >
        Saltar al contenido
      </a>
      <div className="flex h-16 items-center justify-between bg-black px-4 text-white sm:px-8">
        <a className="font-display font-bold [font-stretch:125%]" href="#inicio">
          {profile.name}
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex gap-7">
            {navigationItems.map(({ id, label }) => (
              <li key={id}>
                <a
                  aria-current={activeId === id ? 'true' : undefined}
                  className="relative block py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:origin-left after:scale-x-0 after:bg-yellow after:transition-transform after:duration-200 after:ease-(--ease-out-strong) aria-[current=true]:after:scale-x-100 motion-reduce:after:transition-none"
                  href={`#${id}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

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
      </div>

      <MobileMenu
        activeId={activeId}
        firstLinkRef={firstLinkRef}
        id={MOBILE_MENU_ID}
        isOpen={isMenuOpen}
        onNavigate={() => setIsMenuOpen(false)}
      />
    </header>
  )
}
