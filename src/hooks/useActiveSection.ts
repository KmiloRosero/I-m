'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const VIEWPORT_READING_LINE = '-45% 0px -54% 0px'

function getSectionId(element: Element): string {
  return element instanceof HTMLElement && element.dataset['navSection']
    ? element.dataset['navSection']
    : element.id
}

export function useActiveSection(sectionIds: readonly string[]): string {
  const pathname = usePathname()
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const visibleElements = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) visibleElements.add(target)
          else visibleElements.delete(target)
        })
        const visibleIds = new Set([...visibleElements].map(getSectionId))
        const latestId = sectionIds.findLast((id) => visibleIds.has(id))
        if (latestId) setActiveId(latestId)
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
