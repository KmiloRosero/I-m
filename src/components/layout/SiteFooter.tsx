import Link from 'next/link'
import { ExternalAwareLink } from '@/components/common/ExternalAwareLink'
import { CurrentYear } from '@/components/layout/CurrentYear'
import { navigationItems } from '@/data/navigation'
import { personalInfo } from '@/data/personalInfo'
import { getProfessionalLinks } from '@/utils/professionalLinks'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-content">
        <div className="site-footer-grid">
          <div>
            <p className="site-footer-name">{personalInfo.name}</p>
            <p className="lead-text mt-3 max-w-[32ch]">
              {personalInfo.studies} y {personalInfo.position.toLowerCase()}.
            </p>
          </div>

          <ul className="flex flex-col gap-1">
            {getProfessionalLinks().map((link) => (
              <li key={link.url}>
                <ExternalAwareLink {...link} />
              </li>
            ))}
          </ul>

          <nav aria-label="Pie de página">
            <ul className="site-footer-links">
              {navigationItems.map(({ id, label }) => (
                <li key={id}>
                  <Link className="text-link" href={`/#${id}`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-12 border-t-2 border-white pt-4">
          © <CurrentYear initialYear={new Date().getFullYear()} /> {personalInfo.name}.{' '}
          {personalInfo.location}.
        </p>
      </div>
    </footer>
  )
}
