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
        if (activeEntry) setActiveId(activeEntry.target.id)
      },
      { rootMargin: VIEWPORT_READING_LINE },
    )

    sectionIds.forEach((id) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [pathname, sectionIds])

  return pathname === '/' ? activeId : ''
}
