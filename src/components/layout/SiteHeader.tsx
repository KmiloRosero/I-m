import Link from 'next/link'
import { SiteNavigation } from '@/components/navigation/SiteNavigation'
import { getSectionHref } from '@/data/navigation'
import { personalInfo } from '@/data/personalInfo'

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="bg-black px-gutter text-white">
        <div className="mx-auto flex h-header max-w-content items-center justify-between">
          <Link className="font-display font-bold [font-stretch:125%]" href={getSectionHref('inicio')}>
            {personalInfo.name}
          </Link>
          <SiteNavigation />
        </div>
      </div>
    </header>
  )
}
