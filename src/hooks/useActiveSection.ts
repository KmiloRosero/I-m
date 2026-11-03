'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const VIEWPORT_READING_LINE = '-45% 0px -54% 0px'

export function useActiveSection(sectionIds: readonly string[]): string {
  const pathname = usePathname()
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries.find((entry) => entry.isIntersecting)
        if (!activeEntry) return
        const { target } = activeEntry
        setActiveId(target instanceof HTMLElement && target.dataset['navSection'] ? target.dataset['navSection'] : target.id)
      },
      { rootMargin: VIEWPORT_READING_LINE },
    )

    sectionIds.forEach((id) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
      document.querySelectorAll(`[data-nav-section="${id}"]`).forEach((part) => observer.observe(part))
    })

    return () => observer.disconnect()
  }, [pathname, sectionIds])

  return pathname === '/' ? activeId : ''
}
