import Link from 'next/link'
import { SiteNavigation } from '@/components/navigation/SiteNavigation'
import { getPersonalInfo } from '@/data/personalInfo'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { sectionHref } from '@/i18n/paths'

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a className="skip-link" href="#contenido">
        {getMessages(locale).header.skipToContent}
      </a>
      <div className="bg-black px-gutter text-white">
        <div className="mx-auto flex h-header max-w-content items-center justify-between gap-4">
          <Link className="font-display font-bold [font-stretch:125%]" href={sectionHref('home', locale)}>
            {getPersonalInfo(locale).name}
          </Link>
          <SiteNavigation />
        </div>
      </div>
    </header>
  )
}
