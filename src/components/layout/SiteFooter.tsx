import Link from 'next/link'
import { ExternalAwareLink } from '@/components/common/ExternalAwareLink'
import { CurrentYear } from '@/components/layout/CurrentYear'
import { getNavigationItems } from '@/data/navigation'
import { getPersonalInfo } from '@/data/personalInfo'
import { translator, type Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import { homePath } from '@/i18n/paths'
import { getProfessionalLinks } from '@/utils/professionalLinks'

export function SiteFooter({ locale }: { locale: Locale }) {
  const info = getPersonalInfo(locale)
  const t = translator(locale)

  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-content">
        <div className="site-footer-grid">
          <div>
            <p className="site-footer-name">{info.name}</p>
            <p className="lead-text mt-3 max-w-[32ch]">
              {info.studies} {t('y', 'and')} {info.position.toLowerCase()}.
            </p>
          </div>

          <ul className="flex flex-col gap-1">
            {getProfessionalLinks(locale).map((link) => (
              <li key={link.url}>
                <ExternalAwareLink {...link} locale={locale} />
              </li>
            ))}
          </ul>

          <nav aria-label={getMessages(locale).footer.nav}>
            <ul className="site-footer-links">
              {getNavigationItems(locale).map(({ id, key, label }) => (
                <li key={key}>
                  <Link className="text-link" href={`${homePath(locale)}#${id}`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-12 border-t-2 border-white pt-4">
          © <CurrentYear initialYear={new Date().getFullYear()} /> {info.name}. {info.location}.
        </p>
      </div>
    </footer>
  )
}
